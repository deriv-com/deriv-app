import { useWindowSize } from 'usehooks-ts';

const BREAKPOINTS = {
    maxMobile: 600,
    maxTablet: 1280,
};

/** A custom hook to check for the client device and determine the layout to be rendered */
const useDevice = () => {
    const { width, height } = useWindowSize();
    const isMobile = width > 0 && width < BREAKPOINTS.maxMobile;
    const isTablet = width >= BREAKPOINTS.maxMobile && width < BREAKPOINTS.maxTablet;
    const isDesktop = width >= BREAKPOINTS.maxTablet;
    const isTabletPortrait = isTablet && height > width;

    return {
        isDesktop,
        isMobile,
        isTablet,
        isTabletPortrait,
    };
};

export default useDevice;
