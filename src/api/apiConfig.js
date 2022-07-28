import axios from "axios";
import LocalStorageService from "./tokenConfig";

const host = process.env.REACT_APP_ENVIRONMENT_HOST;
const bearerToken = LocalStorageService.getLoginUser();

axios.defaults.baseURL = host;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

// 1. API Common
export const apiURLConfig = {
   getUser: `/auth/account`,
};

const axiosInstance = axios.create({
   baseURL: `${host}/api`,
   withCredentials: true,
   headers: {
      "Authorization": `Bearer ${bearerToken}`
   }
});
axiosInstance.interceptors.request.use(
   (config) => {
      if (bearerToken) {
         return config;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);
axiosInstance.interceptors.response.use(
   (response) => {
      response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
      return response;
   },
   async (error) => {
      if (error.response) {
         if (error.response.status === 401 && !error.config._retry) {
            error.config._retry = true;
            try {
               const { data } = (await axiosAuthAPIInstance.get("/refresh"))
                  .data;

               console.log(data);
            } catch (_error) { }
         }
      }
   }
);


// 2. API Authentication
export const apiAuthURL = {
   login: `/login`,
   register: `/register`,
   logout: `/logout`,
   getUser: `/account`,
   refreshToken: `/refreshtoken`,
   confirmEmail: `/confirmEmail`,
   sendEmailtoChangePassword: `/confirm/changePassword`,
   changePassword: `/changePassword`
};
const axiosAuthAPIInstance = axios.create({
   baseURL: `${host}/api/auth`,
   withCredentials: true,
});
axiosAuthAPIInstance.interceptors.request.use(
   config => {
      const token = LocalStorageService.getLoginUser();
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`
      }
      return config;
   }, error => {
      return Promise.reject(error);
   }
);
axiosAuthAPIInstance.interceptors.response.use(
   response => {
      return response;
   }, async error => {
      const originalConfig = error.config;

      if (originalConfig.url !== apiAuthURL.login
         && originalConfig.url !== apiAuthURL.refreshToken
         && error.response) {
         if (error.response.status === 401 && LocalStorageService.getLoginUser() && !originalConfig._entry) {
            originalConfig._entry = true;
            try {
               const { data } = (await axiosAuthAPIInstance.get(apiAuthURL.refreshToken)).data;
               LocalStorageService.setLoginUser(data.jwtToken);

               return axiosAuthAPIInstance(originalConfig);
            } catch (_error) {
               LocalStorageService.removeLoginUser();
               console.clear();
               return Promise.reject(_error);
            }
         }
      }
      console.clear();
      return Promise.reject(error);
   }
);


export { axiosInstance, axiosAuthAPIInstance };

