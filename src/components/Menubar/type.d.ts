type MenuBarProps<Values = object> = Pick<MenuBarState<Values>, 'menu'> &
    MenuBarChildren<Values> &
    Partial<SubMenuConfig>;

type MenuBarContext<Values> = MenuBarState<Values> & MenuBarHandler;

type MenuBarState<Values extends MenuBarValues> = {
    menu: Menu<Values>[];
    location: MenuBarLocation[];
    displaySub: boolean;
} & Partial<SubMenuConfig>;

type MenuBarLocation = {
    center: number;
    top: number;
};

interface MenuBarHandler {
    openSubmenu: (e: React.MouseEvent<HTMLElement>, index: number) => void;
    closeSubmenu: (e: React.MouseEvent<HTMLElement>, index: number) => void;
}

interface MenuBarChildren<Values extends MenuBarValues> {
    children?: (
        props: MenuBarContext<Values> & { currentIndex: number }
    ) => React.ReactNode;
}

type Menu<Values extends MenuBarValues> = {
    title?: string;
    trigger: React.ReactNode;
    subs: Values[];
} & Partial<SubMenuConfig>;

type MenuBarValues =
    | {
          [key: string]: any;
          title: string;
      }
    | string;

type SubMenuConfig = {
    additionalBottom: number;
    position: 'left' | 'right' | 'center';
    clickedAction: boolean;
    overflowScrolled: boolean;
    badge: React.ReactNode;
    maxHeight: number;
    className
};
