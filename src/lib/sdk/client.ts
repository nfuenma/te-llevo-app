import axios, { type AxiosInstance } from 'axios';
import { apiConfig } from './config';

export const sdkClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: apiConfig.headers,
  withCredentials: true,
});
