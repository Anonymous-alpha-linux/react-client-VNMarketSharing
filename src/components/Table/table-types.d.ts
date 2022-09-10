export type RowHandlers = {
    onUpdate?: () => void;
    onDelete?: () => void;
    onRead?: () => void;
    onAccept?: () => void;
    onDeny?: () => void;
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
} & RowHandlers;

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
} & RowHandlers;

export type RowListProps = {
    data: any[][];
} & RowHandlers;

export type CellDataValues = {
    image?: string;
    title?: string;
    subtitle?: string;
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

export type FooterProps = {
    perPageAmount?: number;
    dataLength: number;
    currentPage?: number;
    onSelectPage: (page: number) => void;
    onSelectPerPage: (amount: number) => void;
};
