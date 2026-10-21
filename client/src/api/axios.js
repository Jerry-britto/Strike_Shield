import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../store/store.js";
import { removeUser, setCartCount } from "../store/slice.js";

// Central axios instance so the API base URL and credential handling live in
// exactly one place. Falls back to the local dev server when no env var is set.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// If the session cookie has expired (server answers 401), clear the persisted
// login state so the UI doesn't show a "logged in" navbar over failing API
// calls. Login/register failures also 401, but clearing state there is a no-op
// because no user is persisted at that point.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store.getState().user.length > 0) {
      // First 401 clears the user synchronously, so parallel failing requests
      // see an empty state below and this toast fires only once per expiry.
      toast.info("Session expired — please log in again");
      store.dispatch(removeUser());
      store.dispatch(setCartCount(0));
    }
    return Promise.reject(error);
  }
);

export default api;
