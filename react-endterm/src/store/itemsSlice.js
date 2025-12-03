import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItems, getItemById } from "../services/apiService";

const initialState = {
  list: [],
  selectedItem: null,
  loadingList: false,
  loadingItem: false,
  errorList: null,
  errorItem: null,
  search: "",
  filters: {
    status: "",
    gender: "",
  },
  pagination: {
    page: 1,
    pageSize: 20,
    totalCount: 0,
  },
};

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().items;
      const { search, filters, pagination } = state;

      const data = await getItems({
        search,
        filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id, { rejectWithValue }) => {
    try {
      return await getItemById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.pagination.page = 1;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action) {
      state.pagination.pageSize = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload.items;
        state.pagination.totalCount = action.payload.totalCount;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      });

    builder
      .addCase(fetchItemById.pending, (state) => {
        state.loadingItem = true;
        state.errorItem = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loadingItem = false;
        state.errorItem = action.payload;
      });
  },
});

export const {
  setSearch,
  setFilters,
  setPage,
  setPageSize,
} = itemsSlice.actions;

export default itemsSlice.reducer;
