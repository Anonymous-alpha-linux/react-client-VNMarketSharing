import { GetCategoryResponseDTO } from './CategoryDTO';

export type PostProductRequestDTO = {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: string;
    categoryIds: number[];
    files: File[];
};
export type PostProductRequest = {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    categoryIds: number[];
    files: Set<File>;
};
export type GetProductResponseDTO = {
    id: number;
    description: string;
    inPages: boolean;
    inventory: number;
    name: string;
    price: number;
    productCategories: GetCategoryResponseDTO[];
    soldQuantity: number;
    urls: string[];
    userPageId: number;
    userPageAvatar: string;
    userPageName: string;
};
