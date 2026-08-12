import API from './api';

export const authService = {
  async register(userData) {
    const res = await API.post('/auth/register', userData);
    if (res.data?.data?.token) {
      localStorage.setItem('tripwise_token', res.data.data.token);
      localStorage.setItem('tripwise_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await API.post('/auth/login', credentials);
    if (res.data?.data?.token) {
      localStorage.setItem('tripwise_token', res.data.data.token);
      localStorage.setItem('tripwise_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async getMe() {
    const res = await API.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await API.put('/auth/profile', profileData);
    if (res.data?.data) {
      const current = JSON.parse(localStorage.getItem('tripwise_user') || '{}');
      const updated = { ...current, ...res.data.data };
      localStorage.setItem('tripwise_user', JSON.stringify(updated));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('tripwise_token');
    localStorage.removeItem('tripwise_user');
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('tripwise_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },
};
