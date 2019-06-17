import { localize } from 'App/i18n';

export const getUnsupportedContracts = () => ({
    EXPIRYMISS: {
        name    : localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name    : localize('Ends Between'),
        position: 'bottom',
    },
    RANGE: {
        name    : localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name    : localize('Goes Outside'),
        position: 'bottom',
    },
    RESETCALL: {
        name    : localize('Reset Call'),
        position: 'top',
    },
    RESETPUT: {
        name    : localize('Reset Put'),
        position: 'bottom',
    },
    TICKHIGH: {
        name    : localize('High Tick'),
        position: 'top',
    },
    TICKLOW: {
        name    : localize('Low Tick'),
        position: 'bottom',
    },
    ASIANU: {
        name    : localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name    : localize('Asian Down'),
        position: 'bottom',
    },
    LBFLOATCALL: {
        name    : localize('Close-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name    : localize('High-Close'),
        position: 'top',
    },
    LBHIGHLOW: {
        name    : localize('High-Low'),
        position: 'top',
    },
    CALLSPREAD: {
        name    : localize('Call Spread'),
        position: 'top',
    },
    PUTSPREAD: {
        name    : localize('Put Spread'),
        position: 'bottom',
    },
    RUNHIGH: {
        name    : localize('Only Ups'),
        position: 'top',
    },
    RUNLOW: {
        name    : localize('Only Downs'),
        position: 'bottom',
    },
});

export const getSupportedContracts = is_high_low => ({
    CALL: {
        name    : is_high_low ?  localize('Higher') : localize('Rise'),
        position: 'top',
    },
    PUT: {
        name    : is_high_low ? localize('Lower') : localize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name    : localize('Rise'),
        position: 'top',
    },
    PUTE: {
        name    : localize('Fall'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name    : localize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name    : localize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name    : localize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name    : localize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name    : localize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name    : localize('Under'),
        position: 'bottom',
    },
    ONETOUCH: {
        name    : localize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name    : localize('No Touch'),
        position: 'bottom',
    },
});

const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type, is_high_low = false) => (getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type].name : '');
export const getContractTypePosition = (type, is_high_low = false) => (getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type].position : 'top');
