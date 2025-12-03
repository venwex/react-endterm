import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],  // массив id (или карточек)
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload;
    },
    addFavorite(state, action) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter((id) => id !== action.payload);
    },
    clearFavorites(state) {
      state.items = [];
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
