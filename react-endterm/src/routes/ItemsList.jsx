import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  fetchItems,
  setSearch,
  setFilters,
  setPage,
  setPageSize,
} from "../store/itemsSlice";

import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function ItemsList() {
  const dispatch = useDispatch();

  const {
    list,
    loadingList,
    errorList,
    search,
    filters,
    pagination,
  } = useSelector((s) => s.items);

  const [params, setParams] = useSearchParams();

  // локальные input-значения (до debounce)
  const [inputSearch, setInputSearch] = useState(params.get("q") || "");

  // debounce
  const debouncedSearch = useDebouncedValue(inputSearch, 500);

  // 1. Синхронизация URL → Redux (initial load)
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

  // 2. Когда Redux state меняется → обновляем URL
  useEffect(() => {
    const newParams = {};

    if (search) newParams.q = search;
    if (filters.status) newParams.status = filters.status;
    if (filters.gender) newParams.gender = filters.gender;

    newParams.page = pagination.page;
    newParams.pageSize = pagination.pageSize;

    setParams(newParams);
  }, [search, filters, pagination]);

  // 3. debounce-search → Redux
  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch]);

  // 4. Каждый раз при изменении URL → загружаем данные
  useEffect(() => {
    dispatch(fetchItems());
  }, [params.toString()]);


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

  if (loadingList) return <h2>Loading...</h2>;
  if (errorList) return <h3>Error: {errorList}</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Items</h1>

      <input
        type="text"
        placeholder="Search..."
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        style={{ padding: "6px 10px", marginBottom: "10px" }}
      />

      <div style={{ margin: "10px 0", display: "flex", gap: "20px" }}>
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

      <div>
        {list.map((item) => (
          <div key={item.id} style={{ marginBottom: "12px" }}>
            <strong>{item.name}</strong> — {item.status} / {item.gender}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          disabled={pagination.page <= 1}
          onClick={() => changePage(pagination.page - 1)}
        >
          Prev
        </button>

        <span>Page: {pagination.page}</span>

        <button
          onClick={() => changePage(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
