import React from 'react';
import { useMediaQuery } from 'react-responsive';

export enum screenType {
    'small mobile',
    'mobile',
    'medium',
    'large',
    'extraLarge',
    'extremeLarge',
    'superLarge',
    undefined,
}

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
    const isSuperExLargeScreen = useMediaQuery({
        query: '(min-width: 1200px)',
    });
    if (isSmallScreen) return screenType['small mobile'];
    if (isExLargeScreen) return screenType['extraLarge'];
    if (isLargeScreen) return screenType['large'];
    if (isMediumScreen) return screenType['medium'];
    if (isMobileScreen) return screenType['mobile'];
    if (isSuperExLargeScreen) return screenType['superLarge'];

    return screenType.undefined;
}
