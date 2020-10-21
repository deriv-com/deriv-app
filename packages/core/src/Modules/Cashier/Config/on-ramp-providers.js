import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services';

// TODO: Write tests to enforce provider structure.

const createBanxaProvider = () => ({
    icon: { dark: 'IcCashierBanxaDark', light: 'IcCashierBanxaLight' },
    name: 'Banxa',
    getDescription: () =>
        localize(
            'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
        { dark: 'IcCashierBpayDark', light: 'IcCashierBpayLight' },
        { dark: 'IcCashierSepaDark', light: 'IcCashierSepaLight' },
        { dark: 'IcCashierBlueshyftDark', light: 'IcCashierBlueshyftLight' },
        { dark: 'IcCashierFlexepinDark', light: 'IcCashierFlexepinLight' },
        { dark: 'IcCashierPayIdDark', light: 'IcCashierPayIdLight' },
        { dark: 'IcCashierPoliDark', light: 'IcCashierPoliLight' },
        { dark: 'IcCashierApplePay', light: 'IcCashierApplePay' },
        { dark: 'IcCashierInteracEtransfer', light: 'IcCashierInteracEtransfer' },
        { dark: 'IcCashierIdeal', light: 'IcCashierIdeal' },
        { dark: 'IcCashierPostBillPayDark', light: 'IcCashierPostBillPayLight' },
        { dark: 'IcCashierSofort', light: 'IcCashierSofort' },
    ],
    getScriptDependencies: () => [],
    getDefaultFromCurrency: () => '',
    getFromCurrencies: () => ['*'],
    getToCurrencies: () => ['*'],
    getWidgetHtml: () => {
        return new Promise((resolve, reject) => {
            WS.serviceToken({
                service_token: 1,
                service: 'banxa',
                referrer: window.location.href,
            }).then(response => {
                if (response.error) {
                    reject(response.error.message);
                } else {
                    const { url } = response.service_token.banxa;

                    if (url) {
                        window.open(url);
                    }

                    // Resolving empty will/should redirect user.
                    resolve();
                }
            });
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: false,
});

const createChangellyProvider = client => ({
    icon: { dark: 'IcCashierChangellyDark', light: 'IcCashierChangellyLight' },
    name: 'Changelly',
    getDescription: () =>
        localize(
            'Your simple access to crypto. Fast and secure way to exchange and purchase 150+ cryptocurrencies. 24/7 live-chat support.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
    ],
    getScriptDependencies: () => ['https://widget.changelly.com/affiliate.js'],
    getDefaultFromCurrency: () => 'usd',
    getFromCurrencies: () => ['usd', 'eur', 'gbp'],
    getToCurrencies: () => ['bch', 'btc', 'etc', 'eth', 'ltc', 'ust'],
    getWidgetHtml() {
        return new Promise(resolve => {
            const currency = getCurrencyDisplayCode(client.currency).toLowerCase();
            const from_currencies = this.getFromCurrencies().join(',');

            resolve(
                `<iframe src="https://widget.changelly.com?from=${from_currencies}&to=${currency}&amount=50&address=&fromDefault=${this.default_from_currency}&toDefault=${currency}&theme=danger&merchant_id=iiq3jdt2p44yrfbx&payment_id=&v=2" width="100%" height="475px" class="changelly" scrolling="no" onLoad="function at(t){var e=t.target,i=e.parentNode,n=e.contentWindow,r=function(){return n.postMessage({width:i.offsetWidth},it.url)};window.addEventListener('resize',r),r()};at.apply(this, arguments);" style="min-height: 100%; min-width: 100%; overflow-y: visible; border: none">Can't load widget</iframe>`
            );
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: true,
});

const createWyreProvider = () => ({
    icon: { dark: 'IcCashierWyreDark', light: 'IcCashierWyreLight' },
    name: 'Wyre',
    getDescription: () =>
        localize(
            'A secure and compliant bridge between fiat currencies and cryptocurrencies. Supports BTC, ETH, WETH, and DAI. Exchange crypto safely and securely with Wyre.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
    ],
    getScriptDependencies: () => [],
    getDefaultFromCurrency: () => '',
    getFromCurrencies: () => ['*'],
    getToCurrencies: () => ['*'],
    getWidgetHtml: () => {
        return new Promise((resolve, reject) => {
            WS.serviceToken({ service_token: 1, service: 'wyre' }).then(response => {
                if (response.error) {
                    reject(response.error.message);
                } else {
                    const { url } = response.service_token.wyre;

                    if (url) {
                        window.open(url);
                    }

                    // Resolving empty will/should redirect user.
                    resolve();
                }
            });
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: false,
});

export default {
    createBanxaProvider,
    createChangellyProvider,
    createWyreProvider,
};
