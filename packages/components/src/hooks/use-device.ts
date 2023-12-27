import { useWindowSize } from 'usehooks-ts';

// Using the same breakpoints as the ones used by useDevice hook in wallets package & by is_mobile in ui-store
export const MAX_MOBILE_WIDTH = 767;
export const MAX_TABLET_WIDTH = 1024;

/** Checks for the client device width and determines the layout to be rendered */
export const useDevice = () => {
    const { width } = useWindowSize();
    const is_mobile = width > 0 && width <= MAX_MOBILE_WIDTH;
    const is_tablet = width > MAX_MOBILE_WIDTH && width <= MAX_TABLET_WIDTH;
    const is_desktop = width > MAX_TABLET_WIDTH;

    return {
        is_desktop,
        is_mobile,
        is_tablet,
    };
};
