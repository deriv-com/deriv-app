export const MAX_MOBILE_WIDTH = 767;
export const MAX_TABLET_WIDTH = 1023;
export const isTouchDevice = () => 'ontouchstart' in document.documentElement;
export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;
export const isDesktop = () => isTablet() || window.innerWidth > MAX_TABLET_WIDTH; // TODO: remove tablet once there is a design for the specific size.
export const isTablet = () => MAX_MOBILE_WIDTH < window.innerWidth && window.innerWidth <= MAX_TABLET_WIDTH;
