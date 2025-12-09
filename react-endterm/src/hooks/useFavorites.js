import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  setFavorites,
} from "../store/favoritesSlice";
import { useEffect } from "react";
import { saveFavoritesToFirestore, loadUserFavorites } from "../services/favoritesService";

const LOCAL_KEY = "local_favorites";

export function useFavorites() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.items);

  // load on mount
  useEffect(() => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      dispatch(setFavorites(local));
    } else {
      loadUserFavorites(user.uid).then((serverFavorites) => {
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
        const merged = Array.from(new Set([...local, ...serverFavorites]));

        dispatch(setFavorites(merged));
        localStorage.removeItem(LOCAL_KEY);
        saveFavoritesToFirestore(user.uid, merged);
        alert("Your local favorites were merged with your account.");
      });
    }
  }, [user, dispatch]);

  function add(id) {
    if (!favorites.includes(id)) {
      dispatch(addFavorite(id));

      if (!user) {
        const updated = [...favorites, id];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      } else {
        saveFavoritesToFirestore(user.uid, [...favorites, id]);
      }
    }
  }

  function remove(id) {
    dispatch(removeFavorite(id));

    if (!user) {
      const updated = favorites.filter((x) => x !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    } else {
      saveFavoritesToFirestore(user.uid, favorites.filter((x) => x !== id));
    }
  }

  return { favorites, add, remove };
}
