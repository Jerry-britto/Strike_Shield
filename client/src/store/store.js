import { configureStore } from "@reduxjs/toolkit";
import ecommSliceReducer from "./slice.js";

export  const store = configureStore({
  reducer: ecommSliceReducer,
});
