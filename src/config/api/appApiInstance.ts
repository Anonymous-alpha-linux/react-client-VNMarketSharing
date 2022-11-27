import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { serialize } from 'object-to-formdata';
import {
    IInterceptorBehavior,
    AuthInterceptorBehavior,
    PublicInterceptorBehavior,
} from './interceptorBehavior';
import { AppLocalStorage as LocalStorageService } from '../tokenConfig';
import {
    InvoiceCreationDTO,
    OrderStatus,
    PostProductRequest,
    PostProductRequestDTO,
    ProductFilter,
} from '../../models';

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
    updateAddressDefault(
        addressId: number,
        userId: number,
        type: number,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put('setdefault', null, {
            ...config,
            params: {
                addressId,
                userId,
                type,
            },
        });
    }
    getUserList(config?: AxiosRequestConfig) {
        return this.apiInstance.get('list', config);
    }
    blockOrUnlockUser(
        userId: number,
        isBlocked: boolean,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put('block', null, {
            params: {
                isBlocked,
                userId,
            },
            ...config,
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
    postNewCategory(
        body: {
            name: string;
            parentCategoryId?: number;
        },
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.post('category', body, config);
    }
    updateSingleCategory(
        id: string,
        body: {
            name: string;
            parentCategoryId?: number;
        },
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
        filter: Partial<ProductFilter>,
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
    createNewProduct(body: PostProductRequestDTO, config?: AxiosRequestConfig) {
        const { files, ...prop } = body;
        const formData = serialize(
            { ...prop, files: Array.from(files) },
            {
                indices: true,
                noFilesWithArrayNotation: true,
                dotsForObjectNotation: true,
                nullsAsUndefineds: true,
                allowEmptyArrays: true,
            }
        );

        return this.apiInstance.post('create', formData, {
            ...config,
        });
    }
    updateProduct(body: PostProductRequestDTO, config?: AxiosRequestConfig) {
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
    getReviewProduct(productId: number) {
        return this.apiInstance.get('review/list', {
            params: {
                productId,
            },
        });
    }
    getReviewReplies(reviewId: number) {
        return this.apiInstance.get('review/replies', {
            params: {
                reviewId: reviewId,
            },
        });
    }
    getUnInspectedProducts(config?: AxiosRequestConfig) {
        return this.apiInstance.get('uninspected', config);
    }
    permitProductByAdmin(
        isAccepted: boolean,
        productId: number,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put('permission', null, {
            ...config,
            params: {
                isAccepted,
                productId,
            },
        });
    }
}

export class SellerAppAPIInstance extends AppAPIInstance {
    constructor(axiosInstance: AxiosInstance) {
        super(new AuthInterceptorBehavior(), axiosInstance);
    }

    getSellerPage(userId: number, config?: AxiosRequestConfig) {
        return this.apiInstance.get('', {
            params: { userId },
            ...config,
        });
    }
    postSellerPage(userId: number, data: object, config?: AxiosRequestConfig) {
        return this.apiInstance.post('profile', data, {
            params: { userId },
            ...config,
        });
    }
    changeSellerAvatar(
        userId: number,
        newAvatar: File,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put(
            'avatar',
            {
                newAvatar,
            },
            {
                params: { userId },
                ...config,
            }
        );
    }
    changeSellerBanner(
        userId: number,
        newBanner: File,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.put(
            'banner',
            {
                newBanner,
            },
            {
                params: { userId },
                ...config,
            }
        );
    }
    getSellerList(config?: AxiosRequestConfig) {
        return this.apiInstance.get('list', config);
    }
}

export class PaymentApiInstance extends AppAPIInstance {
    constructor() {
        const bearerToken: string =
            LocalStorageService.getLoginUser() as string;

        const axiosInstance = axios.create({
            baseURL: `${host}/api/payment`,
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });
        super(new AuthInterceptorBehavior(), axiosInstance);
    }
    getBankList(config?: AxiosRequestConfig) {
        return this.apiInstance.get('bankcode', config);
    }
    createInvoice(
        newInvoice: InvoiceCreationDTO,
        returnURL: string,
        config?: AxiosRequestConfig
    ) {
        return this.apiInstance.post('invoice/create', newInvoice, {
            ...config,
            params: {
                returnURL,
            },
        });
    }
    confirmInvoice(searchParamString: string, config?: AxiosRequestConfig) {
        return this.apiInstance.get(`confirm${searchParamString}`, config);
    }
    getMyOrder(userId: number, config?: AxiosRequestConfig) {
        return this.apiInstance.get(`invoice/me`, {
            ...config,
            params: {
                userId,
            },
        });
    }
    getOrderById(orderId: number, config?: AxiosRequestConfig) {
        return this.apiInstance.get('order/' + orderId, {
            ...config,
        });
    }
    searchOrder() {}
    getOrderSeller() {}
}

export class DashboardApiInstance extends AppAPIInstance {
    constructor() {
        const bearerToken: string =
            LocalStorageService.getLoginUser() as string;

        const axiosInstance = axios.create({
            baseURL: `${host}/api/dashboard`,
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });
        super(new AuthInterceptorBehavior(), axiosInstance);
    }
    getRecentSeller(config?: AxiosRequestConfig) {}
    getRecentProduct(config?: AxiosRequestConfig) {
        return this.apiInstance.get('product/recent', config);
    }
}
