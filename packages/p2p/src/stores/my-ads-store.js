import { observable, action } from 'mobx';
import { getDecimalPlaces } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import BaseStore from 'Stores/base_store';
import { countDecimalPlaces } from 'Utils/string';
import { decimalValidator, lengthValidator, textValidator } from 'Utils/validations';
import { requestWS } from 'Utils/websocket';

export default class MyAdsStore extends BaseStore {
    @observable adverts = [];
    @observable api_error = '';
    @observable api_error_message = '';
    @observable api_table_error_message = '';
    @observable contact_info = '';
    @observable default_advert_description = '';
    @observable error_message = '';
    @observable has_more_items_to_load = false;
    @observable is_form_loading = true;
    @observable is_table_loading = true;
    @observable is_loading = false;
    @observable item_offset = 0;
    @observable payment_info = '';
    @observable selected_ad_id = '';
    @observable should_show_popup = false;
    @observable show_ad_form = false;

    @action.bound
    getAccountStatus() {
        this.setIsLoading(true);

        if (!this.root_store.general_store.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(response => {
                if (!response.error) {
                    const { get_account_status } = response;
                    const { status } = get_account_status.authentication.identity;
                    this.root_store.general_store.setPoiStatus(status);
                } else {
                    this.setErrorMessage(response.error);
                }
                this.setIsLoading(false);
            });
        } else {
            this.setIsLoading(false);
        }
    }

