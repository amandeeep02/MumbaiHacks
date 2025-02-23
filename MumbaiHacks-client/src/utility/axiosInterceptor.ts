import axios from 'axios'
import { getLocalStorage } from './helper'

const baseURL = 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage('jwt')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
