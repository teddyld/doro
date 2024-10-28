import axios from "axios";

axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";

axios.defaults.baseURL = "http://localhost:5050";

axios.interceptors.request.use((request) => {
  return request;
});

const errorHandler = (error: any) => {
  const responseMessage: string = error.response.data.error;
  return Promise.reject(responseMessage);
};

const responseHandler = (response: any) => {
  return response;
};

axios.interceptors.response.use(responseHandler, errorHandler);
