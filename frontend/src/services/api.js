import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export const registerFarmer = (data) => API.post('/auth/register', data);
export const loginFarmer = (data) => API.post('/auth/login', data);
export const detectDisease = (formData) => API.post('/disease/detect', formData);
export const getBestMandi = (data) => API.post('/mandi/best-mandi', data);
export const getPricePrediction = (crop, mandi) => API.get('/mandi/price-prediction', { params: { crop, mandi } });
export const getAllSchemes = () => API.get('/schemes/all');