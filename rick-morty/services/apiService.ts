import { Character, CharacterResponse } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const apiService = {
  async getCharacters(page: number = 1, name: string = '', status: string = ''): Promise<CharacterResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (name) params.append('name', name);
    if (status && status !== 'all') params.append('status', status);

    const response = await fetch(`${BASE_URL}/character?${params.toString()}`);
    if (!response.ok) {
      if (response.status === 404) return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async getCharacterById(id: number): Promise<Character> {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    if (!response.ok) throw new Error('Failed to fetch character');
    return response.json();
  },

  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    if (ids.length === 0) return [];
    const response = await fetch(`${BASE_URL}/character/${ids.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }
};
