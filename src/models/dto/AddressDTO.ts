export type GetAddressResponseDTO = {
    id?: number;
    receiverName: string;
    streetAddress: string;
    district: string;
    ward: string;
    city: string;
    zipcode: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: string;
    country: string;
    addressType?: number;
    userId: number;
};
