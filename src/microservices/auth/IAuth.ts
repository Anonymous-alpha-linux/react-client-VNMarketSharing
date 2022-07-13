interface IAuthentication {
   login: () => void;
   register: () => void;
   refreshToken: () => void;
   getUser: () => void;
}

export default IAuthentication;
