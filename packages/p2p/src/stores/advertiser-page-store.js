import { action, computed, observable, makeObservable } from 'mobx';
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
    is_loading = true;
    is_loading_adverts = true;
    is_submit_disabled = true;
    show_ad_popup = false;
    submitForm = () => {};

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
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
            onCancelClick: action.bound,
            onConfirmClick: action.bound,
            onMount: action.bound,
            setActiveIndex: action.bound,
            setAd: action.bound,
            setAdvertiserFirstName: action.bound,
            setAdvertiserLastName: action.bound,
            setAdvertiserInfo: action.bound,
            setAdverts: action.bound,
            setCounterpartyType: action.bound,
            setErrorMessage: action.bound,
            setFormErrorMessage: action.bound,
            setHasMoreAdvertsToLoad: action.bound,
            setIsLoading: action.bound,
            setIsLoadingAdverts: action.bound,
            setIsSubmitDisabled: action.bound,
            setShowAdPopup: action.bound,
            setSubmitForm: action.bound,
            showAdPopup: action.bound,
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
        const { general_store } = this.root_store;
        this.setIsLoadingAdverts(true);

        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: this.counterparty_type,
                advertiser_id: this.advertiser_details_id,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (response.error) {
                    this.setErrorMessage(response.error);
                } else {
                    const { list } = response.p2p_advert_list;
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
}
