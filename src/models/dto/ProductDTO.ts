import { GetCategoryResponseDTO } from './CategoryDTO';

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
    userPageId: number;
    userPageAvatar: string;
    userPageName: string;
};

export type GetProductClassifiesResponseDTO = {
    id: number;
    name: string;
    classifyTypes: GetProductClassifyTypesResponseDTO[];
};

export type GetProductClassifyTypesResponseDTO = {
    id: number;
    name: string;
};

export type GetProductClassifyDetailResponseDTO = {
    inventory: number;
    price: number;
    productClassifyKey: string;
    productClassifyKeyId: number;
    productClassifyValue: string;
    productClassifyValueId: number;
};
