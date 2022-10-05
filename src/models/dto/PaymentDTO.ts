export type InvoiceCreationDTO = {
    cashAmount: number;
    shipping: 'online' | 'direct';
    orders: OrderCreationDTO[];
    paymentId?: number;
    payment?: PaymentCreationDTO;
};

export type PaymentCreationDTO = {
    createdAt: string;
    expireTime: string;
    bankCode: string;
    cardNumber: string;
    userId: number;
};

export type OrderCreationDTO = {
    buyerFullName: string;
    description: string;
    amount: number;
    price: number;
    total: number;
    createdAt: string;
    expireTime: string;
    productId: number;
    buyerId: number;
    merchantId: number;
    addressId?: number;
    address?: AddressCreationDTO;
};

export type AddressCreationDTO = {
    receiverName: string;
    streetAddress: string;
    district: string;
    ward: string;
    city: string;
    country: string;
    zipcode: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string;
    addressType: number;
    userId: number;
};

export type GetInvoiceResponseDTO = {
    id: number;
    cashAmount: number;
    shipping: number;
    onlineRef: string;
    hasPaid: boolean;
    bank: string;
    createdAt: string;
    orders: GetOrderResponseDTO[];
};

export type GetOrderResponseDTO = {
    id: number;
    buyerFullName: string;
    description: string;
    amount: number;
    price: number;
    total: number;
    orderStatus: number;
    productId: number;
    productName: string;
    merchantId: number;
    merchant: string;
    address: string;
    addressId: number;
    createdAt: string;
    expireTime: string;
    invoiceRef: string;
};

export type GetPaymentResponseDTO = {};
