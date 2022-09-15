import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Conversations from "../components/Conversations";
import HistoryChat from "../components/HistoryChat";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Home = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [onlineId, setOnlineId] = useState([]);

  return (
    <Container>
      <HistoryChat />
      <Conversations setOnlineId={setOnlineId} />
    </Container>
  );
};

export default Home;