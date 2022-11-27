type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type SliderProps<ItemType> = {
    dataNumber: number;
    itemArray: ItemType[];
    responsive?: Partial<SliderResponsiveConfig>;
} & SliderConfig &
    SliderStyleConfig<ItemType>;

type SliderConfig = {
    loadNextItemAmount: number;
    itemAmountPerTime: number;
    autoPlayTimeout?: number;
    className?: string;
};

type SliderStyleConfig<ItemType> = {
    customOwl?: React.ReactElement | HTMLImageElement;
    cardNode: (item: ItemType, index: number) => React.ReactNode;
};

type SliderResponsiveConfig = {
    xs: SliderConfig;
    sm: SliderConfig;
    md: SliderConfig;
    lg: SliderConfig;
    xl: SliderConfig;
    xxl: SliderConfig;
};

enum SliderMovement {
    FORWARD = 'forward',
    BACKWARD = 'backward',
}

type SliderState = {
    dataNumber: number;
    runnerTime: number;
    step: number;
    minStep: number;
    maxStep: number;
    firstSlideItemIndex: number;
    lastSlideItemIndex: number;
    showPerPage: number;
};
