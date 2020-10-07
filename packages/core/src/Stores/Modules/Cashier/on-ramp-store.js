import React from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { localize, Localize } from '@deriv/translations';
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

    constructor(root_store) {
        super({ root_store });
        this.onramp_providers = [
            {
                default_from_currency: 'usd',
                description: (
                    <Localize i18n_default_text='Your simple access to crypto. Fast and secure way to exchange and purchase 150+ cryptocurrencies. 24/7 live-chat support.' />
                ),
                from_currencies: ['usd', 'eur', 'gbp'],
                widget_script_dependencies: { 'changelly-affiliate-js': 'https://widget.changelly.com/affiliate.js' },
                getWidgetHtml() {
                    const currency = getCurrencyDisplayCode(root_store.client.currency).toLowerCase();
                    return `<iframe src="https://widget.changelly.com?from=${this.from_currencies.join(
                        ','
                    )}&to=${currency}&amount=50&address=&fromDefault=${
                        this.default_from_currency
                    }&toDefault=${currency}&theme=danger&merchant_id=iiq3jdt2p44yrfbx&payment_id=&v=2" width="100%" height="475px" class="changelly" scrolling="no" onLoad="function at(t){var e=t.target,i=e.parentNode,n=e.contentWindow,r=function(){return n.postMessage({width:i.offsetWidth},it.url)};window.addEventListener('resize',r),r()};at.apply(this, arguments);" style="min-height: 100%; min-width: 100%; overflow-y: visible; border: none">Can't load widget</iframe>`;
                },
                icon: 'IcCashierChangelly',
                name: 'Changelly',
                payment_icons: ['IcCashierVisa', 'IcCashierMastercard'],
                to_currencies: ['bch', 'btc', 'etc', 'eth', 'ltc', 'ust'],
            },
        ];
    }

    @action.bound
    onMount() {
        this.disposeThirdPartyJsReaction = reaction(
            () => this.selected_provider,
            provider => {
                if (!provider?.widget_script_dependencies) return;

                Object.keys(provider.widget_script_dependencies).forEach(script_name => {
                    if (!document.querySelector(`#${script_name}`)) {
                        const el_script = document.createElement('script');
                        el_script.src = provider.widget_script_dependencies[script_name];
                        el_script.id = script_name;
                        document.body.appendChild(el_script);
                    }
                });
            }
        );
    }

    @action.bound
    onUnmount() {
        if (typeof this.disposeThirdPartyJsReaction === 'function') {
            this.disposeThirdPartyJsReaction();
        }
    }

    @computed
    get is_onramp_tab_visible() {
        return this.filtered_onramp_providers.length > 0 && !this.root_store.ui.is_mobile;
    }

    @computed
    get filtered_onramp_providers() {
        const { currency } = this.root_store.client;
        return this.onramp_providers.filter(provider => provider.to_currencies.includes(currency.toLowerCase()));
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
