import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { from, Observable, throwError } from "rxjs"
import { retry, catchError } from "rxjs/operators"
import { development } from "../env/development"

// Custom Axios instance
const axiosInstance = axios.create({
  baseURL: development.apiUrl,
  withCredentials: true,
  proxy: {
    host: "xxx.xxx.xxx.xx",
    port: 1234,
  },
})

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    return config as any
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error)
  },
)

// Function to convert Axios calls to RxJS Observables
const toObservable = (
  request: Promise<AxiosResponse<unknown>>,
): Observable<AxiosResponse<unknown>> => {
  return from(request).pipe(
    retry(3),
    catchError((error: AxiosError) => throwError(() => error)),
  )
}

export { axiosInstance, toObservable }
