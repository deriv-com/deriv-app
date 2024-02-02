/* eslint-disable sort-keys */
import { createContext } from 'react';

export type BreakpointContextValue = {
    isDesktop: boolean;
    isLg: boolean;
    isMd: boolean;
    isMobile: boolean;
    isSm: boolean;
    isXXl: boolean;
    isXl: boolean;
    isXs: boolean;
};

export const BreakpointContext = createContext<BreakpointContextValue>({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    isXXl: false,
    isDesktop: false,
    isMobile: false,
});

export default BreakpointContext;
