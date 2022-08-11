class MarketAdsSharingLocalStorage {
    authKey: string;
    socketKey: string;
    userKey: string;
    cart: string;

    constructor() {
        this.authKey = 'LOGIN_USER';
        this.socketKey = 'SESSION_SOCKET_USER';
        this.userKey = 'USER';
        this.cart = 'CART';
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
}

export const AppLocalStorage = new MarketAdsSharingLocalStorage();
