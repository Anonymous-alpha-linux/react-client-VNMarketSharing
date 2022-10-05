import { GetCategoryResponseDTO } from './CategoryDTO';
import { GetUserPageResponseDTO } from './UserPageDTO';

export type PostProductRequestDTO = {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    categoryIds: number[];
    productClassifies: PostProductClassifyRequestDTO[];
    productDetails: PostProductClassifyDetailRequestDTO[];
    files: Set<File>;
};

export type PostProductRequest = {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    categoryIds: number[];
    productClassifies: PostProductClassifyRequestDTO[];
    productDetails: PostProductClassifyDetailRequestDTO[];
    files: Set<File>;
};

export type PostProductClassifyRequestDTO = {
    name: string;
    classifyTypes: string[];
};

export type PostProductClassifyDetailRequestDTO = {
    price: number;
    inventory: number;
    classifyIndexes: number[];
    image: File;
};

export type ProductFilter = {
    page: number;
    take: number;
    followAlpha?: boolean;
    followPrice?: boolean;
    minPrice?: number;
    maxPrice?: number;
    followRating?: boolean;
    categoryId?: number;
};

export type GetPostProductForm = Omit<
    PostProductRequestDTO,
    'files' | 'productDetails'
> & {
    files: string[];
    productDetails: Omit<PostProductClassifyDetailRequestDTO, 'image'> &
        {
            image: string;
        }[];
};

export type GetProductResponseDTO = {
    id: number;
    description: string;
    inPages: boolean;
    inventory: number;
    name: string;
    price: number;
    productCategories: GetCategoryResponseDTO[];
    productClassifies: GetProductClassifiesResponseDTO[];
    productDetails: GetProductClassifyDetailResponseDTO[];
    soldQuantity: number;
    urls: string[];
    createdAt: string;
    userPage: GetUserPageResponseDTO;
};

export type GetProductClassifiesResponseDTO = {
    id: number;
    name: string;
    classifyTypes: GetProductClassifyTypesResponseDTO[];
};

export type GetProductClassifyTypesResponseDTO = {
    id: number;
    name: string;
    productDetails: GetProductClassifyDetailResponseDTO[];
};

export type GetProductClassifyDetailResponseDTO = {
    inventory: number;
    price: number;
    presentImage: string;
    productClassifyKey: string;
    productClassifyKeyId: number;
    productClassifyValue: string;
    productClassifyValueId: number;
};

export type ReviewProductCreationDTO = {
    rate: number;
    name: string;
    subject: string;
    comment: string;
    userId: number;
    productId: number;
};
