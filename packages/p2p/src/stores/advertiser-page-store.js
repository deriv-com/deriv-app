import { action, computed, observable } from 'mobx';
import { buy_sell } from 'Constants/buy-sell';
import { getShortNickname } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import BaseStore from 'Stores/base_store';

export default class AdvertiserPageStore extends BaseStore {
    @observable active_index = 0;
    @observable ad = null;
    @observable advertiser_first_name = '';
    @observable advertiser_last_name = '';
    @observable advertiser_info = {};
    @observable adverts = [];
    @observable counterparty_type = buy_sell.BUY;
    @observable api_error_message = '';
    @observable form_error_message = '';
    @observable has_more_adverts_to_load = false;
    @observable is_counterparty_advertiser_blocked = false;
    @observable is_dropdown_menu_visible = false;
    @observable is_loading = true;
    @observable is_loading_adverts = true;
    @observable is_submit_disabled = true;
    @observable show_ad_popup = false;
    @observable submitForm = () => {};

    @computed
    get account_currency() {
        return this.advert?.account_currency;
    }

    @computed
    get advert() {
        return this.root_store.buy_sell_store.selected_ad_state;
    }

    @computed
    get advertiser_details() {
        return this.advert?.advertiser_details || {};
    }

    @computed
    get advertiser_details_id() {
        return this.advert?.advertiser_details?.id;
    }

    @computed
    get advertiser_details_name() {
        return this.advert?.advertiser_details?.name;
    }

    @computed
    get advertiser_full_name() {
        return `${this.advertiser_first_name} ${this.advertiser_last_name}`;
    }

    @computed
    get short_name() {
        return getShortNickname(this.advertiser_details_name);
    }

    loadMoreAdvertiserAdverts({ startIndex }) {
        const { buy_sell_store, general_store } = this.root_store;
        this.setIsLoadingAdverts(true);
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: this.counterparty_type,
                advertiser_id: this.advertiser_details_id,
                offset: startIndex,
                limit: general_store.list_item_limit,
                ...(buy_sell_store.selected_local_currency
                    ? { local_currency: buy_sell_store.selected_local_currency }
                    : {}),
            }).then(response => {
                if (response.error) {
                    this.setErrorMessage(response.error);
                } else {
                    const { list } = response.p2p_advert_list;

                    list.forEach(item => {
                        item.payment_method_names = buy_sell_store.getSupportedPaymentMethods(
                            item.payment_method_names
                        );
                    });

                    this.setAdverts(list);
                    this.setHasMoreAdvertsToLoad(list.length >= general_store.list_item_limit);
                }
                this.setIsLoadingAdverts(false);
                resolve();
            });
        });
    }

    @action.bound
    getAdvertiserInfo() {
        this.setIsLoading(true);
        requestWS({
            p2p_advertiser_info: 1,
            id: this.advertiser_details_id,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;
                this.setAdvertiserInfo(p2p_advertiser_info);
                this.setIsCounterpartyAdvertiserBlocked(!!p2p_advertiser_info.is_blocked);
                this.setAdvertiserFirstName(p2p_advertiser_info.first_name);
                this.setAdvertiserLastName(p2p_advertiser_info.last_name);
            } else {
                this.setErrorMessage(response.error);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    handleTabItemClick(idx) {
        this.setActiveIndex(idx);
        if (idx === 0) {
            this.setCounterpartyType(buy_sell.BUY);
        } else {
            this.setCounterpartyType(buy_sell.SELL);
        }
    }

    @action.bound
    onCancel() {
        this.root_store.general_store.setIsBlockUserModalOpen(false);
        this.setIsDropdownMenuVisible(false);
    }

    @action.bound
    onCancelClick() {
        this.setShowAdPopup(false);
    }

    @action.bound
    onConfirmClick(order_info) {
        const nav = { location: 'buy_sell' };
        this.root_store.general_store.redirectTo('orders', { order_info, nav });
    }

    @action.bound
    onMount() {
        this.getAdvertiserInfo();
    }

    @action.bound
    onSubmit() {
        this.root_store.general_store.blockUnblockUser(
            !this.is_counterparty_advertiser_blocked,
            this.advertiser_details_id
        );
        this.setIsDropdownMenuVisible(false);
    }

    onTabChange() {
        this.setAdverts([]);
        this.loadMoreAdvertiserAdverts({ startIndex: 0 });
    }

    @action.bound
    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    @action.bound
    setAd(ad) {
        this.ad = ad;
    }

    @action.bound
    setAdvertiserFirstName(advertiser_first_name) {
        this.advertiser_first_name = advertiser_first_name;
    }

    @action.bound
    setAdvertiserLastName(advertiser_last_name) {
        this.advertiser_last_name = advertiser_last_name;
    }

    @action.bound
    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    @action.bound
    setAdverts(adverts) {
        this.adverts = adverts;
    }

    @action.bound
    setIsCounterpartyAdvertiserBlocked(is_counterparty_advertiser_blocked) {
        this.is_counterparty_advertiser_blocked = is_counterparty_advertiser_blocked;
    }

    @action.bound
    setCounterpartyType(counterparty_type) {
        this.counterparty_type = counterparty_type;
    }

    @action.bound
    setErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    @action.bound
    setFormErrorMessage(form_error_message) {
        this.form_error_message = form_error_message;
    }

    @action.bound
    setHasMoreAdvertsToLoad(has_more_adverts_to_load) {
        this.has_more_adverts_to_load = has_more_adverts_to_load;
    }

    @action.bound
    setIsDropdownMenuVisible(is_dropdown_menu_visible) {
        this.is_dropdown_menu_visible = is_dropdown_menu_visible;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsLoadingAdverts(is_loading_adverts) {
        this.is_loading_adverts = is_loading_adverts;
    }

    @action.bound
    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    @action.bound
    setShowAdPopup(show_ad_popup) {
        this.show_ad_popup = show_ad_popup;
    }

    @action.bound
    setSubmitForm(submitFormFn) {
        this.submitForm = submitFormFn;
    }

    @action.bound
    showAdPopup() {
        if (!this.root_store.general_store.is_advertiser) {
            this.root_store.buy_sell_store.showVerification();
        } else {
            this.setShowAdPopup(true);
        }
    }

    @action.bound
    showBlockUserModal() {
        if (
            !this.is_counterparty_advertiser_blocked &&
            this.advertiser_info.id !== this.root_store.general_store.advertiser_id
        ) {
            this.root_store.general_store.setIsBlockUserModalOpen(true);
        }
    }
}
