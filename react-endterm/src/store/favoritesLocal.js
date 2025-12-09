export function loadLocalFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

export function saveLocalFavorites(items) {
  localStorage.setItem("favorites", JSON.stringify(items));
}

export function clearLocalFavorites() {
  localStorage.removeItem("favorites");
}
