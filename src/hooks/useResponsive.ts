import React from 'react';
import { useMediaQuery } from 'react-responsive';

type screenType =
    | 'small mobile'
    | 'mobile'
    | 'medium'
    | 'large'
    | 'extraLarge'
    | 'extremeLarge'
    | undefined;

export function useResponsive(): screenType {
    const isSmallScreen = useMediaQuery({
        query: '(max-width: 575px)',
    });
    const isMobileScreen = useMediaQuery({
        query: '(min-width: 576px)',
    });
    const isMediumScreen = useMediaQuery({
        query: '(min-width: 768px)',
    });
    const isLargeScreen = useMediaQuery({
        query: '(min-width: 992px)',
    });
    const isExLargeScreen = useMediaQuery({
        query: '(min-width: 1200px)',
    });
    if (isSmallScreen) return 'small mobile';
    if (isExLargeScreen) return 'extraLarge';
    if (isLargeScreen) return 'large';
    if (isMediumScreen) return 'medium';
    if (isMobileScreen) return 'mobile';
    return undefined;
}
