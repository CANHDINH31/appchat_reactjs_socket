import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useDispatch, useSelector } from "react-redux";
import {
  createConversation,
  getChat,
  getCurrentChat,
  logoutChat,
} from "../redux/chatSlice";
import { format } from "timeago.js";
import { useRef } from "react";
import { getContactPeople, logout } from "../redux/userSlice";
import { groupObjectByConversationId } from "../useHooks/groupObjectByConversationId";
import { v4 as uuidv4 } from "uuid";

const Container = styled.div`
  flex: 2;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const HeaderChat = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImgUser = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const NameFeature = styled.div`
  color: #333;
  font-weight: 700;
  font-size: 18px;
`;

const Feature = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
`;

const Search = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  gap: 10px;
`;

const Back = styled(ArrowBackOutlinedIcon)``;

const WrapInput = styled.div`
  flex: 1;
  gap: 5px;
  display: flex;
  align-items: center;
  padding: 4px 10px;
  min-height: 40px;
  border-radius: 20px;
  background-color: rgba(134, 142, 153, 0.1);
`;
const InputSearch = styled.input`
  width: 100%;
  padding-left: 10px;
  outline: none;
  border: none;
  font-size: 14px;
  color: #333;
  font-weight: 400;
  background-color: transparent;
`;

const UserList = styled.div`
  height: calc(100vh - 121px);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  & > span {
    text-align: center;
    margin-top: 20px;
    color: #333;
    font-weight: 500;
  }
`;
const UserItem = styled.div`
  padding: 10px 20px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  &:hover {
    background-color: rgba(134, 142, 153, 0.2);
  }
  position: relative;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: #5ad539;
  position: absolute;
  bottom: 4px;
  left: 46px;
`;

const UserName = styled.div`
  color: #333;
  font-weight: 600;
  font-size: 14px;
`;

const UserText = styled.div`
  width: 75%;
  padding-right: 20px;
  color: #666;
  font-weight: 400;
  font-size: 13px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;
const UserTime = styled.div`
  color: #666;
  font-weight: 400;
  font-size: 12px;
`;
const UserDesc = styled.div`
  width: 100%;
  display: flex;
`;

const HistoryChat = ({ socket }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const arrayUser = useSelector((state) => state.user.arrayUser);
  const arrayChat = useSelector((state) => state.chat.arrayChat);
  const arrayMessage = useSelector((state) => state.chat.arrayMessage);
  const listUsersOnline = useSelector((state) => state.user.listUsersIdOnline);

  const dispatch = useDispatch();

  const [lastestMessageWithOtherUser, setLastestMessageWithOtherUser] =
    useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const selectChat = (convesationId, contactPeopleId) => {
    const contactPeople = arrayUser.find((i) => i.id === contactPeopleId);

    dispatch(getCurrentChat(convesationId));
    dispatch(getContactPeople(contactPeople));
  };

  const selectChatInSearch = (contactPeopleId) => {
    const arrayPeopleId = [contactPeopleId, currentUser.id];

    const data = arrayChat.find(
      (i) =>
        [...i.arrayPeopleId].sort().join(",") ===
        [...arrayPeopleId].sort().join(",")
    );

    if (data) {
      const contactPeople = arrayUser.find((i) => i.id === contactPeopleId);
      dispatch(getCurrentChat(data.conversationId));
      dispatch(getContactPeople(contactPeople));
    } else {
      const contactPeople = arrayUser.find((i) => i.id === contactPeopleId);

      dispatch(
        createConversation({
          conversationId: uuidv4(),
          arrayPeopleId: [contactPeopleId, currentUser.id],
        })
      );
      dispatch(getContactPeople(contactPeople));
    }
  };

  const handleSearch = (e) => {
    const data = arrayUser.filter(
      (user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) &&
        user.name.toLowerCase() !== currentUser.name.toLowerCase()
    );

    setUserSearch(data);
    setInputSearch(e.target.value);
  };

  const logOut = () => {
    socket.current.disconnect();
    dispatch(logout());
    dispatch(logoutChat());
  };

  useEffect(() => {
    const listConversationId = arrayChat
      .filter((item) => {
        return item.arrayPeopleId.includes(currentUser.id);
      })
      .map((item) => item.conversationId);

    const messageInlistConversationId = arrayMessage.filter((item) => {
      return listConversationId.includes(item.conversationId);
    });

    let data = [];

    messageInlistConversationId.forEach((item) => {
      arrayChat.forEach((subitem) => {
        if (subitem.conversationId === item.conversationId) {
          let newData = {
            ...item,
            contactPeopleId: subitem.arrayPeopleId.filter(
              (i) => i !== currentUser.id
            )[0],
          };
          data.push(newData);
        }
      });
    });

    const messageGroupByConversationId = Object.values(
      groupObjectByConversationId(data, "conversationId")
    );

    const messageGroupByConversationIdSortByTime = messageGroupByConversationId
      .map((item) =>
        item.sort((a, b) => (a.time < b.time ? 1 : b.time < a.time ? -1 : 0))
      )
      .map((item) => item[0]);

    setLastestMessageWithOtherUser(messageGroupByConversationIdSortByTime);
  }, [arrayMessage]);

  return (
    <Container>
      <HeaderChat>
        <ImgUser src={currentUser.avatar} />
        <NameFeature>Chat</NameFeature>
        <Feature>
          <AddCircleIcon style={{ fontSize: "20px" }} />
          <EditLocationOutlinedIcon style={{ fontSize: "20px" }} />
          <ExitToAppIcon style={{ fontSize: "20px" }} onClick={logOut} />
        </Feature>
      </HeaderChat>
      <Search>
        <WrapInput>
          <SearchOutlinedIcon style={{ fontSize: "24px", color: "#333" }} />

          <InputSearch
            placeholder="Tìm kiếm cuộc trò chuyện"
            onChange={handleSearch}
            value={inputSearch}
          />
        </WrapInput>
      </Search>
      <UserList>
        {inputSearch ? (
          userSearch.length > 0 ? (
            userSearch.map((item) => (
              <UserItem
                key={item.id}
                onClick={() => selectChatInSearch(item.id)}
              >
                <UserImg src={item.avatar} />
                {listUsersOnline.map((i) => i.userId).includes(item.id) && (
                  <Dot></Dot>
                )}

                <UserInfo>
                  <UserName>{item.name}</UserName>
                </UserInfo>
              </UserItem>
            ))
          ) : (
            <span>Không có kết quả tìm kiếm</span>
          )
        ) : (
          lastestMessageWithOtherUser.map((item) => (
            <UserItem
              key={item.id}
              onClick={() =>
                selectChat(item.conversationId, item.contactPeopleId)
              }
            >
              <UserImg
                src={
                  arrayUser.find((user) => user.id === item.contactPeopleId)
                    .avatar
                }
              />
              {listUsersOnline
                .map((i) => i.userId)
                .includes(item.contactPeopleId) && <Dot></Dot>}

              <UserInfo>
                <UserName>
                  {
                    arrayUser.find((user) => user.id === item.contactPeopleId)
                      .name
                  }
                </UserName>

                <UserDesc>
                  <UserText>
                    {item.senderId === currentUser.id ? "Bạn: " : ""}
                    {item.text}
                  </UserText>
                  <UserTime>{format(item.time)}</UserTime>
                </UserDesc>
              </UserInfo>
            </UserItem>
          ))
        )}
      </UserList>
    </Container>
  );
};

export default HistoryChat;
