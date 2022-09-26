import React from 'react';

interface DebouncedInputProps<Value, TypeEvents = React.ChangeEvent<any>> {
    debouncedCallback?: (value: Value, event?: TypeEvents) => void;
    delay?: number;
}

export function useDebouncedInput<
    Values extends unknown,
    TypeEvents = React.ChangeEvent<any>
>(
    initialValue: Values,
    params?: DebouncedInputProps<Values, TypeEvents>
): [
    Values,
    (newData: Values, event?: TypeEvents) => void,
    React.Dispatch<React.SetStateAction<Values>>
] {
    const [state, setState] = React.useState<Values>(initialValue);
    const typingRef = React.useRef<any>();
    const eventRef = React.useRef<TypeEvents | null>(null);

    function typingBehavior(newData: Values, event?: TypeEvents) {
        eventRef.current = event || null;
        setState(newData);
        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }
    }

    React.useEffect(() => {
        typingRef.current = setTimeout(() => {
            if (params?.debouncedCallback) {
                (eventRef.current &&
                    params.debouncedCallback(state, eventRef.current)) ||
                    params?.debouncedCallback(state);
            }
        }, params?.delay || 300);

        return () => {
            clearTimeout(typingRef.current);
        };
    }, [state]);

    return [state, typingBehavior, setState];
}
