import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    IInterceptorBehavior,
    AuthInterceptorBehavior,
    PublicInterceptorBehavior,
} from './interceptorBehavior';
import { PostProductRequest } from '../../models';

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

    getAllCategories(config?: AxiosRequestConfig) {
        return this.apiInstance.get('categories/all', {
            ...config,
        });
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

export class ProductAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }

    getProductList(
        filter: Partial<{
            page: number;
            take: number;
            followAlpha: boolean;
            followPrice: boolean;
            minPrice: number;
            maxPrice: number;
            followRating: boolean;
        }>,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.get('', {
            ...config,
            params: filter,
        });
    }
    getProductItem(id: number, config?: AxiosRequestConfig) {
        return this.apiInstance.get(id.toString(), config);
    }
    getMyProductList(
        filter: Partial<{
            page: number;
            take: number;
            followAlpha: boolean;
            followPrice: boolean;
            minPrice: number;
            maxPrice: number;
            followRating: boolean;
        }>,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.get('me', {
            ...config,
            params: filter,
        });
    }
    createNewProduct(body: PostProductRequest, config?: AxiosRequestConfig) {
        return this.apiInstance.post('create', body, {
            ...config,
        });
    }
    updateProduct(body: PostProductRequest, config?: AxiosRequestConfig) {
        return this.apiInstance.put('update', body, {
            ...config,
        });
    }
    deleteProduct(id: number) {
        return this.apiInstance.delete('delete', {
            params: {
                id,
            },
        });
    }
}
