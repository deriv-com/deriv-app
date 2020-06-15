import { action, observable, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import BaseStore from '../../base-store';

export default class OnRampStore extends BaseStore {
    @observable api_error = null;
    @observable deposit_address = null;
    @observable deposit_address_ref = null;
    @observable is_deposit_address_loading = true;
    @observable is_disclaimer_checkbox_checked = false;
    @observable is_onramp_modal_open = false;
    @observable selected_provider = null;
    @observable should_show_widget = false;
    @observable onramp_popup_modal_title = '';

    constructor(root_store) {
        super({ root_store });

        this.onramp_providers = [
            {
                default_from_currency: 'usd',
                description: localize(
                    'The best instant cryptocurrency exchange platform with the best exchange rates for cryptocurrencies.'
                ),
                from_currencies: ['usd', 'eur', 'gbp'],
                getWidgetHtml() {
                    const { currency } = root_store.client;
                    return `<script src="https://widget.changelly.com/affiliate.js"></script><iframe src="https://widget.changelly.com?from=${this.from_currencies.join(
                        ','
                    )}&to=${currency}&amount=50&address=&fromDefault=${
                        this.default_from_currency
                    }&toDefault=${currency}&theme=danger&merchant_id=iiq3jdt2p44yrfbx&payment_id=&v=2" width="100%" height="420px" class="changelly" scrolling="no" onLoad="function at(t){var e=t.target,i=e.parentNode,n=e.contentWindow,r=function(){return n.postMessage({width:i.offsetWidth},it.url)};window.addEventListener('resize',r),r()};at.apply(this, arguments);" style="min-height: 100%; min-width: 100%; overflow-y: visible; border: none">Can't load widget</iframe>`;
                },
                icon: 'IcCashierChangelly',
                name: 'Changelly',
                payment_icons: ['IcCashierVisa', 'IcCashierMastercard', 'IcCashierMaestro'],
                to_currencies: ['btc', 'eth', 'ltc'],
                type: 'widget',
            },
        ];
    }

    @computed
    get is_onramp_tab_visible() {
        return this.filtered_onramp_providers.length > 0;
    }

    @computed
    get filtered_onramp_providers() {
        const { currency } = this.root_store.client;
        return this.onramp_providers.filter(provider => provider.to_currencies.includes(currency.toLowerCase()));
    }

    @action.bound
    resetPopup() {
        this.deposit_address = null;
        this.deposit_address_ref = null;
        this.is_deposit_address_loading = true;
        this.is_disclaimer_checkbox_checked = false;
        this.onramp_popup_modal_title = '';
        this.selected_provider = null;
        this.should_show_widget = false;
    }

    @action.bound
    onDisclaimerCheckboxChange(event) {
        this.is_disclaimer_checkbox_checked = event.target.checked;
    }

    @action.bound
    onClickCopyDepositAddress() {
        const range = document.createRange();
        range.selectNodeContents(this.deposit_address_ref);

        const selections = window.getSelection();
        selections.removeAllRanges();
        selections.addRange(range);
    }

    @action.bound
    onClickDisclaimerContinue() {
        this.should_show_widget = true;
        this.setOnRampPopupModalTitle(localize('Payment channel'));
    }

    @action.bound
    pollApiForDepositAddress() {
        this.setIsDepositAddressLoading(true);

        const deposit_address_interval = setInterval(() => getDepositAddressFromApi, 3000);
        const getDepositAddressFromApi = () => {
            WS.authorized.cashier('deposit', { provider: 'crypto', type: 'api' }).then(response => {
                let should_clear_interval = false;

                if (response.error) {
                    this.setApiError(response.error);
                    should_clear_interval = true;
                } else {
                    const { address } = response.cashier.deposit;

                    if (address) {
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
    setApiError(api_error) {
        this.api_error = api_error;
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
    setSelectedProvider(provider) {
        if (provider) {
            this.selected_provider = provider;
            this.setOnRampPopupModalTitle(' '); // Empty title.
            this.setIsOnRampModalOpen(true);
            this.pollApiForDepositAddress();
        } else {
            this.setIsOnRampModalOpen(false);
            this.selected_provider = null;
        }
    }

    @action.bound
    setOnRampPopupModalTitle(title) {
        this.onramp_popup_modal_title = title;
    }
}
