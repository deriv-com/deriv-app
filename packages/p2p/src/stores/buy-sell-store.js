import React from 'react';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { formatMoney, getDecimalPlaces, isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import { removeTrailingZeros } from 'Utils/format-value';
import BaseStore from 'Stores/base_store';
import { api_error_codes } from '../constants/api-error-codes';

export default class BuySellStore extends BaseStore {
    api_error_message = '';
    contact_info = '';
    error_message = '';
    form_error_code = '';
    has_more_items_to_load = false;
    has_payment_methods = false;
    is_filter_modal_loading = false;
    is_filter_modal_open = false;
    is_loading = true;
    is_sort_dropdown_open = false;
    is_submit_disabled = true;
    items = [];
    local_currencies = [];
    local_currency = null;
    payment_info = '';
    receive_amount = 0;
    search_results = [];
    search_term = '';
    selected_ad_state = {};
    selected_local_currency = null;
    selected_payment_method_value = [];
    selected_payment_method_text = [];
    selected_value = 'rate';
    should_show_currency_selector_modal = false;
    should_show_popup = false;
    should_show_verification = false;
    should_use_client_limits = false;
    show_advertiser_page = false;
    show_filter_payment_methods = false;
    show_rate_change_popup = false;
    sort_by = 'rate';
    submitForm = () => {};
    table_type = buy_sell.BUY;
    form_props = {};

    initial_values = {
        amount: this.advert?.min_order_amount_limit,
        // For sell orders we require extra information.
        ...(this.is_sell_advert ? { contact_info: this.contact_info } : {}),
    };
    filter_payment_methods = [];
    payment_method_ids = [];

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            api_error_message: observable,
            contact_info: observable,
            error_message: observable,
            form_error_code: observable,
            has_more_items_to_load: observable,
            has_payment_methods: observable,
            is_filter_modal_loading: observable,
            is_filter_modal_open: observable,
            is_loading: observable,
            is_sort_dropdown_open: observable,
            is_submit_disabled: observable,
            items: observable,
            payment_info: observable,
            receive_amount: observable,
            search_results: observable,
            search_term: observable,
            selected_ad_state: observable,
            selected_payment_method_value: observable,
            selected_payment_method_text: observable,
            selected_value: observable,
            should_show_currency_selector_modal: observable,
            should_show_popup: observable,
            should_show_verification: observable,
            should_use_client_limits: observable,
            show_advertiser_page: observable,
            show_filter_payment_methods: observable,
            show_rate_change_popup: observable,
            sort_by: observable,
            submitForm: observable,
            table_type: observable,
            form_props: observable,
            account_currency: computed,
            advert: computed,
            has_payment_info: computed,
            is_buy: computed,
            is_buy_advert: computed,
            is_sell_advert: computed,
            modal_title: computed,
            rendered_items: computed,
            should_filter_by_payment_method: computed,
            getAdvertiserInfo: action.bound,
            getSupportedPaymentMethods: action.bound,
            getWebsiteStatus: action.bound,
            handleChange: action.bound,
            handleSubmit: action.bound,
            hideAdvertiserPage: action.bound,
            hideVerification: action.bound,
            loadMoreItems: action.bound,
            onCancelClick: action.bound,
            onChangeTableType: action.bound,
            onClickApply: action.bound,
            onClickReset: action.bound,
            onConfirmClick: action.bound,
            onLocalCurrencySelect: action.bound,
            setApiErrorMessage: action.bound,
            setContactInfo: action.bound,
            setErrorMessage: action.bound,
            setFormErrorCode: action.bound,
            setFormProps: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setHasPaymentMethods: action.bound,
            setIsFilterModalLoading: action.bound,
            setIsFilterModalOpen: action.bound,
            setIsLoading: action.bound,
            setIsSortDropdownOpen: action.bound,
            setIsSubmitDisabled: action.bound,
            setItems: action.bound,
            setLocalCurrency: action.bound,
            setLocalCurrencies: action.bound,
            setPaymentInfo: action.bound,
            setInitialReceiveAmount: action.bound,
            setReceiveAmount: action.bound,
            setSearchResults: action.bound,
            setSearchTerm: action.bound,
            setSelectedAdState: action.bound,
            setSelectedLocalCurrency: action.bound,
            setSelectedPaymentMethodValue: action.bound,
            setSelectedPaymentMethodText: action.bound,
            setSelectedValue: action.bound,
            setShouldShowCurrencySelectorModal: action.bound,
            setShouldShowPopup: action.bound,
            setShouldShowVerification: action.bound,
            setShouldUseClientLimits: action.bound,
            setShowAdvertiserPage: action.bound,
            setShowFilterPaymentMethods: action.bound,
            setSortBy: action.bound,
            setTableType: action.bound,
            setSelectedAdvert: action.bound,
            setSubmitFormFn: action.bound,
            showAdvertiserPage: action.bound,
            showVerification: action.bound,
            validatePopup: action.bound,
            sort_list: computed,
            fetchAdvertiserAdverts: action.bound,
            setShowRateChangePopup: action.bound,
        });
    }

    get account_currency() {
        return this.advert?.account_currency;
    }

    get advert() {
        return this.form_props?.advert;
    }

    get has_payment_info() {
        return this.contact_info.length;
    }

    get is_buy() {
        return this.table_type === buy_sell.BUY;
    }

    get is_buy_advert() {
        return this.advert?.counterparty_type === buy_sell.BUY;
    }

    get is_sell_advert() {
        return this.advert?.counterparty_type === buy_sell.SELL;
    }

    get modal_title() {
        if (this.is_buy_advert) {
            return localize('Buy {{ account_currency }}', { account_currency: this.account_currency });
        }

        return localize('Sell {{ account_currency }}', { account_currency: this.account_currency });
    }

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

    fetchAdvertiserAdverts() {
        this.setItems([]);
        this.setIsLoading(true);
        this.loadMoreItems({ startIndex: 0 });
        if (!this.is_buy) {
            this.root_store.my_profile_store.getAdvertiserPaymentMethods();
        }
    }

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

    getWebsiteStatus() {
        requestWS({ website_status: 1 }).then(response => {
            if (response) {
                const { error, website_status } = response;

                if (error) this.setErrorMessage(error.message);
                else this.setLocalCurrencies(website_status.p2p_config?.local_currencies);
            }
        });
    }

    handleChange(e) {
        this.setIsLoading(true);
        this.setSelectedValue(e.target.value);
        this.setItems([]);
        this.setSortBy(e.target.value);
        this.loadMoreItems({ startIndex: 0 });
        this.setIsSortDropdownOpen(false);
    }

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

    hideAdvertiserPage() {
        this.setShowAdvertiserPage(false);
    }

    hideVerification() {
        this.setShouldShowVerification(false);
    }

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

    onCancelClick() {
        this.setShouldShowPopup(false);
    }

    onChangeTableType(event) {
        this.setTableType(event.target.value);
    }

    onClickApply(payment_method_value, payment_method_text) {
        this.setSelectedPaymentMethodValue(payment_method_value);
        this.setSelectedPaymentMethodText(payment_method_text);
        this.setItems([]);
        this.setIsLoading(true);
        this.loadMoreItems({ startIndex: 0 });
        this.setIsFilterModalOpen(false);
    }

    onClickReset() {
        this.setShouldUseClientLimits(false);
    }

    onConfirmClick(order_info) {
        const { general_store, order_store } = this.root_store;

        order_store.props.setOrderId(order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
    }

    onLocalCurrencySelect(local_currency) {
        this.setSelectedLocalCurrency(local_currency);
        this.setLocalCurrency(local_currency);
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

    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setFormErrorCode(form_error_code) {
        this.form_error_code = form_error_code;
    }

    setFormProps(props) {
        this.form_props = props;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setHasPaymentMethods(has_payment_methods) {
        this.has_payment_methods = has_payment_methods;
    }

    setIsFilterModalLoading(is_filter_modal_loading) {
        this.is_filter_modal_loading = is_filter_modal_loading;
    }

    setIsFilterModalOpen(is_filter_modal_open) {
        this.is_filter_modal_open = is_filter_modal_open;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsSortDropdownOpen(is_sort_dropdown_open) {
        this.is_sort_dropdown_open = is_sort_dropdown_open;
    }

    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    setItems(items) {
        this.items = items;
    }

    setLocalCurrency(local_currency) {
        this.local_currency = local_currency;
    }

    setLocalCurrencies(local_currencies) {
        const currency_list = [];

        local_currencies.forEach(currency => {
            const { display_name, has_adverts, is_default, symbol } = currency;

            if (is_default && !this.selected_local_currency) {
                this.setSelectedLocalCurrency(symbol);
                this.setLocalCurrency(symbol);
            }

            currency_list.push({
                component: (
                    <div className='currency-dropdown__list-item'>
                        <div>{symbol}</div>
                        <Text as='div' align='right' size='xs' line_height='xxs'>
                            {display_name}
                        </Text>
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

    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    setInitialReceiveAmount(initial_price) {
        this.receive_amount = removeTrailingZeros(this.advert.min_order_amount_limit * initial_price);
    }

    setReceiveAmount(receive_amount) {
        this.receive_amount = receive_amount;
    }

    setSearchResults(search_results) {
        this.search_results = search_results;
    }

    setSearchTerm(search_term) {
        this.search_term = search_term;
    }

    setSelectedAdState(selected_ad_state) {
        this.selected_ad_state = selected_ad_state;
    }

    setSelectedLocalCurrency(selected_local_currency) {
        this.selected_local_currency = selected_local_currency;
    }

    setSelectedPaymentMethodValue(payment_method_value) {
        this.selected_payment_method_value = [...payment_method_value];
    }

    setSelectedPaymentMethodText(payment_method_text) {
        this.selected_payment_method_text = [...payment_method_text];
    }

    setSelectedValue(selected_value) {
        this.selected_value = selected_value;
    }

    setShouldShowCurrencySelectorModal(should_show_currency_selector_modal) {
        this.should_show_currency_selector_modal = should_show_currency_selector_modal;
    }

    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
        if (!this.should_show_popup) {
            this.fetchAdvertiserAdverts();
        }
    }

    setShouldShowVerification(should_show_verification) {
        this.should_show_verification = should_show_verification;
    }

    setShouldUseClientLimits(should_use_client_limits) {
        this.should_use_client_limits = should_use_client_limits;
    }

    setShowAdvertiserPage(show_advertiser_page) {
        this.show_advertiser_page = show_advertiser_page;
    }

    setShowFilterPaymentMethods(show_filter_payment_methods) {
        this.show_filter_payment_methods = show_filter_payment_methods;
    }

    setSortBy(sort_by) {
        this.sort_by = sort_by;
    }

    setTableType(table_type) {
        this.table_type = table_type;
    }

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

    setSubmitFormFn(submitFormFn) {
        this.submitForm = submitFormFn;
    }

    showAdvertiserPage(selected_advert) {
        this.setSelectedAdState(selected_advert);
        this.setShowAdvertiserPage(true);
    }

    setShowRateChangePopup(show_rate_change_popup) {
        this.show_rate_change_popup = show_rate_change_popup;
    }

    showVerification() {
        this.setShouldShowVerification(true);
    }

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
