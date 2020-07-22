import { action, observable, computed, reaction } from 'mobx';
import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode, routes, websiteUrl } from '@deriv/shared';
import { WS } from 'Services';
import BaseStore from '../../base-store';

export default class OnRampStore extends BaseStore {
    @observable api_error = null;
    @observable deposit_address = null;
    @observable is_deposit_address_loading = true;
    @observable is_deposit_address_popover_open = false;
    @observable is_onramp_modal_open = false;
    @observable selected_provider = null;
    @observable should_show_widget = false;

    deposit_address_ref = null;
    DEPENDENCY_TYPE_URL = 'url';
    DEPENDENCY_TYPE_RAW = 'raw';

    constructor(root_store) {
        super({ root_store });
        this.onramp_providers = [
            {
                icon: 'IcCashierChangelly',
                name: 'Changelly',
                description: localize(
                    'Your simple access to crypto. Fast and secure way to exchange and purchase 150+ cryptocurrencies. 24/7 live-chat support.'
                ),
                currency_default: 'usd',
                currencies_from: ['usd', 'eur', 'gbp'],
                currencies_to: ['bch', 'btc', 'etc', 'eth', 'ltc', 'ust'],
                payment_icons: ['IcCashierVisa', 'IcCashierMastercard'],
                getWidgetDependencies: () => [
                    {
                        id: 'changelly-affiliate-js',
                        type: this.DEPENDENCY_TYPE_URL,
                        data: 'https://widget.changelly.com/affiliate.js',
                    },
                ],
                getWidgetHtml() {
                    const currency = getCurrencyDisplayCode(root_store.client.currency).toLowerCase();
                    return `<iframe src="https://widget.changelly.com?from=${this.currencies_from.join(
                        ','
                    )}&to=${currency}&amount=50&address=&fromDefault=${
                        this.currency_default
                    }&toDefault=${currency}&theme=danger&merchant_id=iiq3jdt2p44yrfbx&payment_id=&v=2" width="100%" height="475px" class="changelly" scrolling="no" onLoad="function at(t){var e=t.target,i=e.parentNode,n=e.contentWindow,r=function(){return n.postMessage({width:i.offsetWidth},it.url)};window.addEventListener('resize',r),r()};at.apply(this, arguments);" style="min-height: 100%; min-width: 100%; overflow-y: visible; border: none">Can't load widget</iframe>`;
                },
            },
            {
                icon: 'IcUnknown',
                name: 'Wyre',
                description: localize(
                    'Access the evolution of finance. World-class tools for blockchain developers, financial services and protocols.'
                ),
                currency_default: 'usd',
                currencies_from: ['usd', 'cad', 'eur', 'gbp', 'aud'],
                currencies_to: ['btc', 'eth', 'dai', 'usdc'],
                payment_icons: ['IcCashierVisa', 'IcCashierMastercard'],
                getWidgetDependencies: () => {
                    const currency = getCurrencyDisplayCode(root_store.client.currency);
                    const getCryptoName = () => {
                        switch (currency) {
                            case 'ETH':
                                return 'ethereum';
                            case 'BTC':
                                return 'bitcoin';
                            case 'DAI':
                                return 'dai';
                            default:
                                return 'unknown';
                        }
                    };
                    return [
                        {
                            id: 'wyre-verify-js',
                            type: this.DEPENDENCY_TYPE_URL,
                            data: 'https://verify.sendwyre.com/js/verify-module-init-beta.js',
                        },
                        {
                            id: 'wyre_widget',
                            type: this.DEPENDENCY_TYPE_RAW,
                            data: `
                            (function () { 
                                var widget = new Wyre({
                                    account: 'AC_W8W4ZBTQNYE',
                                    env: 'test',
                                    operation: {
                                        primaryColor: '#000',
                                        type: 'debitcard-hosted-dialog',
                                        // dest: '${getCryptoName()}:${this.deposit_address}',
                                        destCurrency: '${currency}',
                                        sourceAmount: 10.0,
                                        paymentMethod: 'debit-card'
                                    }
                                });

                                // Open widget immediately.
                                widget.open();
                            })();`,
                            global_dependents: ['Wyre'],
                            should_close_modal: true,
                        },
                    ];
                },
            },
        ];
    }

