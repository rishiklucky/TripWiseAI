import API from './api';

export const tripService = {
  async generateTrip(tripRequest) {
    const res = await API.post('/trips/generate', tripRequest);
    return res.data;
  },

  async saveTrip(tripData) {
    const res = await API.post('/trips', tripData);
    return res.data;
  },

  async getUserTrips() {
    const res = await API.get('/trips');
    return res.data;
  },

  async getTripById(id) {
    const res = await API.get(`/trips/${id}`);
    return res.data;
  },

  async optimizeTrip(currentTrip, targetBudget) {
    const res = await API.post('/trips/optimize', { currentTrip, targetBudget });
    return res.data;
  },

  async editTripAI(currentTrip, userInstruction) {
    const res = await API.post('/trips/edit-ai', { currentTrip, userInstruction });
    return res.data;
  },

  async deleteTrip(id) {
    const res = await API.delete(`/trips/${id}`);
    return res.data;
  },
};
