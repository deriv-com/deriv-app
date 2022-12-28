import { localize } from '@deriv/translations';

const createBanxaProvider = store => ({
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
    getScriptDependencies: () => [], // None.
    getDefaultFromCurrency: () => '',
    getFromCurrencies: () => ['*'],
    getToCurrencies: () => ['*'],
    getWidgetHtml: () => {
        return new Promise((resolve, reject) => {
            store.WS.serviceToken({
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

export default { createBanxaProvider };
