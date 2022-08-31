import React from 'react';

type PaginationProps = PaginationStateShared;

type PaginationStateShared = {
    dataLength: number;
    perPageAmount: number;
};

type PaginationState = PaginationStateShared & {
    currentPage: number;
    nextPage: number;
    prePages: number[];
    total: number;
    setCurrenPage: (page: number) => void;
    setPerPageAmount: (amount: number) => void;
};

export function usePagination(props: PaginationProps): PaginationState {
    const [state, setState] = React.useState<PaginationState>({
        currentPage: 1,
        nextPage: 0,
        prePages: [],
        total: 0,
        perPageAmount: props.perPageAmount,
        dataLength: 0,
        setCurrenPage(page) {
            selectPage(page);
        },
        setPerPageAmount(amount) {
            setPerPageAmount(amount);
        },
    });

    React.useEffect(() => {
        setState((o) => ({
            ...o,
            dataLength: props.dataLength,
            total: calcTotalPage(props.dataLength, props.perPageAmount),
        }));
    }, [props.dataLength]);

    const calcTotalPage = React.useCallback(
        (dataLength: number, perPageAmount: number) => {
            return Math.ceil(dataLength / perPageAmount);
        },
        [state.total]
    );

    function selectPage(page: number) {
        setState((o) => {
            return {
                ...o,
                currentPage: page,
            };
        });
    }

    function setPerPageAmount(amount: number) {
        setState((o) => ({
            ...o,
            perPageAmount: amount,
            total: calcTotalPage(props.dataLength, amount),
        }));
    }
    return state;
}
