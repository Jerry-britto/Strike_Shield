import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios.js";
import { setCartCount } from "../store/slice.js";

/**
 * Keeps the cart item count in the Redux store in sync with the server so the
 * navbar badge stays accurate across the app. Fetches on mount and whenever the
 * logged-in user changes; silently ignores errors (e.g. logged out).
 */
export default function useCartCount() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user && user.length > 0;

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setCartCount(0));
      return;
    }

    let isActive = true;

    const fetchCount = async () => {
      try {
        const res = await api.get("/cart");
        if (!isActive) return;
        const items = res.data?.cart?.items || [];
        const count = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
        dispatch(setCartCount(count));
      } catch {
        // Ignore - badge simply stays at its last known value.
      }
    };

    fetchCount();

    return () => {
      isActive = false;
    };
  }, [isLoggedIn, dispatch]);
}
