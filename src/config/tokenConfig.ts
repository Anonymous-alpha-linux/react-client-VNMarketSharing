import { PostProductRequest } from '../models';

class MarketAdsSharingLocalStorage {
    authKey: string;
    socketKey: string;
    userKey: string;
    cart: string;
    postForm: string;

    constructor() {
        this.authKey = 'LOGIN_USER';
        this.socketKey = 'SESSION_SOCKET_USER';
        this.userKey = 'USER';
        this.cart = 'CART';
        this.postForm = 'PRODUCT_FORM';
    }
    getLoginUser() {
        return localStorage.getItem(this.authKey);
    }
    setLoginUser(user: string) {
        localStorage.setItem(this.authKey, user);
    }
    removeLoginUser() {
        localStorage.removeItem(this.authKey);
    }

    getSocketUser() {
        return localStorage.getItem(this.socketKey);
    }
    setSocketUser(user: string) {
        localStorage.setItem(this.socketKey, user);
    }
    removeSocketUser() {
        localStorage.removeItem(this.socketKey);
    }

    getUser() {
        return localStorage.getItem(this.userKey);
    }
    setUser(user: object) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    removeUser() {
        localStorage.removeItem(this.userKey);
    }

    getPostProductForm(): PostProductRequest | null {
        const data = localStorage.getItem(this.postForm);
        return !!data ? JSON.parse(data) : null;
    }
    setPostProductForm(formData: PostProductRequest) {
        localStorage.setItem(this.postForm, JSON.stringify(formData));
    }
    removePostProductForm() {
        localStorage.removeItem(this.postForm);
    }
}

export const AppLocalStorage = new MarketAdsSharingLocalStorage();
