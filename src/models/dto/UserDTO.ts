import { number, string } from 'yup';

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

export type GetUserInfoResponseDTO = {
    id: number;
    organizationName: string;
    avatar: string;
    biography: string;
};

export type GetUserByAdminResponseDTO = {
    id: number;
    organizationName: string;
    avatar: string;
    biography: string;
    dateOfBirth: Date;
    email: string;
    enabled: boolean;
    isActive: boolean;
    registeredTime: Date;
    updatedTime: Date;
};
