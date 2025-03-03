import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { from, Observable, throwError } from "rxjs"
import { retry, catchError } from "rxjs/operators"
const isProd = process.env.REACT_APP_MLO_SERVER !== undefined ;//preference as production
console.log(isProd);


const axiosInstance_switch = axios.create({
  baseURL: isProd ? process.env.REACT_APP_MLO_SERVER +"/api/v1" : "http://localhost:5000/",
  withCredentials: false,
});



// Request interceptor for API calls
axiosInstance_switch.interceptors.request.use(
  async (config : AxiosRequestConfig) => {
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance_switch.interceptors.response.use(
  (response : AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

// Function to convert Axios calls to RxJS Observables
const toObservable = (
    request: Promise<AxiosResponse<unknown>>,
  ): Observable<AxiosResponse<unknown>> => {
    return from(request).pipe(
      retry(3),
      catchError((error: AxiosError) => throwError(() => error)),
    )
  }

export { axiosInstance_switch , isProd , toObservable};
