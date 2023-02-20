import { getCurrencyDisplayCode } from '@deriv/shared';

class PromiseClass {
    promise: Promise<any>;
    reject?: (reason?: any) => void;
    resolve?: (value?: any) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

// TODO: [duplicate_code] - Move this to shared package
// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// TODO: [duplicate_code] - Move this to shared package
// check if client is from EU
const isEuCountry = (country: string) => eu_countries.includes(country);

// check if mlt or dxtrade for account text
const getAccountText = (account: { is_dxtrade: boolean; is_mt: boolean; text: string }) => {
    let account_text = '';
    if (account.is_dxtrade || account.is_mt) {
        account_text = account.text;
    } else {
        account_text = getCurrencyDisplayCode(account.text);
    }

    return account_text;
};

const getNormalizedPaymentMethod = (
    payment_method: string,
    constants: { [s: string]: Array<string> },
    is_for_icon = false
) => {
    const method = is_for_icon ? payment_method.replace(/[' ',-]/g, '').toLowerCase() : payment_method;

    const normalized_payment_method = Object.entries(constants).reduce(
        (pay_method, [key, value]) => (value.some(el => el === method) ? key : pay_method),
        ''
    );
    return is_for_icon ? normalized_payment_method : normalized_payment_method || payment_method;
};

export { getAccountText, getNormalizedPaymentMethod, isEuCountry, PromiseClass };
