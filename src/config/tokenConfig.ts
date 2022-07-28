class MarketAdsSharingLocalStorage {
    authKey: string;
    socketKey: string;
    constructor() {
        this.authKey = 'LOGIN_USER';
        this.socketKey = 'SESSION_SOCKET_USER';
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
        localStorage.getItem(this.socketKey);
    }
    setSocketUser(user: string) {
        localStorage.setItem(this.socketKey, user);
    }
    removeSocketUser() {
        localStorage.removeItem(this.socketKey);
    }
}

export const AppLocalStorage = new MarketAdsSharingLocalStorage();