    @action.bound
    loadProviderDependencies(provider) {
        const dependencies = provider.getWidgetDependencies ? provider.getWidgetDependencies() : [];

        dependencies.forEach(dependency => {
            const { id, data, global_dependents = [], should_close_modal, type } = dependency;
            const dependency_id = `on-ramp__dependency--${id}`;

            if (!document.getElementById(dependency_id)) {
                const el_host = document.querySelector('.on-ramp__widget-container');
                const el_script = document.createElement('script');

                el_script.id = dependency_id;

                if (type === 'url') {
                    el_script.src = data;
                } else {
                    el_script.innerHTML = data;
                }

                const doAppendScript = () => {
                    el_host.appendChild(el_script);
                    if (should_close_modal) {
                        this.setSelectedProvider(null);
                    }
                };

                if (global_dependents.length) {
                    // Some scripts depend on certain globals to be exposed. Wait for these
                    // to be available before injecting this script tag.
                    global_dependents.forEach(global_dependent => {
                        let should_clear = true;
                        const global_interval_checker = setInterval(() => {
                            if (window[global_dependent]) {
                                clearInterval(global_interval_checker);
                                doAppendScript();
                                should_clear = false;
                            }
                        }, 500);
                        setTimeout(() => {
                            // In case of global not being available in 30 secs
                            // cleanup and pretend nothing ever happened.
                            if (should_clear) {
                                this.setShouldShowWidget(false);
                                clearInterval(global_interval_checker);
                            }
                        }, 30000);
                    });
                } else {
                    doAppendScript();
                }
            }
        });
    }

    @computed
    get is_onramp_tab_visible() {
        return this.filtered_onramp_providers.length > 0 && !this.root_store.ui.is_mobile;
    }

    @computed
    get filtered_onramp_providers() {
        const { currency } = this.root_store.client;
        return this.onramp_providers.filter(provider => provider.currencies_to.includes(currency.toLowerCase()));
    }

    @computed
    get onramp_popup_modal_title() {
        if (this.should_show_widget) {
            return localize('Payment channel');
        } else if (this.selected_provider) {
            if (this.should_show_dialog) {
                return this.api_error
                    ? localize('Our server cannot retrieve an address.')
                    : localize("You don't have a crypto address yet.");
            }
            return ' '; // Empty string to render header + close icon.
        }
        return undefined;
    }

    @computed
    get should_show_dialog() {
        return this.api_error || !this.deposit_address;
    }

    @action.bound
    onClickCopyDepositAddress() {
        const range = document.createRange();
        range.selectNodeContents(this.deposit_address_ref);

        const selections = window.getSelection();
        selections.removeAllRanges();
        selections.addRange(range);

        navigator.clipboard.writeText(this.deposit_address).then(() => {
            this.setIsDepositAddressPopoverOpen(true);
            setTimeout(() => this.setIsDepositAddressPopoverOpen(false), 500);
        });
    }

    @action.bound
    onClickDisclaimerContinue() {
        this.should_show_widget = true;
    }

    @action.bound
    pollApiForDepositAddress(should_allow_empty_address) {
        this.setIsDepositAddressLoading(true);
        this.setApiError(null);

        const deposit_address_interval = setInterval(() => getDepositAddressFromApi, 3000);
        const getDepositAddressFromApi = () => {
            WS.authorized.cashier('deposit', { provider: 'crypto', type: 'api' }).then(response => {
                let should_clear_interval = false;

                if (response.error) {
                    this.setApiError(response.error);
                    should_clear_interval = true;
                } else {
                    const { address } = response.cashier.deposit;

                    if (address || should_allow_empty_address) {
                        this.setDepositAddress(address);
                        should_clear_interval = true;
                    }
                }

                if (should_clear_interval) {
                    clearInterval(deposit_address_interval);
                    this.setIsDepositAddressLoading(false);
                }
            });
        };

        getDepositAddressFromApi();
        setTimeout(() => {
            clearInterval(deposit_address_interval);
            this.setIsDepositAddressLoading(false);
        }, 30000);
    }

    @action.bound
    onClickGoToDepositPage() {
        this.pollApiForDepositAddress(false);
        window.open(websiteUrl() + routes.cashier_deposit.substring(1));
    }

    @action.bound
    resetPopup() {
        this.setApiError(null);
        this.setDepositAddress(null);
        this.setDepositAddressRef(null);
        this.setIsDepositAddressLoading(true);
        this.setSelectedProvider(null);
        this.setShouldShowWidget(false);
    }

    @action.bound
    setApiError(api_error) {
        this.api_error = api_error;
    }

    @action.bound
    setCopyIconRef(ref) {
        this.copy_icon_ref = ref;
    }

    @action.bound
    setDepositAddress(deposit_address) {
        this.deposit_address = deposit_address;
    }

    @action.bound
    setDepositAddressRef(ref) {
        this.deposit_address_ref = ref;
    }

    @action.bound
    setIsDepositAddressLoading(is_loading) {
        this.is_deposit_address_loading = is_loading;
    }

    @action.bound
    setIsOnRampModalOpen(is_open) {
        this.is_onramp_modal_open = is_open;
    }

    @action.bound
    setIsDepositAddressPopoverOpen(is_open) {
        this.is_deposit_address_popover_open = is_open;
    }

    @action.bound
    setSelectedProvider(provider) {
        if (provider) {
            this.selected_provider = provider;
            this.setIsOnRampModalOpen(true);
            this.pollApiForDepositAddress(true);
        } else {
            this.setIsOnRampModalOpen(false);
            this.selected_provider = null;
        }
    }

    @action.bound
    setShouldShowWidget(should_show) {
        this.should_show_widget = should_show;
    }
}
