import { configureStore } from "@reduxjs/toolkit";
import ecommSliceReducer from "./slice.js";
import { persistStore, persistReducer } from "redux-persist"; // Import persistReducer directly
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  // Only the authenticated user is worth persisting. The product catalog used
  // to be persisted as well, which bloats localStorage (some products carry
  // multi-MB base64 images) and causes stale overwrites across tabs.
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, ecommSliceReducer); // Rename variable to persistedReducer

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions internally
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
