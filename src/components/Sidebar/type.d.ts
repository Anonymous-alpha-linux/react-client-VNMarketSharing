type SidebarProps = {
    children?: React.ReactNode;
    styleContainer?: React.CSSProperties;
    styleToggle?: React.CSSProperties;
    toggleDisplay?: boolean;
} & Pick<SidebarState, 'show'> & {
        data: SidebarPropData[];
    };

type SidebarListProps = {
    children?: React.ReactNode;
    className?: string;
} & SidebarHandler &
    Pick<SidebarState, 'show' | 'data'>;

type SidebarLinkProps = {
    item: SidebarPropData & { isOpened: boolean };
};

interface SidebarHandler {
    onOpenTab: (index: number) => void;
}

export interface SidebarPropData {
    title: string;
    path?: string;
    icon: React.ReactNode;
    iconOpened: React.ReactNode;
    iconClosed: React.ReactNode;
    subNav?: SidebarPropData[];
    isRoot?: boolean;
}

interface SidebarState {
    data: (SidebarPropData & { isOpened: boolean })[];
    show: boolean;
}
