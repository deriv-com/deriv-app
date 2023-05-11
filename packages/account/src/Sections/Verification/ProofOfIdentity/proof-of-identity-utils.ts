export const identity_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
} as const;

export const submission_status_code = {
    selecting: 'selecting',
    submitting: 'submitting',
    complete: 'complete',
} as const;

export const service_code = {
    idv: 'idv',
    onfido: 'onfido',
    manual: 'manual',
} as const;

export const getRandom3DigitNumber = () => {
    const crypto = window.crypto || (window as any).msCrypto;
    const random_array = new Uint16Array(1);
    let random_number = crypto.getRandomValues(random_array)[0];
    if (random_number > 999) {
        random_number = Number(String(random_number).slice(0, 3));
    } else if (random_number >= 10 && random_number < 100) {
        random_number *= 10;
    } else if (random_number < 10) {
        random_number *= 100;
    }
    return random_number;
};
