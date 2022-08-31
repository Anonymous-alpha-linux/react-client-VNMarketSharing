export type GetUserResponse = {
    accountId: number;
    email: string;
    roles: { roleName: string }[];
};
export type UpdateUserInfoRequest = {
    organizationName: string;
    biography: string;
    dateOfBirth: string;
};
export type UpdateUserInfoResponse = {};

