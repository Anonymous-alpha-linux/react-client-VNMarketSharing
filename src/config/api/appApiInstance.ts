import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { axiosInstance } from './apiConfig';
import {
    IInterceptorBehavior,
    AuthInterceptorBehavior,
} from './interceptorBehavior';

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
    getInfo(config?: AxiosRequestConfig) {
        return this.apiInstance.get('/', config);
    }
    changeAvatar(
        body: {
            file: File;
        },
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.post('avatar', body, config);
    }
    updateInfo(body: object, config?: AxiosRequestConfig) {
        return this.apiInstance.put('updateInfo', body, config);
    }
    getUserInfo(userId: string, config?: AxiosRequestConfig) {
        return this.apiInstance.get('info', {
            ...config,
            params: {
                userId: userId,
            },
        });
    }
}

export class AddressAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }
    getAddresses(
        userId: string,
        addressType: number,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.get('addresses', {
            ...config,
            params: { userId: userId, addressType: addressType },
        });
    }
    getSingleAddress(addressId: string, config?: AxiosRequestConfig) {
        return this.apiInstance.get('address', {
            ...config,
            url: addressId,
        });
    }
    createAddress(body: object, config?: AxiosRequestConfig) {
        return this.apiInstance.post('createAddress', body, config);
    }
    updateAddress(
        body: object,
        addressId: string,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put('updateAddress', body, {
            ...config,
            params: {
                addressId: addressId,
            },
        });
    }
    removeAddress(addressId: string, config?: AxiosRequestConfig) {
        return this.apiInstance.delete('removeAddress', {
            ...config,
            params: {
                addressId: addressId,
            },
        });
    }
}

export class CategoryAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }

    getCategories(
        filter?: Partial<{
            level: number;
            parentId: number;
            page: number;
            take: number;
        }>,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.get('categories', {
            ...config,
            params: filter,
        });
    }
    getSingleCategory(id: string, config?: AxiosRequestConfig) {
        return this.apiInstance.get('category', {
            ...config,
            params: {
                id,
            },
        });
    }
    postNewCategory(body: object, config?: AxiosRequestConfig) {
        return this.apiInstance.post('category', body, config);
    }
    updateSingleCategory(
        id: string,
        body: object,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put('category', body, {
            ...config,
            params: {
                id,
            },
        });
    }
    deleteSingleCategory(id: string, config?: AxiosRequestConfig) {
        return this.apiInstance.delete('category', {
            ...config,
            params: { id },
        });
    }
}
