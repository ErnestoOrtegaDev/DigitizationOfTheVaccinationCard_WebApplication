import api from '../api/axios';

export const fetchDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};