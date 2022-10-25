import React from 'react';
import { action, computed, observable, reaction } from 'mobx';
import { formatMoney, getDecimalPlaces, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { requestWS, subscribeWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import { removeTrailingZeros } from 'Utils/format-value';
import BaseStore from 'Stores/base_store';
import { api_error_codes } from '../constants/api-error-codes';

export default class BuySellStore extends BaseStore {
    @observable api_error_message = '';
    @observable contact_info = '';
    @observable error_message = '';
    @observable form_error_code = '';
    @observable has_more_items_to_load = false;
    @observable has_payment_methods = false;
    @observable is_filter_modal_loading = false;
    @observable is_filter_modal_open = false;
    @observable is_loading = true;
    @observable is_sort_dropdown_open = false;
    @observable is_submit_disabled = true;
    @observable items = [];
    @observable local_currencies = [];
    @observable payment_info = '';
    @observable receive_amount = 0;
    @observable search_results = [];
    @observable search_term = '';
    @observable selected_ad_state = {};
    @observable selected_local_currency = null;
    @observable selected_payment_method_value = [];
    @observable selected_payment_method_text = [];
    @observable selected_value = 'rate';
    @observable should_show_currency_selector_modal = false;
    @observable should_show_popup = false;
    @observable should_show_verification = false;
    @observable should_use_client_limits = false;
    @observable show_advertiser_page = false;
    @observable show_filter_payment_methods = false;
    @observable show_rate_change_popup = false;
    @observable sort_by = 'rate';
    @observable submitForm = () => {};
    @observable table_type = buy_sell.BUY;
    @observable form_props = {};

    initial_values = {
        amount: this.advert?.min_order_amount_limit,
        // For sell orders we require extra information.
        ...(this.is_sell_advert ? { contact_info: this.contact_info } : {}),
    };
    filter_payment_methods = [];
    payment_method_ids = [];

    @computed
    get account_currency() {
        return this.advert?.account_currency;
    }

    @computed
    get advert() {
        return this.form_props?.advert;
    }

    @computed
    get has_payment_info() {
        return this.contact_info.length;
    }

    @computed
    get is_buy() {
        return this.table_type === buy_sell.BUY;
    }

    @computed
    get is_buy_advert() {
        return this.advert?.counterparty_type === buy_sell.BUY;
    }

    @computed
    get is_sell_advert() {
        return this.advert?.counterparty_type === buy_sell.SELL;
    }

    @computed
    get modal_title() {
        if (this.is_buy_advert) {
            return localize('Buy {{ account_currency }}', { account_currency: this.account_currency });
        }

        return localize('Sell {{ account_currency }}', { account_currency: this.account_currency });
    }

    @computed
    get rendered_items() {
        const filtered_items = this.items.filter(item =>
            this.table_type === buy_sell.BUY ? item.type === buy_sell.SELL : item.type === buy_sell.BUY
        );

        if (isMobile()) {
            if (this.search_term) {
                if (this.search_results.length) {
                    return [{ id: 'WATCH_THIS_SPACE' }, ...this.search_results];
                }
                return [{ id: 'WATCH_THIS_SPACE' }, { id: 'NO_MATCH_ROW' }];
            }
            // This allows for the sliding animation on the Buy/Sell toggle as it pushes
            // an empty item with an item that holds the same height of the toggle container.
            // Also see: buy-sell-row.jsx
            return [{ id: 'WATCH_THIS_SPACE' }, ...filtered_items];
        }

        if (this.search_term) {
            if (this.search_results.length) {
                return this.search_results;
            }
            return [{ id: 'NO_MATCH_ROW' }];
        }

        return filtered_items;
    }

    @computed
    get should_filter_by_payment_method() {
        const { my_profile_store } = this.root_store;
        return my_profile_store.payment_methods_list_values !== this.selected_payment_method_value;
    }

    // eslint-disable-next-line class-methods-use-this
    get sort_list() {
        return [
            { text: localize('Exchange rate (Default)'), value: 'rate' },
            { text: localize('User rating'), value: 'rating' },
        ];
    }

    @action.bound
    fetchAdvertiserAdverts() {
        this.setItems([]);
        this.setIsLoading(true);
        this.loadMoreItems({ startIndex: 0 });
        if (!this.is_buy) {
            this.root_store.my_profile_store.getAdvertiserPaymentMethods();
        }
    }

    @action.bound
    getAdvertiserInfo() {
        requestWS({
            p2p_advertiser_info: 1,
        }).then(response => {
            // Added a check to prevent console errors
            if (response) {
                if (!response.error) {
                    const { p2p_advertiser_info } = response;
                    this.setContactInfo(p2p_advertiser_info.contact_info);
                    this.setPaymentInfo(p2p_advertiser_info.payment_info);
                } else {
                    this.setContactInfo('');
                    this.setPaymentInfo('');
                }
            }
        });
    }

    getSupportedPaymentMethods(payment_method_names) {
        const { my_profile_store } = this.root_store;

        //Get all payment methods supported in the country
        const payment_methods = payment_method_names?.filter(
            payment_method_name =>
                Object.entries(my_profile_store.available_payment_methods).findIndex(
                    payment_method => payment_method[1].display_name === payment_method_name
                ) !== -1
        );

        return payment_methods;
    }

    @action.bound
    getWebsiteStatus() {
        requestWS({ website_status: 1 }).then(response => {
            if (response) {
                const { error, website_status } = response;

                if (error) this.setErrorMessage(error.message);
                else this.setLocalCurrencies(website_status.p2p_config?.local_currencies);
            }
        });
    }

    @action.bound
    handleChange(e) {
        this.setIsLoading(true);
        this.setSelectedValue(e.target.value);
        this.setItems([]);
        this.setSortBy(e.target.value);
        this.loadMoreItems({ startIndex: 0 });
        this.setIsSortDropdownOpen(false);
    }

    @action.bound
    handleSubmit = async (isMountedFn, values, { setSubmitting }) => {
        if (isMountedFn()) {
            setSubmitting(true);
        }

        this.form_props.setErrorMessage(null);

        const payload = {
            p2p_order_create: 1,
            advert_id: this.advert.id,
            amount: values.amount,
            payment_method_ids: this.payment_method_ids,
            ...(values.payment_info && this.is_sell_advert ? { payment_info: values.payment_info } : {}),
            // Validate extra information for sell adverts.
            ...(this.is_sell_advert
                ? {
                      contact_info: values.contact_info,
                  }
                : {}),
        };
        if (values.rate !== null) {
            payload.rate = values.rate;
        }

        const order = await requestWS({ ...payload });

        if (order.error) {
            this.form_props.setErrorMessage(order.error.message);
            this.setFormErrorCode(order.error.code);
        } else {
            this.form_props.setErrorMessage(null);
            this.setShowRateChangePopup(false);
            this.root_store.floating_rate_store.setIsMarketRateChanged(false);
            const response = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            this.form_props.handleConfirm(response.p2p_order_info);
            this.form_props.handleClose();
            this.payment_method_ids = [];
        }

        if (isMountedFn()) {
            setSubmitting(false);
        }
    };

    @action.bound
    hideAdvertiserPage() {
        this.setShowAdvertiserPage(false);
    }

    @action.bound
    hideVerification() {
        this.setShouldShowVerification(false);
    }

    @action.bound
    loadMoreItems({ startIndex }) {
        const { general_store } = this.root_store;
        const counterparty_type = this.is_buy ? buy_sell.BUY : buy_sell.SELL;
        this.setApiErrorMessage('');
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type,
                offset: startIndex,
                limit: general_store.list_item_limit,
                sort_by: this.sort_by,
                use_client_limits: this.should_use_client_limits ? 1 : 0,
                ...(this.selected_payment_method_value.length > 0
                    ? { payment_method: this.selected_payment_method_value }
                    : {}),
                ...(this.selected_local_currency ? { local_currency: this.selected_local_currency } : {}),
            }).then(response => {
                if (response) {
                    if (!response.error) {
                        // Ignore any responses that don't match our request. This can happen
                        // due to quickly switching between Buy/Sell tabs.
                        if (response.echo_req.counterparty_type === counterparty_type) {
                            const { list } = response.p2p_advert_list;

                            this.setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);

                            const old_items = [...this.items];
                            const new_items = [];

                            list.forEach(new_item => {
                                const old_item_idx = old_items.findIndex(old_item => old_item.id === new_item.id);

                                new_item.payment_method_names = this.getSupportedPaymentMethods(
                                    new_item.payment_method_names
                                );

                                if (old_item_idx > -1) {
                                    old_items[old_item_idx] = new_item;
                                } else {
                                    new_items.push(new_item);
                                }
                            });

                            this.setItems([...old_items, ...new_items]);

                            const search_results = [];

                            if (this.search_term) {
                                this.items.forEach(item => {
                                    if (
                                        item.advertiser_details.name
                                            .toLowerCase()
                                            .includes(this.search_term.toLowerCase().trim())
                                    ) {
                                        search_results.push(item);
                                    }
                                });
                            }

                            if (search_results.length) {
                                this.setSearchResults(search_results);
                            } else {
                                this.setSearchResults([]);
                            }
                        }
                        // Added a check to prevent console errors
                    } else if (response && response.error.code === api_error_codes.PERMISSION_DENIED) {
                        this.root_store.general_store.setIsBlocked(true);
                    } else {
                        this.setApiErrorMessage(response?.error.message);
                    }
                }
                this.setIsLoading(false);
                resolve();
            });
        });
    }

    @action.bound
    onCancelClick() {
        this.setShouldShowPopup(false);
    }

    @action.bound
    onChangeTableType(event) {
        this.setTableType(event.target.value);
    }

    @action.bound
    onClickApply(payment_method_value, payment_method_text) {
        this.setSelectedPaymentMethodValue(payment_method_value);
        this.setSelectedPaymentMethodText(payment_method_text);
        this.setItems([]);
        this.setIsLoading(true);
        this.loadMoreItems({ startIndex: 0 });
        this.setIsFilterModalOpen(false);
    }

    @action.bound
    onClickReset() {
        this.setShouldUseClientLimits(false);
    }

    @action.bound
    onConfirmClick(order_info) {
        const { general_store, order_store } = this.root_store;

        order_store.props.setOrderId(order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
    }

    @action.bound
    onLocalCurrencySelect(local_currency) {
        const { floating_rate_store, general_store } = this.root_store;
        const { ws_subscriptions } = general_store;

        ws_subscriptions?.exchange_rate_subscription?.unsubscribe?.();
        ws_subscriptions.exchange_rate_subscription = subscribeWS(
            {
                exchange_rates: 1,
                base_currency: general_store.client.currency,
                subscribe: 1,
                target_currency: local_currency,
            },
            [floating_rate_store.fetchExchangeRate]
        );

        this.setSelectedLocalCurrency(local_currency);
        this.setItems([]);
        this.setIsLoading(true);
        this.loadMoreItems({ startIndex: 0 });
    }

    registerIsListedReaction() {
        const { general_store } = this.root_store;
        const disposeIsListedReaction = reaction(
            () => general_store.is_listed,
            () => {
                this.setItems([]);
                this.loadMoreItems({ startIndex: 0 });
            }
        );

        return () => {
            disposeIsListedReaction();
        };
    }

    @action.bound
    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    @action.bound
    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    @action.bound
    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    @action.bound
    setFormErrorCode(form_error_code) {
        this.form_error_code = form_error_code;
    }

    @action.bound
    setFormProps(props) {
        this.form_props = props;
    }

    @action.bound
    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    @action.bound
    setHasPaymentMethods(has_payment_methods) {
        this.has_payment_methods = has_payment_methods;
    }

    @action.bound
    setIsFilterModalLoading(is_filter_modal_loading) {
        this.is_filter_modal_loading = is_filter_modal_loading;
    }

    @action.bound
    setIsFilterModalOpen(is_filter_modal_open) {
        this.is_filter_modal_open = is_filter_modal_open;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsSortDropdownOpen(is_sort_dropdown_open) {
        this.is_sort_dropdown_open = is_sort_dropdown_open;
    }

    @action.bound
    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    @action.bound
    setItems(items) {
        this.items = items;
    }

    @action.bound
    setLocalCurrencies(local_currencies) {
        const currency_list = [];

        local_currencies.forEach(currency => {
            const { display_name, has_adverts, is_default, symbol } = currency;

            if (is_default && !this.selected_local_currency) this.setSelectedLocalCurrency(symbol);

            currency_list.push({
                component: (
                    <div className='currency-dropdown__list-item'>
                        <div>{symbol}</div>
                        <div>{display_name}</div>
                    </div>
                ),
                has_adverts,
                is_default,
                text: symbol,
                value: symbol,
            });
        });

        this.local_currencies = currency_list;
    }

    @action.bound
    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    @action.bound
    setInitialReceiveAmount(initial_price) {
        this.receive_amount = removeTrailingZeros(this.advert.min_order_amount_limit * initial_price);
    }

    @action.bound
    setReceiveAmount(receive_amount) {
        this.receive_amount = receive_amount;
    }

    @action.bound
    setSearchResults(search_results) {
        this.search_results = search_results;
    }

    @action.bound
    setSearchTerm(search_term) {
        this.search_term = search_term;
    }

    @action.bound
    setSelectedAdState(selected_ad_state) {
        this.selected_ad_state = selected_ad_state;
    }

    @action.bound
    setSelectedLocalCurrency(selected_local_currency) {
        this.selected_local_currency = selected_local_currency;
    }

    @action.bound
    setSelectedPaymentMethodValue(payment_method_value) {
        this.selected_payment_method_value = [...payment_method_value];
    }

    @action.bound
    setSelectedPaymentMethodText(payment_method_text) {
        this.selected_payment_method_text = [...payment_method_text];
    }

    @action.bound
    setSelectedValue(selected_value) {
        this.selected_value = selected_value;
    }

    @action.bound
    setShouldShowCurrencySelectorModal(should_show_currency_selector_modal) {
        this.should_show_currency_selector_modal = should_show_currency_selector_modal;
    }

    @action.bound
    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
        if (!this.should_show_popup) {
            this.fetchAdvertiserAdverts();
        }
    }

    @action.bound
    setShouldShowVerification(should_show_verification) {
        this.should_show_verification = should_show_verification;
    }

    @action.bound
    setShouldUseClientLimits(should_use_client_limits) {
        this.should_use_client_limits = should_use_client_limits;
    }

    @action.bound
    setShowAdvertiserPage(show_advertiser_page) {
        this.show_advertiser_page = show_advertiser_page;
    }

    @action.bound
    setShowFilterPaymentMethods(show_filter_payment_methods) {
        this.show_filter_payment_methods = show_filter_payment_methods;
    }

    @action.bound
    setSortBy(sort_by) {
        this.sort_by = sort_by;
    }

    @action.bound
    setTableType(table_type) {
        this.table_type = table_type;
    }

    @action.bound
    setSelectedAdvert(selected_advert) {
        if (!this.root_store.general_store.is_advertiser) {
            this.setShouldShowVerification(true);
        } else if (this.is_sell_advert) {
            this.getAdvertiserInfo();
            this.setSelectedAdState(selected_advert);
            this.setShouldShowPopup(true);
        } else {
            this.setSelectedAdState(selected_advert);
            this.setShouldShowPopup(true);
        }
    }

    @action.bound
    setSubmitFormFn(submitFormFn) {
        this.submitForm = submitFormFn;
    }

    @action.bound
    showAdvertiserPage(selected_advert) {
        this.setSelectedAdState(selected_advert);
        this.setShowAdvertiserPage(true);
    }

    @action.bound
    setShowRateChangePopup(show_rate_change_popup) {
        this.show_rate_change_popup = show_rate_change_popup;
    }

    @action.bound
    showVerification() {
        this.setShouldShowVerification(true);
    }

    @action.bound
    validatePopup(values) {
        const validations = {
            amount: [
                v => !!v,
                v => v >= this.advert.min_order_amount_limit,
                v => v <= this.advert.max_order_amount_limit,
                v => (this.root_store.buy_sell_store.is_buy_advert ? true : v <= this.root_store.general_store.balance),
                v => countDecimalPlaces(v) <= getDecimalPlaces(this.account_currency),
            ],
        };

        if (this.is_sell_advert) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            if (!this.has_payment_methods) {
                validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            }
        }

        const display_min_amount = formatMoney(this.account_currency, this.advert.min_order_amount_limit, true);
        const display_max_amount = formatMoney(this.account_currency, this.advert.max_order_amount_limit, true);

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: display_min_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: display_max_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: formatMoney(this.account_currency, this.root_store.general_store.balance, true),
            }),
            localize('Enter a valid amount'),
        ];

        const getInfoMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const mapped_key = {
            contact_info: localize('Contact details'),
            payment_info: localize('Bank details'),
        };

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    case 'payment_info':
                    case 'contact_info': {
                        errors[key] = getInfoMessages(mapped_key[key])[error_index];
                        break;
                    }
                    default: {
                        errors[key] = common_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    }

    registerAdvertIntervalReaction() {
        const disposeAdvertIntervalReaction = reaction(
            () => this.selected_ad_state,
            () => {
                clearInterval(this.limits_interval);

                if (this.selected_ad_state) {
                    const updateAdvert = () => {
                        requestWS({ p2p_advert_info: 1, id: this.selected_ad_state.id, use_client_limits: 1 }).then(
                            response => {
                                // Added a check to prevent console errors
                                if (response?.error) return;
                                const { p2p_advert_info } = response;

                                p2p_advert_info.payment_method_names = this.getSupportedPaymentMethods(
                                    p2p_advert_info.payment_method_names
                                );

                                if (this.selected_ad_state?.id === p2p_advert_info.id) {
                                    this.setSelectedAdState(p2p_advert_info);
                                }
                            }
                        );
                    };

                    this.limits_interval = setInterval(updateAdvert, 10000);
                }
            }
        );

        return () => disposeAdvertIntervalReaction();
    }
}
