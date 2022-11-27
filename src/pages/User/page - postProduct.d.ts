import { FormikProps } from 'formik';

export type ProductClassify = {
    name: string;
    types: string[];
};

export type ProductClassifyDetail = {
    image: File;
    tierIndex: number[];
    price: number;
    inventory: number;
};

export interface FormValues {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    files?: File[];
    categoryIds: SelectCategoryValues[];
    classifies: ProductClassify[];
    classifyDetails: ProductClassifyDetail[];
    reserve: boolean;
    itemStatus: 0 | 1;
}

// Form Display
export interface PostProductState {
    loading: boolean;
    error: string;
    currentStep: number;
}

export interface PostProductEntryProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onClick?: () => void;
}

export interface SelectCategoryInputProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    isValid?: (isValid: boolean) => void;
}

export type SelectCategoryValues = {
    id: number;
    name: string;
    level: string;
    parentId: number;
    subCategoryCount: number;
    subCategories?: SelectCategoryValues[];
};

export type SelectCategoryListProps = {
    originalData: SelectCategoryValues[];
    categories: SelectCategoryValues[];
    level: number;
    selectedCategories: Map<number, SelectCategoryValues>;
    fetchSubCategories: (
        parentId: number,
        level: number,
        array: SelectCategoryValues[]
    ) => Promise<Array<SelectCategoryValues>>;
    getSelectedCategories: (
        selectedItems: Map<number, SelectCategoryValues>,
        permitNext: boolean
    ) => void;
};

export type SelectCategoryListState = {
    data: SelectCategoryValues[];
    selectedCategory: SelectCategoryValues | null;
    selectedCategories: Map<number, SelectCategoryValues> | null;
};

export interface PostProductDetailProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onCancel?: () => void;
    onSaveAndHide?: () => void;
    onUpdate?: () => void;
}

export type PostProductDetailState = {
    priceTemp: number;
    inventoryTemp: number;
};

export interface MultipleFileUploadProps {
    name: string;
    initialFiles: File[] | string[];
    onChangeMultiple: (files: (File | null)[]) => void;
    isInvalid?: boolean;
    errors?: string;
    formProps?: FormikProps<FormValues>;
}

export type MultipleFileUploadState = {
    images: (File | string | null)[];
    currentIndex: number;
    showCrop: boolean;
    error?: string | null;
};

export interface SingleFileUploadProp {
    initialImage?: string | File;
    name: string;
    isInvalid?: boolean;
    errors?: any;
    onChange?: (image: File | null) => void;
    onError?: (error: string) => void;
}

export type SingleFileUploadState = {
    imageUrl?: string | File;
    showCrop?: boolean;
    error: string;
};

export interface ClassifyProductInputProps {
    formProps: FormikProps<FormValues>;
    name: string;
    index: number;
    value: any;
}

export interface ClassifyProductTypeInputProps {
    formProps: FormikProps<FormValues>;
    touched?: boolean;
    error?: string;
    showRemoveBtn?: boolean;
    handleRemoveBtn: () => void;
    name: string;
    index: number;
    value: any;
}

export interface ClassifyProductPreviewProps {
    data: ProductClassify[];
    detailData: ProductClassifyDetail[];
    fieldName: string;
    onChange?: (event: React.ChangeEvent<any>) => void;
    onChangeClassifyType?: (values: ProductClassifyDetail[]) => void;
}

export type ClassifyProductPreviewListState = {
    rows?: Node[];
    details: ProductClassifyDetail[];
};
