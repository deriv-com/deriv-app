import { action, computed, makeObservable, observable } from 'mobx';
import { buy_sell } from 'Constants/buy-sell';
import { getShortNickname } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import BaseStore from 'Stores/base_store';

export default class AdvertiserPageStore extends BaseStore {
    active_index = 0;
    ad = null;
    advertiser_first_name = '';
    advertiser_last_name = '';
    advertiser_info = {};
    adverts = [];
    counterparty_type = buy_sell.BUY;
    api_error_message = '';
    form_error_message = '';
    has_more_adverts_to_load = false;
    is_counterparty_advertiser_blocked = false;
    is_dropdown_menu_visible = false;
    is_loading = true;
    is_loading_adverts = true;
    is_submit_disabled = true;
    show_ad_popup = false;
    submitForm = () => {};

    constructor(root_store) {
        super(root_store);

        makeObservable(this, {
            active_index: observable,
            ad: observable,
            advertiser_first_name: observable,
            advertiser_last_name: observable,
            advertiser_info: observable,
            adverts: observable,
            counterparty_type: observable,
            api_error_message: observable,
            form_error_message: observable,
            has_more_adverts_to_load: observable,
            is_counterparty_advertiser_blocked: observable,
            is_dropdown_menu_visible: observable,
            is_loading: observable,
            is_loading_adverts: observable,
            is_submit_disabled: observable,
            show_ad_popup: observable,
            submitForm: observable,
            account_currency: computed,
            advert: computed,
            advertiser_details: computed,
            advertiser_details_id: computed,
            advertiser_details_name: computed,
            advertiser_full_name: computed,
            short_name: computed,
            getAdvertiserInfo: action.bound,
            handleTabItemClick: action.bound,
            onCancel: action.bound,
            onCancelClick: action.bound,
            onConfirmClick: action.bound,
            onMount: action.bound,
            onSubmit: action.bound,
            setActiveIndex: action.bound,
            setAd: action.bound,
            setAdvertiserFirstName: action.bound,
            setAdvertiserLastName: action.bound,
            setAdvertiserInfo: action.bound,
            setAdverts: action.bound,
            setIsCounterpartyAdvertiserBlocked: action.bound,
            setCounterpartyType: action.bound,
            setErrorMessage: action.bound,
            setFormErrorMessage: action.bound,
            setHasMoreAdvertsToLoad: action.bound,
            setIsDropdownMenuVisible: action.bound,
            setIsLoading: action.bound,
            setIsLoadingAdverts: action.bound,
            setIsSubmitDisabled: action.bound,
            setShowAdPopup: action.bound,
            setSubmitForm: action.bound,
            showAdPopup: action.bound,
            showBlockUserModal: action.bound,
        });
    }

    get account_currency() {
        return this.advert?.account_currency;
    }

    get advert() {
        return this.root_store.buy_sell_store.selected_ad_state;
    }

    get advertiser_details() {
        return this.advert?.advertiser_details || {};
    }

    get advertiser_details_id() {
        return this.advert?.advertiser_details?.id;
    }

    get advertiser_details_name() {
        return this.advert?.advertiser_details?.name;
    }

    get advertiser_full_name() {
        return `${this.advertiser_first_name} ${this.advertiser_last_name}`;
    }

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

    handleTabItemClick(idx) {
        this.setActiveIndex(idx);
        if (idx === 0) {
            this.setCounterpartyType(buy_sell.BUY);
        } else {
            this.setCounterpartyType(buy_sell.SELL);
        }
    }

    onCancel() {
        this.root_store.general_store.setIsBlockUserModalOpen(false);
        this.setIsDropdownMenuVisible(false);
    }

    onCancelClick() {
        this.setShowAdPopup(false);
    }

    onConfirmClick(order_info) {
        const nav = { location: 'buy_sell' };
        this.root_store.general_store.redirectTo('orders', { order_info, nav });
    }

    onMount() {
        this.getAdvertiserInfo();
    }

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

    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    setAd(ad) {
        this.ad = ad;
    }

    setAdvertiserFirstName(advertiser_first_name) {
        this.advertiser_first_name = advertiser_first_name;
    }

    setAdvertiserLastName(advertiser_last_name) {
        this.advertiser_last_name = advertiser_last_name;
    }

    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    setAdverts(adverts) {
        this.adverts = adverts;
    }

    setIsCounterpartyAdvertiserBlocked(is_counterparty_advertiser_blocked) {
        this.is_counterparty_advertiser_blocked = is_counterparty_advertiser_blocked;
    }

    setCounterpartyType(counterparty_type) {
        this.counterparty_type = counterparty_type;
    }

    setErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    setFormErrorMessage(form_error_message) {
        this.form_error_message = form_error_message;
    }

    setHasMoreAdvertsToLoad(has_more_adverts_to_load) {
        this.has_more_adverts_to_load = has_more_adverts_to_load;
    }

    setIsDropdownMenuVisible(is_dropdown_menu_visible) {
        this.is_dropdown_menu_visible = is_dropdown_menu_visible;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsLoadingAdverts(is_loading_adverts) {
        this.is_loading_adverts = is_loading_adverts;
    }

    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    setShowAdPopup(show_ad_popup) {
        this.show_ad_popup = show_ad_popup;
    }

    setSubmitForm(submitFormFn) {
        this.submitForm = submitFormFn;
    }

    showAdPopup() {
        if (!this.root_store.general_store.is_advertiser) {
            this.root_store.buy_sell_store.showVerification();
        } else {
            this.setShowAdPopup(true);
        }
    }

    showBlockUserModal() {
        if (
            !this.is_counterparty_advertiser_blocked &&
            this.advertiser_info.id !== this.root_store.general_store.advertiser_id
        ) {
            this.root_store.general_store.setIsBlockUserModalOpen(true);
        }
    }
}
