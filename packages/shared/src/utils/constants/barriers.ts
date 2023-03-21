//Configures which trade types have barrier rendered when selected
export const CONTRACT_SHADES = {
    CALL: 'ABOVE',
    PUT: 'BELOW',
    CALLE: 'ABOVE',
    PUTE: 'BELOW',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS: 'OUTSIDE',
    RANGE: 'BETWEEN',
    UPORDOWN: 'OUTSIDE',
    ONETOUCH: 'NONE_SINGLE', // no shade
    NOTOUCH: 'NONE_SINGLE', // no shade
    ASIANU: 'ABOVE',
    ASIAND: 'BELOW',
    MULTUP: 'ABOVE',
    MULTDOWN: 'BELOW',
    VANILLALONGCALL: 'NONE_SINGLE',
    VANILLALONGPUT: 'NONE_SINGLE',
};

// Default non-shade according to number of barriers
export const DEFAULT_SHADES = {
    1: 'NONE_SINGLE',
    2: 'NONE_DOUBLE',
};

export const BARRIER_COLORS = {
    GREEN: '#4bb4b3',
    RED: '#ec3f3f',
    ORANGE: '#ff6444',
    GRAY: '#999999',
    DARK_GRAY: '#6E6E6E',
};

export const BARRIER_LINE_STYLES = {
    DASHED: 'dashed',
    DOTTED: 'dotted',
    SOLID: 'solid',
};
