export type SellerPageRequestDTO = {
    name: string;
    description: string;
    phone: string;
    email: string;
    biography: string;
};

export type SellerPageResponseDTO = {
    id: number;
    name: string;
    description: string;
    pageAvatar: string;
    bannerUrl: string;
    phone: string;
    email: string;
    biography: string;
};
