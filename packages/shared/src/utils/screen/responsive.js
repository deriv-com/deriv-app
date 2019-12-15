export const MAX_MOBILE_WIDTH = 767;
export const MAX_TABLET_WIDTH = 1023;
export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;
export const isDesktop = () => window.innerWidth > MAX_TABLET_WIDTH;
export const isTablet = () => MAX_MOBILE_WIDTH < window.innerWidth && window.innerWidth <= MAX_TABLET_WIDTH;
