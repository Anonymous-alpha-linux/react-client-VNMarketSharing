import { AxiosInstance } from 'axios';
import { AppLocalStorage as LocalStorageService } from '../tokenConfig';
import { apiAuthURL, axiosAuthAPIInstance } from './apiConfig';

export interface IInterceptorBehavior {
    configureRequest: (axiosInstance: AxiosInstance) => void;
    configureResponse: (axiosInstance: AxiosInstance) => void;
}

export class PublicInterceptorBehavior implements IInterceptorBehavior {
    configureRequest(axiosInstance: AxiosInstance) {
        return axiosInstance.interceptors.request.use(
            (config) => config,
            (error) => {
                return Promise.reject(error);
            }
        );
    }
    configureResponse(axiosInstance: AxiosInstance) {
        return axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                return Promise.reject(error);
            }
        );
    }
}

export class AuthInterceptorBehavior implements IInterceptorBehavior {
    configureRequest(axiosInstance: AxiosInstance) {
        return axiosInstance.interceptors.request.use(
            (config) => {
                const token = LocalStorageService.getLoginUser() as string;
                if (token) {
                    config.headers!.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
    configureResponse(axiosInstance: AxiosInstance) {
        return axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalConfig = error.config;

                if (
                    originalConfig?.url &&
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
                                await axiosAuthAPIInstance.get(
                                    apiAuthURL.refreshToken
                                )
                            ).data;
                            LocalStorageService.setLoginUser(data.jwtToken);

                            return axiosAuthAPIInstance(originalConfig);
                        } catch (_error) {
                            LocalStorageService.removeLoginUser();
                            // console.clear();
                            return Promise.reject(_error);
                        }
                    }
                }
                // console.clear();
                return Promise.reject(error);
            }
        );
    }
}

export abstract class InterceptorDecorator implements IInterceptorBehavior {
    abstract configureRequest: (axiosInstance: AxiosInstance) => void;
    abstract configureResponse: (axiosInstance: AxiosInstance) => void;
}
