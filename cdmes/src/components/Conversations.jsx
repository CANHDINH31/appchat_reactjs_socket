import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import CallIcon from "@mui/icons-material/Call";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ImageIcon from "@mui/icons-material/Image";
import AttachmentIcon from "@mui/icons-material/Attachment";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";
import { send } from "../redux/chatSlice";
import { addUserOnline } from "../redux/userSlice";

const Container = styled.div`
  flex: 5.5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const Wrap = styled.div``;

const Header = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const OpenConversation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 48px;
  color: #999;
  font-weight: 500;
`;

const LeftHeader = styled.div`
  display: flex;
  gap: 20px;
`;

const RightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  & > svg {
    font-size: 28px;
    color: #1877f2;
  }
  cursor: pointer;
`;

const ImgUser = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const NameInfo = styled.div`
  color: #333;
  font-weight: 600;
  font-size: 14px;
`;

const TimeInfo = styled.div`
  color: #666;
  font-weight: 400;
  font-size: 13px;
`;

const ChatWrapper = styled.div`
  /* flex: 1; */
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 230px);
  overflow-y: scroll;
`;

const ChatItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${(props) => (props.owner ? "flex-end" : "flex-start")};
`;
const ImgChat = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;
const Content = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  flex-direction: ${(props) => (props.owner ? "row-reverse" : "row")};
`;
const Desc = styled.div`
  background-color: ${(props) =>
    props.owner ? "rgba(134, 142, 153, 0.1)" : "rgb(0, 132, 255)"};
  color: ${(props) => (props.owner ? "#333" : "white")};
  font-weight: 500;
  line-height: 30px;
  padding: 0 16px;
  border-radius: 30px;
  font-size: 14px;
`;
const Time = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const PostChat = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  & > svg {
    font-size: 24px;
    color: #1877f2;
  }
`;

const PostChatGroupIcon = styled.div`
  display: flex;
  aligin-items: center;
  gap: 8px;
  & > svg {
    font-size: 24px;
    color: #1877f2;
  }
`;

const InputChat = styled.textarea`
  resize: none;
  flex: 1;
  padding: 10px 20px;
  color: #333;
  font-weight: 400;
  font-size: 14px;
  outline: none;
  border: none;
  border-radius: 10px;
  width: 80%;
  background-color: rgba(134, 142, 153, 0.1);
`;

const Conversations = ({ setOnlineId }) => {
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const contactPeople = useSelector((state) => state.user.contactPeople);
  const currentUser = useSelector((state) => state.user.currentUser);
  const arrayMessage = useSelector((state) => state.chat.arrayMessage);
  const arrayUser = useSelector((state) => state.user.arrayUser);

  const dispatch = useDispatch();

  const [listMessages, setListMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const inputRef = useRef();
  const scrollRef = useRef();
  const socket = useRef();

  const sendMessage = async () => {
    socket.current.emit("sendMessage", {
      conversationId: currentChatId,
      senderId: currentUser.id,
      text: inputMessage,
      time: Date.now(),
      receiverId: contactPeople.id,
    });

    dispatch(
      send({
        conversationId: currentChatId,
        senderId: currentUser.id,
        text: inputMessage,
        time: Date.now(),
      })
    );
    setListMessages((prev) => [
      ...prev,
      {
        conversationId: currentChatId,
        senderId: currentUser.id,
        text: inputMessage,
        time: Date.now(),
      },
    ]);
    setInputMessage("");
    inputRef.current.focus();
  };

  const onChangeInput = (e) => {
    setInputMessage(e.target.value);
  };

  useEffect(() => {
    const messages = arrayMessage.filter(
      (i) => i?.conversationId === currentChatId
    );

    setListMessages(messages);
  }, [currentChatId]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessages]);

  //socket
  useEffect(() => {
    if (arrivalMessage) {
      dispatch(send(arrivalMessage));
    }
    arrivalMessage && setListMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.emit("addUser", currentUser.id);

    socket.current.on("getUsers", (data) => {
      dispatch(addUserOnline(data));
    });

    socket.current.on("getMessage", (data) => {
      console.log(data);
      setArrivalMessage({
        conversationId: data.conversationId,
        senderId: data.senderId,
        text: data.text,
        time: data.time,
      });
    });
  }, []);

  return (
    <Container>
      {currentChatId ? (
        <>
          <Wrap>
            <Header>
              <LeftHeader>
                <ImgUser src={contactPeople?.avatar} />
                <Info>
                  <NameInfo>{contactPeople?.name}</NameInfo>
                  <TimeInfo>Active</TimeInfo>
                </Info>
              </LeftHeader>
              <RightHeader>
                <CallIcon />
                <VideoCameraBackIcon />
                <MoreHorizIcon />
              </RightHeader>
            </Header>
            {listMessages.length > 0 ? (
              <ChatWrapper>
                {listMessages.map((item) => (
                  <ChatItem
                    ref={scrollRef}
                    key={item.id}
                    owner={item.senderId === currentUser.id ? "true" : ""}
                  >
                    <Content
                      owner={item.senderId === currentUser.id ? "true" : ""}
                    >
                      <ImgChat
                        src={
                          item.senderId === currentUser.id
                            ? currentUser.avatar
                            : contactPeople.avatar
                        }
                      />
                      <Desc
                        owner={item.senderId === currentUser.id ? "true" : ""}
                      >
                        {item.text}
                      </Desc>
                    </Content>
                    <Time>{format(item.time)}</Time>
                  </ChatItem>
                ))}
              </ChatWrapper>
            ) : (
              <div
                style={{
                  marginTop: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <Paper elevation={3}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                      avatar={<Avatar src={contactPeople?.avatar} />}
                      title={contactPeople?.name}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image="https://baoquocte.vn/stores/news_dataimages/dieulinh/012020/29/15/nhung-buc-anh-dep-tuyet-voi-ve-tinh-ban.jpg"
                      alt="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Hãy cùng chia sẻ tâm sự với nhau nào
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </div>
            )}
          </Wrap>
          <PostChat>
            <PostChatGroupIcon>
              <AddCircleIcon />
              <ImageIcon />
              <AttachmentIcon />
            </PostChatGroupIcon>
            <InputChat
              ref={inputRef}
              rows={1}
              placeholder="Wirte Something ......"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            {inputMessage ? (
              <SendIcon onClick={sendMessage} />
            ) : (
              <IconButton>
                <SendIcon />
              </IconButton>
            )}
          </PostChat>
        </>
      ) : (
        <OpenConversation>Open a conversation to start a chat</OpenConversation>
      )}
    </Container>
  );
};

export default Conversations;
