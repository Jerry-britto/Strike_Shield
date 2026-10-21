import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  products: [],
  cartCount: 0,
};

export const ecommSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: function (state, action) {
      const user = action.payload;
      state.user.push(user);
    },
    removeUser: function (state) {
      state.user.pop();
    },
    setProductsData: function (state, action) {
      state.products = action.payload;
    },
    setCartCount: function (state, action) {
      state.cartCount = Number(action.payload) || 0;
    },
    modifyUserTokens: function (state, action) {
      let totalPrice = action.payload;
      state.user[0] = {
        ...state.user[0],
        tokens: state.user[0].tokens - totalPrice,
      };
    },
  },
});

export const { addUser, removeUser, setProductsData, modifyUserTokens, setCartCount } =
  ecommSlice.actions;

export default ecommSlice.reducer;
