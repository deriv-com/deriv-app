import { getCurrencyDisplayCode } from '@deriv/shared';
import Constants from 'Constants/constants';

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
    let account_text: string;
    if (account.is_dxtrade || account.is_mt) {
        account_text = account.text;
    } else {
        account_text = getCurrencyDisplayCode(account.text);
    }

    return account_text;
};

const getNormalizedPaymentMethod = (
    payment_method: string,
    constants: typeof Constants.icon_payment_methods | typeof Constants.payment_methods,
    is_for_icon = false
) => {
    const method = is_for_icon ? payment_method.replace(/[' ,-]/g, '').toLowerCase() : payment_method;

    const normalized_payment_method = Object.entries(constants).reduce(
        (pay_method, [key, value]) => (value.some((el: string) => el === method) ? key : pay_method),
        ''
    );
    return is_for_icon ? normalized_payment_method : normalized_payment_method || payment_method;
};

export { getAccountText, getNormalizedPaymentMethod, PromiseClass };
