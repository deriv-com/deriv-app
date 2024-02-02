/* eslint-disable sort-keys */

import React, { PropsWithChildren, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { BreakpointContext, BreakpointContextValue } from '../contexts';

const screens = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
};

export const BreakpointProvider = ({ children }: PropsWithChildren<unknown>) => {
    const isXs = useMediaQuery(`(max-width: ${screens.sm})`);
    const isSm = useMediaQuery(`(min-width: ${screens.sm})`);
    const isMd = useMediaQuery(`(min-width: ${screens.md})`);
    const isLg = useMediaQuery(`(min-width: ${screens.lg})`);
    const isXl = useMediaQuery(`(min-width: ${screens.xl})`);
    const isXXl = useMediaQuery(`(min-width: ${screens['2xl']})`);

    /**
     *
     * The mobile and desktop breakpoints are taken as from the following conditions:
     * isMobile: width > 0 && width < 768
     * isDesktop: width >= 1024
     */
    const isMobile = useMediaQuery(`(max-width: ${screens.md})`);
    const isDesktop = useMemo(() => isLg || isXl || isXXl, [isLg, isXXl, isXl]);

    const value: BreakpointContextValue = useMemo(() => {
        return {
            isXs,
            isSm,
            isMd,
            isLg,
            isXl,
            isXXl,
            isDesktop,
            isMobile,
        };
    }, [isLg, isMd, isSm, isXXl, isXl, isXs, isDesktop, isMobile]);

    return <BreakpointContext.Provider value={value}>{children}</BreakpointContext.Provider>;
};

export default BreakpointProvider;
