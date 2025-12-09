import { loadLocalFavorites, clearLocalFavorites } from "../store/favoritesLocal";
import { loadUserFavorites, saveFavoritesToFirestore } from "./favoritesService";
import { setFavorites, setMergedFlag } from "../store/favoritesSlice";

export async function mergeFavorites(uid, dispatch) {
  const localFav = loadLocalFavorites();
  const remoteFav = await loadUserFavorites(uid);

  const merged = Array.from(new Set([...remoteFav, ...localFav]));

  await saveFavoritesToFirestore(uid, merged);

  dispatch(setFavorites(merged));
  dispatch(setMergedFlag(true));

  clearLocalFavorites();
}
