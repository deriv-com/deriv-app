import { action, observable } from 'mobx';
import { buy_sell } from '../src/constants/buy-sell';
import { height_constants } from 'Utils/height_constants';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import { useStores } from '.';

export default class AdvertiserPageStore {
    @observable active_index = 0;
    @observable advertiser_info = {};
    @observable ad = null;
    @observable adverts = [];
    @observable counterparty_type = buy_sell.BUY;
    @observable error_message = '';
    @observable form_error_message = '';
    @observable is_loading = true;
    @observable is_submit_disabled = true;
    @observable show_ad_popup = false;
    @observable submitForm = () => {};

    height_values = [
        height_constants.screen,
        height_constants.advertiser_page_content,
        height_constants.core_header,
        height_constants.core_footer,
        height_constants.filters,
        height_constants.filters_margin,
        height_constants.page_overlay_header,
        height_constants.page_overlay_content_padding,
        height_constants.table_header,
        height_constants.tabs,
    ];
    item_height = 56;

    @action.bound
    getAdvertiserAdverts(advertiser_details) {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: this.counterparty_type,
                advertiser_id: advertiser_details.id,
            }).then(response => {
                if (!response.error) {
                    const { list } = response.p2p_advert_list;
                    this.setAdverts(list);
                } else {
                    this.setErrorMessage(response.error);
                }
                resolve();
            });
        });
    }

    @action.bound
    getAdvertiserInfo(advertiser_details) {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_info: 1,
                id: advertiser_details.id,
            }).then(response => {
                if (!response.error) {
                    const { p2p_advertiser_info } = response;
                    this.setAdvertiserInfo(p2p_advertiser_info);
                } else {
                    this.setErrorMessage(response.error);
                }
                this.setIsLoading(false);
                resolve();
            });
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
    onCancelClick() {
        this.setShowAdPopup(false);
    }

    @action.bound
    onConfirmClick(navigate, order_info) {
        const nav = { location: 'buy_sell' };
        navigate('orders', { order_info, nav });
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
    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    @action.bound
    setAdverts(adverts) {
        this.adverts = adverts;
    }

    @action.bound
    setCounterpartyType(counterparty_type) {
        this.counterparty_type = counterparty_type;
    }

    @action.bound
    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    @action.bound
    setFormErrorMessage(form_error_message) {
        this.form_error_message = form_error_message;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
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
        this.setSubmitFormObservable(submitFormFn);
    }

    @action.bound
    setSubmitFormObservable(submitForm) {
        this.submitForm = submitForm;
    }

    @action.bound
    showAdPopup(is_advertiser, showVerification, advert) {
        if (!is_advertiser) {
            showVerification();
        } else {
            this.setAd(advert);
            this.setShowAdPopup(true);
        }
    }
}
