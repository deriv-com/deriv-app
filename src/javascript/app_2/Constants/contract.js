import { localize } from '_common/localize';

const getContractConfig = is_high_low => ({
    ASIANU: {
        name    : localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name    : localize('Asian Down'),
        position: 'bottom',
    },
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
    EXPIRYMISS: {
        name    : localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name    : localize('Ends Between'),
        position: 'bottom',
    },
    EXPIRYRANGEE: {
        name    : localize('Ends Between'),
        position: 'top',
    },
    LBFLOATCALL: {
        name    : localize('Close-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name    : localize('High-Close'),
        position: 'bottom',
    },
    LBHIGHLOW: {
        name    : localize('High-Low'),
        position: 'top',
    },
    RANGE: {
        name    : localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name    : localize('Goes Outside'),
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

export const getContractTypeDisplay = (type, is_high_low = false) => (getContractConfig(is_high_low)[type].name);
export const getContractTypePosition = (type, is_high_low = false) => (getContractConfig(is_high_low)[type].position);
