class TokenService {

    getLoginUser() {
        return localStorage.getItem("LOGIN_USER");
    }
    setLoginUser(user) {
        localStorage.setItem("LOGIN_USER", user);

    }
    removeLoginUser() {
        localStorage.removeItem("LOGIN_USER");
    }
}
export default new TokenService();