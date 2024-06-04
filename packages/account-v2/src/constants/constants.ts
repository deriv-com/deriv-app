export const LANDING_COMPANY = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const AUTH_STATUS_CODES = {
    EXPIRED: 'expired',
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    SUSPECTED: 'suspected',
    VERIFIED: 'verified',
} as const;

export const POI_SERVICE = {
    idv: 'idv',
    manual: 'manual',
    onfido: 'onfido',
} as const;

export const ACCOUNT_MODAL_REF = '#account_modal';

export const POI_SUBMISSION_STATUS = {
    complete: 'complete',
    selecting: 'selecting',
    submitting: 'submitting',
} as const;

export const EXTERNAL_LINKS = {
    astroPayURL: 'https://app.astropay.com/profile',
    onlinenairaBankURL: 'https://onlinenaira.com/members/bank.htm',
    onlinenairaProfileURL: 'https://onlinenaira.com/members/index.htm',
} as const;
