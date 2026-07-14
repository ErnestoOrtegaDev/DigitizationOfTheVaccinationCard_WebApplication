import api from '../api/axios'; 

export const fetchGlobalSearch = async (query) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};