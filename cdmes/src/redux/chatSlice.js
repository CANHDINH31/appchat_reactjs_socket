import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrayChat: [
    {
      conversationId: "12",
      arrayPeopleId: ["1", "2"],
    },
    {
      conversationId: "23",
      arrayPeopleId: ["2", "3"],
    },
    {
      conversationId: "13",
      arrayPeopleId: ["1", "3"],
    },
  ],
  arrayMessage: [
    {
      conversationId: "12",
      senderId: "2",
      text: "hi you",
      time: 1663176278485,
    },

    {
      conversationId: "13",
      senderId: "1",
      text: "good morning",
      time: 1663176278487,
    },
    {
      conversationId: "12",
      senderId: "1",
      text: "hello you",
      time: 1663176278442,
    },
    {
      conversationId: "23",
      senderId: "2",
      text: "good morning, too",
      time: 1663176278375,
    },
    {
      conversationId: "23",
      senderId: "3",
      text: "good evening, too",
      time: 1663176278448,
    },
  ],
  currentChatId: null,
  loading: false,
  error: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createConversation: (state, action) => {
      state.arrayChat.push(action.payload);
      state.currentChat = action.payload;
    },
    getCurrentChat: (state, action) => {
      state.currentChatId = action.payload;
    },
    getChat: (state, action) => {
      state.loading = false;
      state.currentChat = action.payload.conversation[0];
      state.contactPeople = action.payload.contactPeople[0];
    },
    send: (state, action) => {
      state.arrayMessage = [...state.arrayMessage, action.payload];
    },
    logoutChat: (state, action) => {
      state.currentChatId = null;
    },
  },
});

export const { createConversation, getChat, getCurrentChat, send, logoutChat } =
  chatSlice.actions;

export default chatSlice.reducer;
