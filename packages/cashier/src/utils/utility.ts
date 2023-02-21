import { getCurrencyDisplayCode } from '@deriv/shared';

class PromiseClass {
    promise: Promise<unknown>;
    reject?: (reason?: unknown) => void;
    resolve?: (value?: unknown) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

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

export { getAccountText, getNormalizedPaymentMethod, PromiseClass };
