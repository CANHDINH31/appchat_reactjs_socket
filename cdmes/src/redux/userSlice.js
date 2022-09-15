import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  arrayUser: [
    {
      id: "1",
      username: "phamcanhdinh",
      name: "Phạm Cảnh Dinh",
      password: "123",
      avatar:
        "https://ss-images.saostar.vn/pc/1649853724066/saostar-x3dyzbddlwqi5pfo.jpeg",
    },
    {
      id: "2",
      username: "tranduclong",
      name: "Trần Đức Long",
      password: "123",
      avatar:
        "https://kenh14cdn.com/thumb_w/660/203336854389633024/2022/3/29/2773518335073396407916344511246911922067866n-1-16485602184401812894701.jpg",
    },
    {
      id: "3",
      username: "leanhduc",
      name: " Lê Anh Đức",
      password: "123",
      avatar:
        "https://dep365.com/wp-content/uploads/2022/09/lisa-toc-ngan-2.jpg",
    },
    {
      id: "4",
      username: "phamngocthanh",
      name: "Phạm Ngọc Thanh",
      password: "123",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Jennie_Kim_Marie_Claire_Korea_2020.png/250px-Jennie_Kim_Marie_Claire_Korea_2020.png",
    },
    {
      id: "5",
      username: "maigiaphuc",
      name: "Mai Gia Phúc",
      password: "123",
      avatar:
        "https://kenh14cdn.com/thumb_w/660/203336854389633024/2022/8/1/fkzikveveauyooi-16593676424321660956717.jpg",
    },
  ],
  currentUser: null,
  contactPeople: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const newUser = { ...state.currentUser, ...action.payload };
      state.currentUser = newUser;
    },
    login: (state, action) => {
      const currentUser = state.arrayUser.find((item) => {
        return (
          item.username === action.payload.username &&
          item.password === action.payload.password
        );
      });
      if (currentUser) {
        state.currentUser = currentUser;
      } else {
        state.currentUser = null;
      }
    },
    logout: (state) => {
      state.currentUser = null;
    },
    getContactPeople: (state, action) => {
      state.contactPeople = action.payload;
    },
  },
});

export const { login, logout, getContactPeople } = userSlice.actions;

export default userSlice.reducer;