    @action.bound
    getAdvertiserInfo() {
        this.setIsFormLoading(true);

        requestWS({
            p2p_advertiser_info: 1,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;
                this.setContactInfo(p2p_advertiser_info.contact_info);
                this.setDefaultAdvertDescription(p2p_advertiser_info.default_advert_description);
                this.setPaymentInfo(p2p_advertiser_info.payment_info);
            } else {
                this.setContactInfo('');
                this.setDefaultAdvertDescription('');
                this.setPaymentInfo('');
            }
            this.setIsFormLoading(false);
        });
    }

    @action.bound
    handleSubmit = (values, { setSubmitting }) => {
        const is_sell_ad = values.type === buy_sell.SELL;
        this.setApiErrorMessage('');

        const create_advert = {
            p2p_advert_create: 1,
            type: values.type,
            amount: Number(values.offer_amount),
            max_order_amount: Number(values.max_transaction),
            min_order_amount: Number(values.min_transaction),
            payment_method: 'bank_transfer', // TODO: Allow for other types of payment_method.
            rate: Number(values.price_rate),
        };

        if (values.contact_info && is_sell_ad) {
            create_advert.contact_info = values.contact_info;
        }

        if (values.payment_info && is_sell_ad) {
            create_advert.payment_info = values.payment_info;
        }

        if (values.default_advert_description) {
            create_advert.description = values.default_advert_description;
        }

        requestWS(create_advert).then(response => {
            // If we get an error we should let the user submit the form again else we just go back to the list of ads
            if (response.error) {
                this.setApiErrorMessage(response.error.message);
                setSubmitting(false);
            } else {
                this.setShowAdForm(false);
            }
        });
    };

    @action.bound
    onClickCancel = () => {
        this.setSelectedAdId('');
        this.setShouldShowPopup(false);
    };

    @action.bound
    onClickConfirm = showError => {
        requestWS({ p2p_advert_update: 1, id: this.selected_ad_id, delete: 1 }).then(response => {
            if (response.error) {
                showError({ error_message: response.error.message });
            } else {
                // remove the deleted ad from the list of items
                const updated_items = this.adverts.filter(ad => ad.id !== response.p2p_advert_update.id);
                this.setAdverts(updated_items);
                this.setShouldShowPopup(false);
            }
        });
    };

    @action.bound
    onClickCreate() {
        this.setShowAdForm(true);
    }

    @action.bound
    onClickDelete = id => {
        this.setSelectedAdId(id);
        this.setShouldShowPopup(true);
    };

    @action.bound
    loadMoreAds({ startIndex }, is_initial_load = false) {
        if (is_initial_load) {
            this.setIsTableLoading(true);
        }

        const { list_item_limit } = this.root_store.general_store;

        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: startIndex,
                limit: list_item_limit,
            }).then(response => {
                if (!response.error) {
                    const { list } = response.p2p_advertiser_adverts;
                    this.setHasMoreItemsToLoad(list.length >= list_item_limit);
                    this.setAdverts(this.adverts.concat(list));
                } else {
                    this.setApiErrorMessage(response.error.message);
                }

                this.setIsTableLoading(false);
                resolve();
            });
        });
    }

    @action.bound
    restrictLength = (e, handleChange) => {
        // typing more than 15 characters will break the layout
        // max doesn't disable typing, so we will use this to restrict length
        const max_characters = 15;
        if (e.target.value.length > max_characters) {
            e.target.value = e.target.value.slice(0, max_characters);
            return;
        }
        handleChange(e);
    };

    @action.bound
    setAdverts(adverts) {
        this.adverts = adverts;
    }

    @action.bound
    setApiError(api_error) {
        this.api_error = api_error;
    }

    @action.bound
    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    @action.bound
    setApiTableErrorMessage(api_table_error_message) {
        this.api_table_error_message = api_table_error_message;
    }

    @action.bound
    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    @action.bound
    setDefaultAdvertDescription(default_advert_description) {
        this.default_advert_description = default_advert_description;
    }

    @action.bound
    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    @action.bound
    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    @action.bound
    setIsFormLoading(is_form_loading) {
        this.is_form_loading = is_form_loading;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsTableLoading(is_table_loading) {
        this.is_table_loading = is_table_loading;
    }

    @action.bound
    setItemOffset(item_offset) {
        this.item_offset = item_offset;
    }

    @action.bound
    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    @action.bound
    setSelectedAdId(selected_ad_id) {
        this.selected_ad_id = selected_ad_id;
    }

    @action.bound
    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }

    @action.bound
    setShowAdForm(show_ad_form) {
        this.show_ad_form = show_ad_form;
    }

    @action.bound
    validateCreateAdForm(values) {
        // TODO: uncomment this when we have available_price
        // const available_price = ;
        const validations = {
            default_advert_description: [v => !v || lengthValidator(v), v => !v || textValidator(v)],
            max_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(this.root_store.general_store.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(this.root_store.general_store.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.max_transaction ? +v <= values.max_transaction : true),
            ],
            offer_amount: [
                v => !!v,
                // TODO: uncomment this when we have available_price
                // v => v > available_price,
                // TODO: remove v > 0 check when we have available_price
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(this.root_store.general_store.client.currency),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
                v => (values.max_transaction ? +v >= values.max_transaction : true),
            ],
            price_rate: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= this.root_store.general_store.client.local_currency_config.decimal_places,
            ],
        };

        if (values.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            payment_info: localize('Payment instructions'),
            price_rate: localize('Fixed rate'),
        };

        const getCommonMessages = field_name => [localize('{{field_name}} is required', { field_name })];

        const getContactInfoMmessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const getDefaultAdvertDescriptionMessages = field_name => [
            localize('{{field_name}} has exceeded maximum length', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
        ];

        const getOfferAmountMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            // TODO: uncomment this when we have available_price
            // localize('Min is {{value}}', { value: available_price }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not be below Min limit', { field_name }),
            localize('{{field_name}} should not be below Max limit', { field_name }),
        ];

        const getMaxTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not be below Min limit', { field_name }),
        ];

        const getMinTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not exceed Max limit', { field_name }),
        ];

        const getPriceRateMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                    case 'payment_info':
                        errors[key] = getContactInfoMmessages(mapped_key[key])[error_index];
                        break;
                    case 'default_advert_description':
                        errors[key] = getDefaultAdvertDescriptionMessages(mapped_key[key])[error_index];
                        break;
                    case 'offer_amount':
                        errors[key] = getOfferAmountMessages(mapped_key[key])[error_index];
                        break;
                    case 'max_transaction':
                        errors[key] = getMaxTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'min_transaction':
                        errors[key] = getMinTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'price_rate':
                        errors[key] = getPriceRateMessages(mapped_key[key])[error_index];
                        break;
                    default:
                        errors[key] = getCommonMessages(mapped_key[key])[error_index];
                }
            }
        });

        return errors;
    }
}
