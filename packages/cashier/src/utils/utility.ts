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
    let account_text;
    if (account.is_dxtrade || account.is_mt) {
        account_text = account.text;
    } else {
        account_text = getCurrencyDisplayCode(account.text);
    }

    return account_text;
};

const getNormalizedPaymentMethod = (
    payment_method: string,
    constants: {
        readonly Paypal: readonly [string];
        readonly Bank: readonly [string, string, string, string, string, string, string, string, string, string];
        readonly Permatabank: readonly [string];
        readonly Wechatpay: readonly [string];
        readonly Mandirisyariah: readonly [string];
        readonly Diamondbank: readonly [string];
        readonly Ewallet: readonly [string, string, string, string];
        readonly LiteCoin: readonly [string, string];
        readonly Icbc: readonly [string];
        readonly Verve: readonly [string];
        readonly Bankbri: readonly [string, string];
        readonly Libertyreserve: readonly [string];
        readonly Cimbniaga: readonly [string];
        readonly Bca: readonly [string, string];
        readonly Alipay: readonly [string];
        readonly Bch: readonly [string];
        readonly Bitcoin: readonly [string, string];
        readonly Firstbank: readonly [string];
        readonly PerfectMoney: readonly [string, string];
        readonly WebMoney: readonly [string, string];
        readonly Zenithbank: readonly [string];
        readonly Dai: readonly [string];
        readonly Tether: readonly [string];
        readonly Card: readonly [string, string, string, string];
        readonly Moneygram: readonly [string];
        readonly Gtbank: readonly [string];
        readonly Crypto: readonly [string, string, string, string, string];
        readonly Mandiri: readonly [string];
        readonly Eth: readonly [string, string, string];
        readonly Bni: readonly [string];
    },
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
