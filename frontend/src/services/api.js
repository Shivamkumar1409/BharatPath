import axios from 'axios';

const API = axios.create({
  // 💡 FIXED: Now it will use your live Render URL on Vercel, but fallback to localhost on your MacBook!
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', 
});

export const registerFarmer = (data) => API.post('/auth/register', data);
export const loginFarmer = (data) => API.post('/auth/login', data);

// 💡 FIXED: Endpoint updated to match the new backend /crophealth prefix
export const analyzeCropHealth = (formData) => API.post('/crophealth/predict', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getBestMandi = (crop, quantity, district) =>
  API.get('/mandi/best-mandi', { params: { crop, quantity, farmer_district: district } });

export const getPricePrediction = (crop) =>
  API.get('/mandi/price-prediction', { params: { crop } });
export const getAllSchemes = () => API.get('/schemes/all');

export const getMSPPrices = () => API.get('/mandi/msp-prices');
export const checkMSP = (crop, price) =>
  API.get('/mandi/msp-check', { params: { crop, current_price: price } });

// Profile API
export const saveProfile = (data) => API.post('/profile/save', data);
export const getProfile = (email) => API.get(`/profile/get/${encodeURIComponent(email)}`);

// Profit API  
export const addProfitRecord = (data) => API.post('/profit/add', data);
export const getProfitRecords = (email) => API.get(`/profit/get/${encodeURIComponent(email)}`);
export const deleteProfitRecord = (id) => API.delete(`/profit/delete/${id}`);

// Auth API
export const verifyOTP = (email, otp) => API.post('/auth/verify-otp', { email, otp });
export const resendOTP = (email) => API.post('/auth/resend-otp', { email });