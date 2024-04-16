//Configures which trade types have barrier rendered when selected
export const CONTRACT_SHADES = {
    ACCU: 'NONE_DOUBLE',
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
    GREEN: '#4bb4b3',
    RED: '#ec3f3f',
    ORANGE: '#ff6444',
    BLUE: '#377cfc',
};

export const BARRIER_LINE_STYLES = {
    DASHED: 'dashed',
    DOTTED: 'dotted',
    SOLID: 'solid',
};
