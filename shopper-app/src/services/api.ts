import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
}

export interface TripEstimationResponse {
  customer_id: string;
  origin_name: string;
  destination_name: string;
  origin: {
    latitude: string;
    longitude: string;
  };
  destination: {
    latitude: string;
    longitude: string;
  };
  distance: number;
  duration: string;
  options: Driver[];
  routeResponse: {
    success: boolean;
  };
}

export interface Ride {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: Driver;
  value: number;
}

export interface HistoryRideResponse {
  customer_id: string;
  rides: Ride[];
}

export const estimateRide = async (data: {
  customer_id: string;
  origin: string;
  destination: string;
}) => {
  const response = await api.post<TripEstimationResponse>(
    "/ride/estimate",
    data
  );
  return response.data;
};

export const confirmRide = async (data: {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: string;
    name: string;
  };
  value: number;
}) => {
  const response = await api.patch("/ride/confirm", data);
  return response.data;
};

export const fetchRideHistory = async (data: {
  customer_id: string;
  driver_id?: string;
}) => {
  const params = data.driver_id ? { driver_id: data.driver_id } : {};
  const response = await api.get<HistoryRideResponse>(
    `/ride/${data.customer_id}`,
    { params }
  );
  return response.data;
};

export const fetchAllDrivers = async () => {
  const response = await api.get<Driver[]>(`/ride/drivers/all`);
  return response.data;
};

export default api;
