import axios, { AxiosInstance } from 'axios';
import { AppLocalStorage as LocalStorageService } from '../LocalStorageConfig';
import {
    UserAppAPIInstance,
    AddressAppAPIInstance,
    CategoryAppAPIInstance,
    ProductAppAPIInstance,
    SellerAppAPIInstance,
    PaymentApiInstance,
    DashboardApiInstance,
} from './appApiInstance';

const host = process.env.REACT_APP_ENVIRONMENT_HOST;
const bearerToken: string = LocalStorageService.getLoginUser() as string;

axios.defaults.baseURL = host;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// 1. API Common
export const apiURLConfig = {
    getUser: `/auth/account`,
};
const axiosInstance = axios.create({
    baseURL: `${host}/api`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${bearerToken}`,
    },
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
        response.headers['Access-Control-Allow-Origin'] =
            'http://localhost:3000';
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401 && !error.config._retry) {
                error.config._retry = true;
                try {
                    const { data } = (
                        await axiosAuthAPIInstance.get('/refresh')
                    ).data;
                } catch (_error) {}
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
    changePassword: `/changePassword`,
};
const axiosAuthAPIInstance: AxiosInstance = axios.create({
    baseURL: `${host}/api/auth`,
    withCredentials: true,
});
axiosAuthAPIInstance.interceptors.request.use(
    (config) => {
        const token = LocalStorageService.getLoginUser();
        if (token) {
            config.headers!['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosAuthAPIInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (
            originalConfig.url !== apiAuthURL.login &&
            originalConfig.url !== apiAuthURL.refreshToken &&
            error.response
        ) {
            if (
                error.response.status === 401 &&
                LocalStorageService.getLoginUser() &&
                !originalConfig._entry
            ) {
                originalConfig._entry = true;
                try {
                    const { data } = (
                        await axiosAuthAPIInstance.get(apiAuthURL.refreshToken)
                    ).data;
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

// 3. API User
const axiosUserAPIInstance: AxiosInstance = axios.create({
    baseURL: `${host}/api/user`,
    withCredentials: true,
});

const userAPIInstance = new UserAppAPIInstance(axiosUserAPIInstance);

// 4. API Address Entity
const addressAPIInstance = new AddressAppAPIInstance(axiosUserAPIInstance);

// 5. API Product
const axiosProductAPIInstance: AxiosInstance = axios.create({
    baseURL: `${host}/api/product`,
    withCredentials: true,
});
const productAPIInstance = new ProductAppAPIInstance(axiosProductAPIInstance);

// 5. API Category
const categoryAPIInstance = new CategoryAppAPIInstance(axiosProductAPIInstance);

// 6. API Seller
const axiosSellerAPIInstance: AxiosInstance = axios.create({
    baseURL: `${host}/api/seller`,
    withCredentials: true,
});
const sellerAPIInstance = new SellerAppAPIInstance(axiosSellerAPIInstance);

// 7. API Payment
const paymentAPIInstance = new PaymentApiInstance();

// 8. Dashboard
const dashboardAPIInstance = new DashboardApiInstance();

export {
    axiosInstance,
    axiosAuthAPIInstance,
    userAPIInstance,
    addressAPIInstance,
    productAPIInstance,
    categoryAPIInstance,
    sellerAPIInstance,
    paymentAPIInstance,
    dashboardAPIInstance,
};
