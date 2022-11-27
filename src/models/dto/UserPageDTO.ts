export type GetUserPageResponseDTO = {
    id: number;
    name: string;
    description: string;
    bannerUrl: string;
    pageAvatar: string;
    biography: string;
    phone: string;
    email: string;
};

export type GetUserPageResponseWithoutDescriptionDTO = {
    id: number;
    name: string;
    bannerUrl: string;
    pageAvatar: string;
    phone: string;
    email: string;
};

export type PostUserPageRequestDTO = {
    name: string;
    description: string;
    biography: string;
    phone: string;
    email: string;
    bannerUrl?: string;
    pageAvatar?: string;
};
