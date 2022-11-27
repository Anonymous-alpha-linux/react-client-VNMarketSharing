export type LoginRequest = {
    email: string;
    password: string;
    remember: boolean;
    returnURL: string;
};
export type LoginResponse = {
    accountId: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    roles: { roleName: string }[];
};
export type RegisterRequest = {
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
};

export type RegisterWithUserRequest = {
    organizationName: string;
    biography: string;
    dateOfBirth: Date;
    image?: File;
    account:{
        email: string; 
        password: string; 
        confirmPassword:string; 
        roleId: number;
    }
}

export type RegisterResponse = {};

export type ChangePasswordRequest = {
    email: string;
    token: string;
    returnUrl?: string;
    password: string;
    confirmPassword: string;
};
