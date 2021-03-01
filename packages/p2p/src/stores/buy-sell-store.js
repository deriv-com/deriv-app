import { action, computed, observable, reaction } from 'mobx';
import { formatMoney, getDecimalPlaces, getRoundedNumber, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { requestWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import BaseStore from 'Stores/base_store';

export default class BuySellStore extends BaseStore {
    @observable api_error_message = '';
    @observable contact_info = '';
    @observable error_message = '';
    @observable has_more_items_to_load = false;
    @observable is_loading = true;
    @observable is_submit_disabled = true;
    @observable items = [];
    @observable payment_info = '';
    @observable receive_amount = 0;
    @observable selected_ad_state = {};
    @observable should_show_popup = false;
    @observable should_show_verification = false;
    @observable show_advertiser_page = false;
    @observable submitForm = () => {};
    @observable table_type = buy_sell.BUY;
    @observable form_props = {};

    initial_values = {
        amount: this.advert?.min_order_amount_limit,
        // For sell orders we require extra information.
        ...(this.is_sell_advert ? { contact_info: this.contact_info, payment_info: this.payment_info } : {}),
    };

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
        return this.contact_info.length && this.payment_info.length;
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
        if (isMobile() && this.items.length > 0) {
            // This allows for the sliding animation on the Buy/Sell toggle as it pushes
            // an empty item with an item that holds the same height of the toggle container.
            // Also see: buy-sell-row.jsx
            return [{ id: 'WATCH_THIS_SPACE' }, ...this.items];
        }

        return this.items;
    }

    @action.bound
    getAdvertiserInfo() {
        requestWS({
            p2p_advertiser_info: 1,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;
                this.setContactInfo(p2p_advertiser_info.contact_info);
                this.setPaymentInfo(p2p_advertiser_info.payment_info);
            } else {
                this.setContactInfo('');
                this.setPaymentInfo('');
            }
        });
    }

    @action.bound
    handleSubmit = async (isMountedFn, values, { setSubmitting }) => {
        if (isMountedFn()) {
            setSubmitting(true);
        }

        this.form_props.setErrorMessage(null);

        const order = await requestWS({
            p2p_order_create: 1,
            advert_id: this.advert.id,
            amount: values.amount,
            // Validate extra information for sell adverts.
            ...(this.is_sell_advert
                ? {
                      contact_info: values.contact_info,
                      payment_info: values.payment_info,
                  }
                : {}),
        });

        if (order.error) {
            this.form_props.setErrorMessage(order.error.message);
        } else {
            const response = await requestWS({ p2p_order_info: 1, id: order.p2p_order_create.id });
            this.form_props.handleConfirm(response.p2p_order_info);
            this.form_props.handleClose();
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
        this.setIsLoading(true);

        const { general_store } = this.root_store;
        const counterparty_type = this.is_buy ? buy_sell.BUY : buy_sell.SELL;

        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type,
                offset: startIndex,
                limit: general_store.list_item_limit,
                use_client_limits: 1,
            }).then(response => {
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

                            if (old_item_idx > -1) {
                                old_items[old_item_idx] = new_item;
                            } else {
                                new_items.push(new_item);
                            }
                        });

                        this.setItems([...old_items, ...new_items]);
                    }
                } else {
                    this.setApiErrorMessage(response.error.message);
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
    onConfirmClick(order_info) {
        const { general_store, order_store } = this.root_store;

        order_store.props.setOrderId(order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
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
    setFormProps(props) {
        this.form_props = props;
    }

    @action.bound
    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
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
    setItems(items) {
        this.items = items;
    }

    @action.bound
    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    @action.bound
    setInitialReceiveAmount() {
        this.receive_amount = getRoundedNumber(
            this.advert.min_order_amount_limit * this.advert.price,
            this.advert.local_currency
        );
    }

    @action.bound
    setReceiveAmount(receive_amount) {
        this.receive_amount = receive_amount;
    }

    @action.bound
    setSelectedAdState(selected_ad_state) {
        this.selected_ad_state = selected_ad_state;
    }

    @action.bound
    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }

    @action.bound
    setShouldShowVerification(should_show_verification) {
        this.should_show_verification = should_show_verification;
    }

    @action.bound
    setShowAdvertiserPage(show_advertiser_page) {
        this.show_advertiser_page = show_advertiser_page;
    }

    @action.bound
    setTableType(table_type) {
        this.table_type = table_type;
    }

    @action.bound
    setSelectedAdvert(selected_advert) {
        if (!this.root_store.general_store.is_advertiser) {
            this.setShouldShowVerification(true);
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
                v => countDecimalPlaces(v) <= getDecimalPlaces(this.account_currency),
            ],
        };

        if (this.is_sell_advert) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
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
                    case 'contact_info':
                    case 'payment_info': {
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
                                if (response.error) return;
                                const { p2p_advert_info } = response;

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
