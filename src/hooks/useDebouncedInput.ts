import React from 'react';
import { FormikContext } from 'formik';
export function useDebouncedInput(
    debouncedCallback?: (value: string) => void,
    delay?: number
): [string, (newString: string) => void] {
    const [searchString, setString] = React.useState<string>('');
    const typingRef = React.useRef<any>();

    function typingBehavior(newString: string) {
        clearTimeout(typingRef.current);

        typingRef.current = setTimeout(() => {
            setString(newString);
        }, delay || 300);
    }

    React.useEffect(() => {
        if (searchString && debouncedCallback) {
            debouncedCallback(searchString);
        }

        return () => {
            clearTimeout(typingRef.current);
        };
    }, [searchString]);
    return [searchString, typingBehavior];
}
