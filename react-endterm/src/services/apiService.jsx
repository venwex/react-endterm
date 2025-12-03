const BASE_URL = "https://rickandmortyapi.com/api/character";

export async function getItems({ search = "", filters = {}, page = 1, pageSize = 20 }) {
  const params = new URLSearchParams();

  if (search) params.append("name", search);

  // фильтры: status, species, gender
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  // Пагинация
  params.append("page", page);

  const url = `${BASE_URL}/?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  // API не поддерживает pageSize → делаю client-side slicing
  const results = data.results || [];

  return {
    items: results.slice(0, pageSize),
    totalCount: data.info?.count || results.length,
  };
}

export async function getItemById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`Item not found: ${id}`);
  }

  return await res.json();
}
