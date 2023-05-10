import { action, observable, makeObservable, computed } from 'mobx';
import { getDecimalPlaces, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import { countDecimalPlaces } from 'Utils/string';
import { decimalValidator, lengthValidator, rangeValidator, textValidator } from 'Utils/validations';
import { requestWS } from 'Utils/websocket';
import { generateErrorDialogTitle } from 'Utils/adverts';
import { api_error_codes } from '../constants/api-error-codes';

export default class MyAdsStore extends BaseStore {
    activate_deactivate_error_message = '';
    advert_details = null;
    adverts = [];
    adverts_archive_period = null;
    api_error = '';
    api_error_message = '';
    api_table_error_message = '';
    available_balance = null;
    current_method = { key: null, is_deleted: false };
    delete_error_message = '';
    edit_ad_form_error = '';
    error_message = '';
    has_more_items_to_load = false;
    is_ad_created_modal_visible = false;
    is_api_error_modal_visible = false;
    is_edit_ad_error_modal_visible = false;
    is_form_loading = false;
    is_table_loading = false;
    is_loading = false;
    item_offset = 0;
    p2p_advert_information = {};
    show_ad_form = false;
    selected_ad_id = '';
    selected_advert = null;
    should_show_add_payment_method = false;
    show_edit_ad_form = false;
    update_payment_methods_error_message = '';
    required_ad_type;
    error_code = '';

    payment_method_ids = [];
    payment_method_names = [];

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            activate_deactivate_error_message: observable,
            advert_details: observable,
            adverts: observable,
            adverts_archive_period: observable,
            api_error: observable,
            api_error_message: observable,
            api_table_error_message: observable,
            available_balance: observable,
            current_method: observable,
            delete_error_message: observable,
            edit_ad_form_error: observable,
            error_message: observable,
            has_more_items_to_load: observable,
            is_ad_created_modal_visible: observable,
            is_api_error_modal_visible: observable,
            is_edit_ad_error_modal_visible: observable,
            is_form_loading: observable,
            is_table_loading: observable,
            is_loading: observable,
            item_offset: observable,
            p2p_advert_information: observable,
            selected_ad_id: observable,
            selected_advert: observable,
            should_show_add_payment_method: observable,
            show_ad_form: observable,
            show_edit_ad_form: observable,
            update_payment_methods_error_message: observable,
            required_ad_type: observable,
            error_code: observable,
            selected_ad_type: computed,
            getAccountStatus: action.bound,
            getAdvertInfo: action.bound,
            getWebsiteStatus: action.bound,
            handleSubmit: action.bound,
            hideQuickAddModal: action.bound,
            onClickActivateDeactivate: action.bound,
            onClickCancel: action.bound,
            onClickConfirm: action.bound,
            onClickCreate: action.bound,
            onClickDelete: action.bound,
            onClickEdit: action.bound,
            onClickSaveEditAd: action.bound,
            onClickUpdatePaymentMethods: action.bound,
            loadMoreAds: action.bound,
            restrictLength: action.bound,
            restrictDecimalPlace: action.bound,
            showQuickAddModal: action.bound,
            setActivateDeactivateErrorMessage: action.bound,
            setAdvertDetails: action.bound,
            setAdverts: action.bound,
            setAdvertsArchivePeriod: action.bound,
            setApiError: action.bound,
            setApiErrorMessage: action.bound,
            setApiTableErrorMessage: action.bound,
            setAvailableBalance: action.bound,
            setApiErrorCode: action.bound,
            setCurrentMethod: action.bound,
            setDeleteErrorMessage: action.bound,
            setEditAdFormError: action.bound,
            setErrorMessage: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setIsAdCreatedModalVisible: action.bound,
            setIsApiErrorModalVisible: action.bound,
            setIsEditAdErrorModalVisible: action.bound,
            setIsFormLoading: action.bound,
            setIsLoading: action.bound,
            setIsTableLoading: action.bound,
            setItemOffset: action.bound,
            setP2pAdvertInformation: action.bound,
            setSelectedAdId: action.bound,
            setSelectedAdvert: action.bound,
            setShouldShowAddPaymentMethod: action.bound,
            setShowAdForm: action.bound,
            setShowEditAdForm: action.bound,
            onToggleSwitchModal: action.bound,
            setRequiredAdType: action.bound,
            setUpdatePaymentMethodsErrorMessage: action.bound,
            validateCreateAdForm: action.bound,
            validateEditAdForm: action.bound,
        });
    }

    get selected_ad_type() {
        return this.p2p_advert_information.rate_type;
    }

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

    getAdvertInfo() {
        this.setIsFormLoading(true);
        requestWS({
            p2p_advert_info: 1,
            id: this.selected_ad_id,
        })
            .then(response => {
                if (response) {
                    if (!response.error) {
                        const { p2p_advert_info } = response;
                        if (!p2p_advert_info.payment_method_names)
                            p2p_advert_info.payment_method_names = this.payment_method_names;
                        if (!p2p_advert_info.payment_method_details)
                            p2p_advert_info.payment_method_details = this.payment_method_details;
                        this.setP2pAdvertInformation(p2p_advert_info);
                    } else {
                        this.setApiErrorMessage(response.error.message);
                    }
                }
            })
            .finally(() => this.setIsFormLoading(false));
    }

    getWebsiteStatus(createAd = () => {}, setSubmitting) {
        requestWS({ website_status: 1 }).then(response => {
            if (response.error) {
                this.setApiErrorMessage(response.error.message);
                setSubmitting(false);
            } else {
                const { p2p_config } = response.website_status;
                this.setAdvertsArchivePeriod(p2p_config.adverts_archive_period);
                createAd();
            }
        });
    }

    handleSubmit(values, { setSubmitting }) {
        this.setApiErrorMessage('');

        const is_sell_ad = values.type === buy_sell.SELL;
        const should_not_show_auto_archive_message = localStorage.getItem('should_not_show_auto_archive_message');

        const create_advert = {
            p2p_advert_create: 1,
            type: values.type,
            amount: Number(values.offer_amount),
            max_order_amount: Number(values.max_transaction),
            min_order_amount: Number(values.min_transaction),
            rate_type: this.root_store.floating_rate_store.rate_type,
            rate: Number(values.rate_type),
            ...(this.payment_method_names.length > 0 && !is_sell_ad
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && is_sell_ad
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        };

        if (values.contact_info && is_sell_ad) {
            create_advert.contact_info = values.contact_info;
        }

        if (values.default_advert_description) {
            create_advert.description = values.default_advert_description;
        }

        const createAd = () => {
            requestWS(create_advert).then(response => {
                // If we get an error we should let the user submit the form again else we just go back to the list of ads
                if (response) {
                    if (response.error) {
                        this.setApiErrorCode(response.error.code);
                        this.setApiErrorMessage(response.error.message);
                        setSubmitting(false);
                    } else if (should_not_show_auto_archive_message !== 'true' && this.adverts_archive_period) {
                        this.setAdvertDetails(response.p2p_advert_create);
                        this.setIsAdCreatedModalVisible(true);
                    } else if (!this.is_ad_created_modal_visible) {
                        if (!response.p2p_advert_create.is_visible) {
                            this.setAdvertDetails(response.p2p_advert_create);
                        }
                        if (this.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_BALANCE)) {
                            this.root_store.general_store.showModal({
                                key: 'AdVisibilityErrorModal',
                                props: { error_code: api_error_codes.AD_EXCEEDS_BALANCE },
                            });
                        } else if (
                            this.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_DAILY_LIMIT)
                        ) {
                            this.root_store.general_store.showModal({
                                key: 'AdVisibilityErrorModal',
                                props: { error_code: api_error_codes.AD_EXCEEDS_DAILY_LIMIT },
                            });
                        }
                        this.setShowAdForm(false);
                    }
                }
            });
        };

        if (should_not_show_auto_archive_message !== 'true') {
            this.getWebsiteStatus(createAd, setSubmitting);
        } else {
            createAd();
        }
    }

    hideQuickAddModal() {
        this.root_store.general_store.hideModal();
        this.setSelectedAdId(undefined);
    }

    onClickActivateDeactivate(id, is_ad_active, setIsAdvertActive) {
        if (!this.root_store.general_store.is_barred) {
            requestWS({ p2p_advert_update: 1, id, is_active: is_ad_active ? 0 : 1 }).then(response => {
                if (response) {
                    if (response.error) {
                        this.setApiErrorCode(response.error.code);
                        this.setActivateDeactivateErrorMessage(response.error.message);
                        this.root_store.general_store.showModal({
                            key: 'ErrorModal',
                            props: {
                                has_close_icon: false,
                                error_message: response.error.message,
                                error_modal_title: generateErrorDialogTitle(this.error_code),
                                width: isMobile() ? '90rem' : '40rem',
                            },
                        });
                    } else {
                        setIsAdvertActive(!!response.p2p_advert_update.is_active);
                    }
                }
                this.setSelectedAdId('');
            });
        }
    }

    onClickCancel() {
        this.setSelectedAdId('');
        this.setShouldShowPopup(false);
    }

    onClickConfirm(showError) {
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
    }

    onClickCreate() {
        this.setShowAdForm(true);
    }

    onClickDelete(id) {
        const { general_store } = this.root_store;

        if (!general_store.is_barred) {
            requestWS({ p2p_advert_info: 1, id }).then(response => {
                if (!response?.error) {
                    const { p2p_advert_info } = response;

                    this.setSelectedAdId(id);

                    if (p2p_advert_info.active_orders > 0) {
                        this.setDeleteErrorMessage(
                            localize(
                                'You have open orders for this ad. Complete all open orders before deleting this ad.'
                            )
                        );
                        general_store.showModal({
                            key: 'MyAdsDeleteErrorModal',
                            props: {},
                        });
                    } else {
                        general_store.showModal({ key: 'MyAdsDeleteModal', props: {} });
                    }
                }
            });
        }
    }

    onClickEdit(id, rate_type) {
        if (!this.root_store.general_store.is_barred) {
            this.setSelectedAdId(id);
            this.setRequiredAdType(rate_type);
            this.getAdvertInfo();
            this.setShowEditAdForm(true);
        }
    }

    onClickSaveEditAd(values, { setSubmitting }) {
        const is_sell_ad = values.type === buy_sell.SELL;
        const update_advert = {
            p2p_advert_update: 1,
            id: this.selected_ad_id,
            max_order_amount: Number(values.max_transaction),
            min_order_amount: Number(values.min_transaction),
            rate_type: this.required_ad_type,
            rate: Number(values.rate_type),
            ...(this.payment_method_names.length > 0 && !is_sell_ad
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && is_sell_ad
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        };

        if (values.contact_info && is_sell_ad) {
            update_advert.contact_info = values.contact_info;
        }

        if (values.description) {
            update_advert.description = values.description;
        }
        if (this.root_store.floating_rate_store.reached_target_date) {
            update_advert.is_active = values.is_active;
        }

        requestWS(update_advert).then(response => {
            // If there's an error, let the user submit the form again.
            if (response) {
                if (response.error) {
                    setSubmitting(false);
                    this.setApiErrorCode(response.error.code);
                    this.setEditAdFormError(response.error.message);
                    this.setIsEditAdErrorModalVisible(true);
                } else {
                    this.setShowEditAdForm(false);
                }
            }
        });
    }

    onClickUpdatePaymentMethods(id, is_buy_advert) {
        this.setIsTableLoading(true);
        requestWS({
            p2p_advert_update: 1,
            id,
            ...(this.payment_method_names.length > 0 && is_buy_advert
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && !is_buy_advert
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        }).then(response => {
            if (!response.error) {
                this.loadMoreAds({ startIndex: 0 });
                this.hideQuickAddModal();
            } else {
                this.setUpdatePaymentMethodsErrorMessage(response.error.message);
                this.root_store.general_store.hideModal();
                this.root_store.general_store.showModal({
                    key: 'ErrorModal',
                    props: {
                        has_close_icon: false,
                        error_message: response.error.message,
                        error_modal_title: generateErrorDialogTitle(this.error_code),
                        width: isMobile() ? '90rem' : '40rem',
                    },
                });
            }
            this.setIsTableLoading(false);
        });
    }

    loadMoreAds({ startIndex }, is_initial_load = false) {
        if (is_initial_load) {
            this.setIsTableLoading(true);
            this.setApiErrorMessage('');
        }
        const { floating_rate_store, general_store } = this.root_store;
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (!response.error) {
                    const { list } = response.p2p_advertiser_adverts;
                    const is_first_page = startIndex === 0;
                    const adverts_list = is_first_page ? list : [...this.adverts, ...list];
                    this.setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);
                    this.setAdverts(adverts_list);
                    if (!floating_rate_store.change_ad_alert) {
                        let should_update_ads = false;
                        if (floating_rate_store.rate_type === ad_type.FLOAT) {
                            // Check if there are any Fixed rate ads
                            should_update_ads = list.some(ad => ad.rate_type === ad_type.FIXED);
                            floating_rate_store.setChangeAdAlert(should_update_ads);
                        } else if (floating_rate_store.rate_type === ad_type.FIXED) {
                            // Check if there are any Float rate ads
                            should_update_ads = list.some(ad => ad.rate_type === ad_type.FLOAT);
                            floating_rate_store.setChangeAdAlert(should_update_ads);
                        }
                    }
                } else if (response.error.code === api_error_codes.PERMISSION_DENIED) {
                    general_store.setIsBlocked(true);
                } else {
                    this.setApiErrorMessage(response.error.message);
                }

                this.setIsTableLoading(false);
                resolve();
            });
        });
    }

    restrictLength = (e, handleChange, max_characters = 15) => {
        // typing more than 15 characters will break the layout
        // max doesn't disable typing, so we will use this to restrict length
        if (e.target.value.length > max_characters) {
            e.target.value = e.target.value.slice(0, max_characters);
            return;
        }
        handleChange(e);
    };

    restrictDecimalPlace = (e, handleChangeCallback) => {
        const pattern = new RegExp(/^[+-]?\d{0,4}(\.\d{0,2})?$/);
        if (e.target.value.length > 8) {
            e.target.value = e.target.value.slice(0, 8);
            return;
        }
        if (pattern.test(e.target.value)) {
            handleChangeCallback(e);
        }
    };

    showQuickAddModal(advert) {
        this.setSelectedAdId(advert);
        this.root_store.general_store.showModal({ key: 'QuickAddModal', props: { advert } });
    }

    setActivateDeactivateErrorMessage(activate_deactivate_error_message) {
        this.activate_deactivate_error_message = activate_deactivate_error_message;
    }

    setAdvertDetails(advert_details) {
        this.advert_details = advert_details;
    }

    setAdverts(adverts) {
        this.adverts = adverts;
    }

    setAdvertsArchivePeriod(adverts_archive_period) {
        this.adverts_archive_period = adverts_archive_period;
    }

    setApiError(api_error) {
        this.api_error = api_error;
    }

    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    setApiTableErrorMessage(api_table_error_message) {
        this.api_table_error_message = api_table_error_message;
    }

    setAvailableBalance(available_balance) {
        this.available_balance = available_balance;
    }

    setApiErrorCode(error_code) {
        this.error_code = error_code;
    }

    setCurrentMethod(current_method) {
        this.current_method = current_method;
    }

    setDeleteErrorMessage(delete_error_message) {
        this.delete_error_message = delete_error_message;
    }

    setEditAdFormError(edit_ad_form_error) {
        this.edit_ad_form_error = edit_ad_form_error;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setIsAdCreatedModalVisible(is_ad_created_modal_visible) {
        this.is_ad_created_modal_visible = is_ad_created_modal_visible;
    }

    setIsApiErrorModalVisible(is_api_error_modal_visible) {
        this.is_api_error_modal_visible = is_api_error_modal_visible;
    }

    setIsEditAdErrorModalVisible(is_edit_ad_error_modal_visible) {
        this.is_edit_ad_error_modal_visible = is_edit_ad_error_modal_visible;
    }

    setIsFormLoading(is_form_loading) {
        this.is_form_loading = is_form_loading;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsTableLoading(is_table_loading) {
        this.is_table_loading = is_table_loading;
    }

    setItemOffset(item_offset) {
        this.item_offset = item_offset;
    }

    setP2pAdvertInformation(p2p_advert_information) {
        this.p2p_advert_information = p2p_advert_information;
    }

    setSelectedAdId(selected_ad_id) {
        this.selected_ad_id = selected_ad_id;
    }

    setSelectedAdvert(selected_advert) {
        this.selected_advert = selected_advert;
    }

    setShouldShowAddPaymentMethod(should_show_add_payment_method) {
        this.should_show_add_payment_method = should_show_add_payment_method;
    }

    setShowAdForm(show_ad_form) {
        this.show_ad_form = show_ad_form;
    }

    setShowEditAdForm(show_edit_ad_form) {
        this.show_edit_ad_form = show_edit_ad_form;
        if (!this.show_edit_ad_form) {
            // this.setRequiredAdType(null);
        }
    }

    onToggleSwitchModal(ad_id) {
        this.setSelectedAdId(ad_id);
        this.getAdvertInfo();
    }

    setRequiredAdType(change_ad_type) {
        this.required_ad_type = change_ad_type;
    }

    setUpdatePaymentMethodsErrorMessage(update_payment_methods_error_message) {
        this.update_payment_methods_error_message = update_payment_methods_error_message;
    }

    validateCreateAdForm(values) {
        const { general_store, floating_rate_store } = this.root_store;
        const validations = {
            default_advert_description: [v => !v || lengthValidator(v), v => !v || textValidator(v)],
            max_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.max_transaction ? +v <= values.max_transaction : true),
            ],
            offer_amount: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
                v => (values.max_transaction ? +v >= values.max_transaction : true),
            ],
            rate_type: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    floating_rate_store.rate_type === ad_type.FIXED
                        ? v > 0 &&
                          decimalValidator(v) &&
                          countDecimalPlaces(v) <=
                              general_store.external_stores.client.local_currency_config.decimal_places
                        : true,
                v =>
                    floating_rate_store.rate_type === ad_type.FLOAT
                        ? rangeValidator(parseFloat(v), floating_rate_store.float_rate_offset_limit)
                        : true,
            ],
        };

        if (values.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            payment_info: localize('Payment instructions'),
            rate_type:
                floating_rate_store.rate_type === ad_type.FLOAT ? localize('Floating rate') : localize('Fixed rate'),
        };

        const getCommonMessages = field_name => [localize('{{field_name}} is required', { field_name })];

        const getContactInfoMessages = field_name => [
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
            localize("Enter a value that's within -{{limit}}% to +{{limit}}%", {
                limit: floating_rate_store.float_rate_offset_limit,
            }),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                        errors[key] = getContactInfoMessages(mapped_key[key])[error_index];
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
                    case 'rate_type':
                        errors[key] = getPriceRateMessages(mapped_key[key])[error_index];
                        break;
                    default:
                        errors[key] = getCommonMessages(mapped_key[key])[error_index];
                }
            }
        });

        if (Object.values(errors).includes('Enter a valid amount')) {
            Object.entries(errors).forEach(([key, value]) => {
                errors[key] = value === 'Enter a valid amount' ? value : undefined;
            });
        }

        return errors;
    }

    validateEditAdForm(values) {
        const { general_store, floating_rate_store } = this.root_store;
        const validations = {
            description: [v => !v || lengthValidator(v), v => !v || textValidator(v)],
            max_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.max_transaction ? +v <= values.max_transaction : true),
            ],
            rate_type: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    this.required_ad_type === ad_type.FIXED
                        ? v > 0 &&
                          decimalValidator(v) &&
                          countDecimalPlaces(v) <=
                              general_store.external_stores.client.local_currency_config.decimal_places
                        : true,
                v =>
                    this.required_ad_type === ad_type.FLOAT
                        ? rangeValidator(v, parseFloat(floating_rate_store.float_rate_offset_limit))
                        : true,
            ],
        };

        if (values.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const mapped_key = {
            contact_info: localize('Contact details'),
            description: localize('Instructions'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            rate_type: this.required_ad_type === ad_type.FLOAT ? localize('Floating rate') : localize('Fixed rate'),
        };

        const getCommonMessages = field_name => [localize('{{field_name}} is required', { field_name })];

        const getContactInfoMessages = field_name => [
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
            localize("Enter a value that's within -{{limit}}% to +{{limit}}%", {
                limit: floating_rate_store.float_rate_offset_limit,
            }),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                        errors[key] = getContactInfoMessages(mapped_key[key])[error_index];
                        break;
                    case 'description':
                        errors[key] = getDefaultAdvertDescriptionMessages(mapped_key[key])[error_index];
                        break;
                    case 'max_transaction':
                        errors[key] = getMaxTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'min_transaction':
                        errors[key] = getMinTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'rate_type':
                        errors[key] = getPriceRateMessages(mapped_key[key])[error_index];
                        break;
                    default:
                        errors[key] = getCommonMessages(mapped_key[key])[error_index];
                }
            }
        });

        if (Object.values(errors).includes('Enter a valid amount')) {
            Object.entries(errors).forEach(([key, value]) => {
                errors[key] = value === 'Enter a valid amount' ? value : undefined;
            });
        }

        return errors;
    }

    toggleMyAdsRateSwitchModal(change_ad_type, is_open_edit_form) {
        this.setRequiredAdType(change_ad_type);
        if (is_open_edit_form) {
            this.setShowEditAdForm(true);
        }

        this.root_store.general_store.hideModal();
        this.onToggleSwitchModal(this.selected_ad_id);
    }
}
