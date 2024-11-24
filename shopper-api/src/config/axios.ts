import axios from 'axios';

const axiosInstace = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/directions/json',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstace;
