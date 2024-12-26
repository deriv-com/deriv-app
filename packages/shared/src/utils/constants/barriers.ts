//Configures which trade types have barrier rendered when selected
export const CONTRACT_SHADES = {
    ACCU: 'NONE_DOUBLE',
    CALL: 'NONE_SINGLE',
    PUT: 'NONE_SINGLE',
    CALLE: 'NONE_SINGLE',
    PUTE: 'NONE_SINGLE',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS: 'OUTSIDE',
    RANGE: 'BETWEEN',
    UPORDOWN: 'OUTSIDE',
    ONETOUCH: 'NONE_SINGLE', // no shade
    NOTOUCH: 'NONE_SINGLE', // no shade
    ASIANU: 'ABOVE',
    ASIAND: 'BELOW',
    MULTUP: 'NONE_SINGLE',
    MULTDOWN: 'NONE_SINGLE',
    TURBOSLONG: 'NONE_SINGLE',
    TURBOSSHORT: 'NONE_SINGLE',
    VANILLALONGCALL: 'NONE_SINGLE',
    VANILLALONGPUT: 'NONE_SINGLE',
    RESETCALL: 'ABOVE',
    RESETPUT: 'BELOW',
    LBFLOATPUT: 'NONE_SINGLE',
    LBFLOATCALL: 'NONE_SINGLE',
    LBHIGHLOW: 'NONE_DOUBLE',
} as const;

// Default non-shade according to number of barriers
export const DEFAULT_SHADES = {
    1: 'NONE_SINGLE',
    2: 'NONE_DOUBLE',
};

export const BARRIER_COLORS = {
    GREEN: '#008832',
    RED: '#e6190e',
    ORANGE: '#ff6444',
    BLUE: '#2c9aff',
};

export const BARRIER_LINE_STYLES = {
    DASHED: 'dashed',
    DOTTED: 'dotted',
    SOLID: 'solid',
};
