import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AppLocalStorage as LocalStorageService } from '../tokenConfig';
import { apiAuthURL, axiosAuthAPIInstance, axiosInstance } from './apiConfig';
import {
    IInterceptorBehavior,
    AuthInterceptorBehavior,
} from './interceptorBehavior';
const host = process.env.REACT_APP_ENVIRONMENT_HOST;

export abstract class AppAPIInstance {
    interceptorBehavior: IInterceptorBehavior;
    apiInstance: AxiosInstance;
    constructor(
        interceptorBehavior: IInterceptorBehavior,
        apiInstance: AxiosInstance
    ) {
        this.interceptorBehavior = interceptorBehavior;
        this.apiInstance = apiInstance;
        this.configureRequest(this.apiInstance);
        this.configureResponse(this.apiInstance);
    }
    configureRequest(axiosAPIInstance: AxiosInstance) {
        return this.interceptorBehavior.configureRequest(axiosAPIInstance);
    }
    configureResponse(axiosAPIInstance: AxiosInstance) {
        return this.interceptorBehavior.configureResponse(axiosAPIInstance);
    }
}
export class AuthAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }
}
export class UserAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }
    async getInfo(config?: AxiosRequestConfig) {
        return await this.apiInstance.get('/', config);
    }
    async changeAvatar(
        body: {
            file: File;
        },
        config?: AxiosRequestConfig
    ) {
        return await this.apiInstance.post('avatar', body, config);
    }
    async updateInfo(body: object, config?: AxiosRequestConfig) {
        return await this.apiInstance.post('updateInfo', body, config);
    }
}
