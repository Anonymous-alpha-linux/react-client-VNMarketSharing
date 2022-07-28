export type LoginResponse = {
   accountId: number;
   email: string;
   accessToken: string;
   refreshToken: string;
   roles: { roleName: string }[];
};
