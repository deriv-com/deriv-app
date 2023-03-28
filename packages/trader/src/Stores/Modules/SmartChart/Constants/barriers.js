export const CONTRACT_SHADES = {
    ACCU: 'NONE_DOUBLE',
    ASIANU: 'ABOVE',
    ASIAND: 'BELOW',
    CALL: 'ABOVE',
    CALLE: 'ABOVE',
    EXPIRYMISS: 'OUTSIDE',
    EXPIRYRANGE: 'BETWEEN',
    MULTDOWN: 'BELOW',
    MULTUP: 'ABOVE',
    NOTOUCH: 'NONE_SINGLE', // no shade
    ONETOUCH: 'NONE_SINGLE', // no shade
    PUT: 'BELOW',
    PUTE: 'BELOW',
    RANGE: 'BETWEEN',
    TURBOSLONG: 'ABOVE',
    TURBOSSHORT: 'BELOW',
    UPORDOWN: 'OUTSIDE',
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
