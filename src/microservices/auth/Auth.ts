import IAuth from "./IAuth";

export default class Authentication implements IAuth {
   login(): void {}
   register(): void {}
   refreshToken(): void {}
   getUser(): void {}
}
