type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface SliderProps<ItemType> {
    dataNumber: number;
    loadNextItemAmount: number;
    itemArray: ItemType[];
    cardNode: (item: ItemType) => React.ReactNode;
    itemAmountPerTime: number;
    autoPlayTimeout?: number;
    className?: string;
    customOwl?: React.ReactElement | HTMLImageElement;
}

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
