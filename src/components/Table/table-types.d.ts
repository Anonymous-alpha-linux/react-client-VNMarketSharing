export type RowHandlers = {
    onUpdate?: (rowNumber: number) => void;
    onDelete?: (rowNumber: number) => void;
    onRead?: (rowNumber: number) => void;
    onAccept?: (rowNumber: number) => void;
    onDeny?: (rowNumber: number) => void;
    onBlocked?: (rowNumber: number) => void;
    onUnlocked?: (rowNumber: number) => void;
};

export interface TableValues {
    [key: string]: any & Partial<CellDataValues>;
}

export type TableProps<Values> = {
    headers: string[];
    data: Values[];
    hasAction?: boolean;
    perPageEntities?: number;
    noPagination?: boolean;
} & RowHandlers &
    HeaderProps;

export type TableState<Values> = {
    data: Values[];
    sortedKey: string;
    currentPage: number;
    perPageEntries: number;
};

export type RowProps = {
    data: string[];
    hasAction?: boolean;
    onClick?: (key: string) => void;
} & RowHandlers &
    HeaderProps;

export type HeaderProps = {
    sortBy?: string[];
};

export type RowBodyProps = RowProps & RowListProps;

export type RowDataProps = RowBodyProps & {
    rowNumber: number;
};

export type RowListProps = {
    data: any[][];
} & RowHandlers &
    PageProps;

export type CellDataValues = {
    image?: string;
    title?: string;
    subtitle?: string;
    status?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'light'
        | 'dark';
};

export type CellDataType =
    | number
    | string
    | boolean
    | CellDataValues
    | Array<CellDataType>;

export type CellDataComponentHandlerProps = {
    data: CellDataType;
};

export type CellDataObjectProps = {
    data: { [key: string]: any };
};

export type PageProps = {
    perPageAmount?: number;
    dataLength: number;
    currentPage?: number;
};

export type FooterProps = {
    onSelectPage: (page: number) => void;
    onSelectPerPage: (amount: number) => void;
} & PageProps;
