export interface TableToolContext<T> {
    searchMatchesResult: T[];
}
export type TableToolContextType<TSearch> = TableToolContext<TSearch>;

export type SearchProps = {
    title: string;
    image?: string;
    subtitle?: string;
};

export type TableToolsComponentValues = {
    [key: string]: any;
};

export type TableToolsState<T> = {
    data: T[];
    showFilterPanel?: boolean;
} & TableToolContext<T>;

export interface TableToolsSharedRenderProps<T> {
    children?: (
        props: TableToolContextType<T>
    ) => React.ReactNode | React.ReactNode;
}

type InitialTableToolsProps<TData> = {
    searchKey: string | string[];
    filterKeys: string[];
};

export type TableToolsProps<TSearch> = TableToolsSharedRenderProps<TSearch> &
    InitialTableToolsProps<TSearch> &
    TableToolsState<TSearch>;
