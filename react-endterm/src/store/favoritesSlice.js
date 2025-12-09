import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],  // массив объектов {id, name, status, gender}
  mergedFlag: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload;
    },

    addFavorite(state, action) {
      const newItem = action.payload;
      if (!state.items.some((el) => el.id === newItem.id)) {
        state.items.push(newItem);
      }
    },

    removeFavorite(state, action) {
      const id = action.payload;
      state.items = state.items.filter((el) => el.id !== id);
    },

    clearFavorites(state) {
      state.items = [];
    },

    setMergedFlag(state, action) {
      state.mergedFlag = action.payload;
    },
  },
});

export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
  setMergedFlag,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
