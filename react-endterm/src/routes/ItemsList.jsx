import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  fetchItems,
  setSearch,
  setFilters,
  setPage,
  setPageSize,
} from "../store/itemsSlice";

import { addFavorite, removeFavorite } from "../store/favoritesSlice";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

import "../styles/ItemsList.css";

export default function ItemsList() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    list,
    loadingList,
    errorList,
    search,
    filters,
    pagination,
  } = useSelector((s) => s.items);

  const favorites = useSelector((s) => s.favorites.items);

  const [inputSearch, setInputSearch] = useState(params.get("q") || "");
  const debouncedSearch = useDebouncedValue(inputSearch, 500);

  useEffect(() => {
    dispatch(setSearch(params.get("q") || ""));
    dispatch(
      setFilters({
        status: params.get("status") || "",
        gender: params.get("gender") || "",
      })
    );
    dispatch(setPage(Number(params.get("page")) || 1));
    dispatch(setPageSize(Number(params.get("pageSize")) || 20));
  }, []);

  useEffect(() => {
    const newParams = {};

    if (search) newParams.q = search;
    if (filters.status) newParams.status = filters.status;
    if (filters.gender) newParams.gender = filters.gender;

    newParams.page = pagination.page;
    newParams.pageSize = pagination.pageSize;

    setParams(newParams);
  }, [search, filters, pagination]);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(fetchItems());
  }, [params.toString()]);

  const toggleFavorite = (item) => {
    if (favorites.some((f) => f.id === item.id)) {
      dispatch(removeFavorite(item.id));
    } else {
      dispatch(
        addFavorite({
          id: item.id,
          name: item.name,
          status: item.status,
          gender: item.gender,
        })
      );
    }
  };

  const handleStatus = (e) => {
    dispatch(setFilters({ status: e.target.value }));
    dispatch(setPage(1));
  };

  const handleGender = (e) => {
    dispatch(setFilters({ gender: e.target.value }));
    dispatch(setPage(1));
  };

  const changePage = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSize = (e) => {
    dispatch(setPageSize(Number(e.target.value)));
    dispatch(setPage(1));
  };

  if (loadingList) return <h2 className="loading">Loading...</h2>;
  if (errorList) return <h3 className="error">Error: {errorList}</h3>;

  return (
    <div className="items-container">
      <h1 className="items-title">Characters</h1>

      <input
        className="items-search"
        type="text"
        placeholder="Search..."
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />

      <div className="items-filters">
        <select value={filters.status} onChange={handleStatus}>
          <option value="">Status: Any</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <select value={filters.gender} onChange={handleGender}>
          <option value="">Gender: Any</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <select value={pagination.pageSize} onChange={handlePageSize}>
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>

      <div className="items-list">
        {list.map((item) => (
          <div key={item.id} className="item-card">
            <div
              className="item-content"
              onClick={() => navigate(`/items/${item.id}`)}
            >
              <strong>{item.name}</strong> — {item.status} / {item.gender}
            </div>

            <button
              className={`item-fav-btn ${favorites.some((f) => f.id === item.id) ? "fav-remove" : "fav-add"
                }`}
              onClick={() => toggleFavorite(item)}
            >
              {favorites.some((f) => f.id === item.id) ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => changePage(pagination.page - 1)}
        >
          Prev
        </button>

        <span>Page: {pagination.page}</span>

        <button onClick={() => changePage(pagination.page + 1)}>Next</button>
      </div>
    </div>
  );
}
