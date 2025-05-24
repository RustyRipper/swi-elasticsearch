import axios from 'axios';

const API_URL = 'http://localhost:8080/api/songs';

export const searchSongs = (params) => {
  return axios.get(`${API_URL}/search`, { params });
};

export const getSongDetails = (id) => {
  return axios.get(`${API_URL}/${id}`);
};
