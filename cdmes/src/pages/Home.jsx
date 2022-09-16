import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Conversations from "../components/Conversations";
import HistoryChat from "../components/HistoryChat";
import { io } from "socket.io-client";
import { addUserOnline } from "../redux/userSlice";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Home = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const socket = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.emit("addUser", currentUser.id);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        conversationId: data.conversationId,
        senderId: data.senderId,
        text: data.text,
        time: data.time,
      });
    });
    socket.current.on("getUsers", (data) => {
      dispatch(addUserOnline(data));
    });
  }, []);

  return (
    <Container>
      <HistoryChat socket={socket} />
      <Conversations socket={socket} arrivalMessage={arrivalMessage} />
    </Container>
  );
};

export default Home;
