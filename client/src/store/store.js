import { configureStore } from "@reduxjs/toolkit";
import ecommSliceReducer from "./slice.js";
import { persistStore, persistReducer } from "redux-persist"; // Import persistReducer directly
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, ecommSliceReducer); // Rename variable to persistedReducer

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
