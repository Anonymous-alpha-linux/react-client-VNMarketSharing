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

export type PostUserPageRequestDTO = {
    name: string;
    description: string;
    bannerUrl: string;
    pageAvatar: string;
    biography: string;
    phone: string;
    email: string;
};
