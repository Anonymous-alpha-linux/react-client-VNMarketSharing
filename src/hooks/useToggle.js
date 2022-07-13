import { useState } from 'react';

export function useModal(state) {
    const [isShowing, setIsShowing] = useState(!!state || false);

    function toggle(value) {
        if (value) setIsShowing(value);
        else setIsShowing(o => !o);
    }
    return [
        isShowing,
        toggle
    ]
}
