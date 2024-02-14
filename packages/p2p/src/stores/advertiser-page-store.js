import { action, computed, makeObservable, observable } from 'mobx';
import { buy_sell } from 'Constants/buy-sell';
import { requestWS, subscribeWS } from 'Utils/websocket';
import BaseStore from 'Stores/base_store';

export default class AdvertiserPageStore extends BaseStore {
    active_index = 0;
    counterparty_advertiser_info = {};
    counterparty_type = buy_sell.BUY;
    api_error_message = '';
    form_error_message = '';
    has_more_adverts_to_load = false;
    is_counterparty_advertiser_blocked = false;
    is_dropdown_menu_visible = false;
    is_loading = true;
    is_loading_adverts = true;

    constructor(root_store) {
        super(root_store);

        makeObservable(this, {
            active_index: observable,
            counterparty_advertiser_info: observable,
            counterparty_type: observable,
            api_error_message: observable,
            form_error_message: observable,
            has_more_adverts_to_load: observable,
            is_counterparty_advertiser_blocked: observable,
            is_dropdown_menu_visible: observable,
            is_loading: observable,
            is_loading_adverts: observable,
            account_currency: computed,
            advert: computed,
            advertiser_details: computed,
            advertiser_details_id: computed,
            advertiser_details_name: computed,
            handleTabItemClick: action.bound,
            onAdvertiserIdUpdate: action.bound,
            onCancel: action.bound,
            onMount: action.bound,
            onSubmit: action.bound,
            setActiveIndex: action.bound,
            setAdvertiserInfo: action.bound,
            setIsCounterpartyAdvertiserBlocked: action.bound,
            setCounterpartyType: action.bound,
            setErrorMessage: action.bound,
            setFormErrorMessage: action.bound,
            setHasMoreAdvertsToLoad: action.bound,
            setIsDropdownMenuVisible: action.bound,
            setIsLoading: action.bound,
            setIsLoadingAdverts: action.bound,
            showAdPopup: action.bound,
            showBlockUserModal: action.bound,
        });
    }

    advertiser_info_subscription = {};

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

    setAdvertiserInfo(response) {
        const { general_store } = this.root_store;

        if (response) {
            if (response.error) {
                this.setErrorMessage(response.error);
                this.onUnmount();
            } else {
                const { p2p_advertiser_info } = response;
                this.setCounterpartyAdvertiserInfo(p2p_advertiser_info);

                // TODO: uncomment this when BE has fixed is_blocked flag issue for block user overlay
                // this.setIsCounterpartyAdvertiserBlocked(!!p2p_advertiser_info.is_blocked);

                // TODO: remove this when above issue is fixed
                this.setIsCounterpartyAdvertiserBlocked(
                    general_store.advertiser_relations_response.some(
                        advertiser => p2p_advertiser_info.id === advertiser.id
                    ) || !!p2p_advertiser_info.is_blocked
                );
            }
        }

        this.setIsLoading(false);
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
        if (this.root_store.general_store.isCurrentModal('BlockUserModal')) {
            this.root_store.general_store.hideModal();
        }
        this.setIsDropdownMenuVisible(false);
    }

    onMount() {
        if (this.advertiser_details_id) {
            const { advertiser_id, advertiser_info } = this.root_store.general_store;

            if (this.advertiser_details_id === advertiser_id) {
                this.setIsLoading(false);
                this.setCounterpartyAdvertiserInfo(advertiser_info);
            } else {
                this.advertiser_info_subscription = subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        id: this.advertiser_details_id,
                        subscribe: 1,
                    },
                    [this.setAdvertiserInfo]
                );
            }
        }
    }

    onAdvertiserIdUpdate() {
        const { general_store } = this.root_store;
        this.setIsLoading(true);

        if (general_store.counterparty_advertiser_id) {
            requestWS({
                p2p_advertiser_info: 1,
                id: general_store.counterparty_advertiser_id,
            }).then(response => {
                if (response?.error) {
                    this.setErrorMessage(response.error);
                } else {
                    this.setAdvertiserInfo(response);
                }
            });
        }
    }

    onSubmit() {
        const current_advertiser_id = this.advertiser_details_id ?? this.counterparty_advertiser_info?.id;
        this.root_store.general_store.blockUnblockUser(!this.is_counterparty_advertiser_blocked, current_advertiser_id);
        this.setIsDropdownMenuVisible(false);
    }

    onUnmount() {
        if (this.advertiser_info_subscription.unsubscribe) {
            this.advertiser_info_subscription.unsubscribe();
        }
    }

    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    setCounterpartyAdvertiserInfo(counterparty_advertiser_info) {
        this.counterparty_advertiser_info = counterparty_advertiser_info;
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

    setIsCounterpartyAdvertiserBlocked(is_counterparty_advertiser_blocked) {
        this.is_counterparty_advertiser_blocked = is_counterparty_advertiser_blocked;
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

    showAdPopup() {
        if (!this.root_store.general_store.is_advertiser) {
            this.root_store.buy_sell_store.showVerification();
        } else {
            this.root_store.general_store.showModal({
                key: 'BuySellModal',
            });
        }
    }

    showBlockUserModal() {
        if (
            !this.is_counterparty_advertiser_blocked &&
            this.counterparty_advertiser_info.id !== this.root_store.general_store.advertiser_id
        ) {
            this.root_store.general_store.showModal({
                key: 'BlockUserModal',
            });
        }
    }
}
