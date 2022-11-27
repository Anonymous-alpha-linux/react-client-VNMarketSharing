export enum FormStatus {
    READ,
    CREATE,
    EDIT,
    DELETE,
    NONE,
}

export interface CategoryData {
    id: string;
    name: string;
    level: number;
    parentId?: number;
    subCategoryCount: number;
    hasOpened: boolean;
    subCategories?: CategoryData[];
}

export interface CategoryState {
    data: CategoryData[];
    keyTables: string[];
    loading: boolean;
    error: string;
    page: number;
    take: number;
    hasChanges?: FormStatus;
    displayedModal: boolean;
    editIndex: number;
}

export type CategoryTableRowProps = {
    record: CategoryData;
    setRecord?: (
        newRecord: CategoryData,
        type: FormStatus,
        rootId?: string
    ) => void;
    children?: React.ReactNode;
    handleResult?: (props: CategoryTableRowResultProps) => React.ReactNode;
    handleCreate?: (props: CategoryData) => any;
    handleUpdate?: (props: CategoryData) => any;
    handleDelete?: (id: string) => void;
    handleBlur?: () => void;
};

export interface CategoryTableRowResultProps {
    values?: CategoryData[];
}
