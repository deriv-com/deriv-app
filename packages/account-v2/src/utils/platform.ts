export const isNavigationFromDerivGO = () => window.sessionStorage.getItem('config.platform') === 'derivgo';

export const isNavigationFromP2P = () => window.sessionStorage.getItem('config.platform') === 'dp2p';
