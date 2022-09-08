import { observable, action, computed, when } from 'mobx';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
import { textValidator } from 'Utils/validations';
import BaseStore from 'Stores/base_store';
import { my_profile_tabs } from 'Constants/my-profile-tabs';

export default class MyProfileStore extends BaseStore {
    @observable active_tab = my_profile_tabs.MY_STATS;
    @observable add_payment_method_error_message = '';
    @observable advertiser_info = {};
    @observable advertiser_payment_methods = {};
    @observable advertiser_payment_methods_error = '';
    @observable available_payment_methods = {};
    @observable balance_available = null;
    @observable contact_info = '';
    @observable default_advert_description = '';
    @observable delete_error_message = '';
    @observable error_message = '';
    @observable form_error = '';
    @observable full_name = '';
    @observable is_button_loading = false;
    @observable is_cancel_add_payment_method_modal_open = false;
    @observable is_cancel_edit_payment_method_modal_open = false;
    @observable is_confirm_delete_modal_open = false;
    @observable is_delete_payment_method_error_modal_open = false;
    @observable is_loading = true;
    @observable is_submit_success = false;
    @observable payment_info = '';
    @observable payment_method_value = undefined;
    @observable payment_methods_list = [];
    @observable payment_method_to_delete = {};
    @observable payment_method_to_edit = {};
    @observable search_results = [];
    @observable search_term = '';
    @observable selected_payment_method = '';
    @observable selected_payment_method_display_name = '';
    @observable selected_payment_method_fields = [];
    @observable selected_payment_method_type = '';
    @observable should_hide_my_profile_tab = false;
    @observable should_show_add_payment_method_error_modal = false;
    @observable should_show_add_payment_method_form = false;
    @observable should_show_edit_payment_method_form = false;

    @computed
    get advertiser_has_payment_methods() {
        return !!Object.keys(this.advertiser_payment_methods).length;
    }

    @computed
    get advertiser_payment_methods_list() {
        const list = [];

        Object.entries(this.advertiser_payment_methods).forEach(key => {
            list.push({
                ID: key[0],
                is_enabled: key[1].is_enabled,
                fields: key[1].fields,
                method: key[1].method,
                display_name: key[1].display_name,
            });
        });

        return list;
    }

    @computed
    get payment_method_field_set() {
        // The fields are rendered dynamically based on the response. This variable will hold a dictionary of field id and its name/required properties
        return this.selected_payment_method_fields.reduce((dict, field_data) => {
            return {
                ...dict,
                [field_data[0]]: { display_name: field_data[1].display_name, required: field_data[1].required },
            };
        }, {});
    }

    @computed
    get initial_values() {
        const object = {};

        Object.values(this.selected_payment_method_fields).forEach(field => {
            const filter = this.payment_method_info
                ? Object.entries(this.payment_method_info.fields).filter(
                      payment_method_field => payment_method_field[0] === field[0]
                  )
                : {};

            if (Object.values(filter).length > 0) {
                object[field[0]] = Object.values(filter)[0][1].value;
            } else {
                object[field[0]] = '';
            }
        });

        return object;
    }

    @computed
    get payment_method_info() {
        return this.advertiser_payment_methods_list.filter(method => method.ID === this.payment_method_to_edit?.ID)[0];
    }

    @computed
    get payment_methods_list_items() {
        const list_items = [];

        Object.entries(this.available_payment_methods).forEach(key => {
            list_items.push({ text: key[1].display_name, value: key[0] });
        });

        return list_items;
    }

    @computed
    get payment_methods_list_methods() {
        const methods = [];

        Object.entries(this.advertiser_payment_methods).forEach(key => {
            if (methods.every(e => e.method !== key[1].method)) {
                if (key[1].method === 'other' || key[1].method === 'bank_transfer') {
                    methods.push({ method: key[1].method, display_name: key[1].display_name });
                } else if (methods.every(e => e.method !== 'e_wallet')) {
                    methods.push({ method: 'e_wallet', display_name: localize('E-wallet') });
                }
            }
        });

        return methods;
    }

    @computed
    get payment_methods_list_values() {
        const list = [];

        Object.entries(this.available_payment_methods).forEach(key => list.push(key[0]));

        return list;
    }

    @action.bound
    createPaymentMethod(values, { setSubmitting }) {
        setSubmitting(true);
        requestWS({
            p2p_advertiser_payment_methods: 1,
            create: [
                {
                    account: values?.account,
                    bank_name: values?.bank_name,
                    branch: values?.branch,
                    instructions: values?.instructions,
                    method: this.payment_method_value || this.selected_payment_method,
                    name: values?.name,
                    bank_code: values?.bank_code,
                },
            ],
        }).then(response => {
            if (response) {
                const { my_ads_store } = this.root_store;

                if (my_ads_store.should_show_add_payment_method_modal) {
                    my_ads_store.setShouldShowAddPaymentMethodModal(false);
                }

                if (my_ads_store.should_show_add_payment_method) {
                    my_ads_store.setShouldShowAddPaymentMethod(false);
                }

                if (response.error) {
                    this.setAddPaymentMethodErrorMessage(response.error.message);
                    this.setShouldShowAddPaymentMethodErrorModal(true);
                } else {
                    this.setShouldShowAddPaymentMethodForm(false);
                    this.getAdvertiserPaymentMethods();
                }

                setSubmitting(false);
            }
        });
    }

    @action.bound
    getAdvertiserInfo() {
        this.setIsLoading(true);
        this.setErrorMessage('');
        requestWS({
            p2p_advertiser_info: 1,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;
                this.setAdvertiserInfo(p2p_advertiser_info);
                this.setBalanceAvailable(p2p_advertiser_info.balance_available);
                this.setContactInfo(p2p_advertiser_info.contact_info);
                this.setDefaultAdvertDescription(p2p_advertiser_info.default_advert_description);
                this.root_store.general_store.setShouldShowRealName(!!p2p_advertiser_info.show_name);
            } else if (response.error.code === 'PermissionDenied') {
                this.root_store.general_store.setIsBlocked(true);
            } else {
                this.setErrorMessage(response.error.message);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    getAdvertiserPaymentMethods() {
        this.setIsLoading(true);
        requestWS({
            p2p_advertiser_payment_methods: 1,
        }).then(response => {
            if (response.error) {
                this.setAdvertiserPaymentMethodsError(response.error.message);
            } else {
                this.setAdvertiserPaymentMethods(response?.p2p_advertiser_payment_methods);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    getPaymentMethodsList() {
        requestWS({
            p2p_payment_methods: 1,
        }).then(response => {
            if (response) {
                if (response.error) {
                    return;
                }
                const { p2p_payment_methods } = response;
                const list = [];
                const list_items = [];
                this.setAvailablePaymentMethods(p2p_payment_methods);
                if (this.search_term) {
                    Object.entries(this.available_payment_methods).forEach(key => {
                        if (key[1].display_name.toLowerCase().includes(this.search_term.toLowerCase().trim()))
                            list_items.push({ text: key[1].display_name, value: key[0] });
                    });
                }

                Object.entries(this.available_payment_methods).forEach(key => {
                    list.push({ text: key[1].display_name, value: key[0] });
                });
                this.setPaymentMethodsList(list);

                if (list_items.length) {
                    this.setSearchResults(list_items);
                } else {
                    this.setSearchResults([]);
                }
            }
        });
    }

    @action.bound
    getPaymentMethodDisplayName(payment_method) {
        this.setSelectedPaymentMethodDisplayName(this.available_payment_methods[payment_method].display_name);
        return this.selected_payment_method_display_name;
    }

    @action.bound
    getPaymentMethodValue(payment_method) {
        const method = Object.entries(this.available_payment_methods).filter(
            pm => pm[1].display_name === payment_method
        );

        this.setPaymentMethodValue(method[0][0]);
        return this.payment_method_value;
    }

    @action.bound
    getSelectedPaymentMethodDetails() {
        this.setPaymentMethodValue(undefined);

        if (this.selected_payment_method) {
            this.setSelectedPaymentMethodDisplayName(
                this.available_payment_methods[this.selected_payment_method].display_name
            );
            this.setSelectedPaymentMethodFields(
                Object.entries(this.available_payment_methods[this.selected_payment_method].fields)
            );
            this.setSelectedPaymentMethodType(this.available_payment_methods[this.selected_payment_method].type);
        } else if (this.selected_payment_method_display_name) {
            const payment_method = Object.entries(this.available_payment_methods).filter(
                pm => pm[1].display_name === this.selected_payment_method_display_name
            );
            const filtered_payment_method = Object.entries(payment_method)[0][1][1];

            this.setPaymentMethodValue(payment_method[0][0]);
            this.setSelectedPaymentMethodDisplayName(filtered_payment_method.display_name);
            this.setSelectedPaymentMethodFields(Object.entries(filtered_payment_method.fields));
            this.setSelectedPaymentMethodType(filtered_payment_method.type);
        }
    }

    getSettings() {
        requestWS({ get_settings: 1 }).then(response => {
            const { get_settings } = response;
            if (!response.error) {
                this.setFullName(`${get_settings.first_name} ${get_settings.last_name}`);
            } else {
                this.setFormError(response.error.message);
            }
        });
    }
    @action.bound
    handleSubmit(values) {
        requestWS({
            p2p_advertiser_update: 1,
            contact_info: values.contact_info,
            payment_info: values.payment_info,
            default_advert_description: values.default_advert_description,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_update } = response;
                this.setBalanceAvailable(p2p_advertiser_update.balance_available);
                this.setContactInfo(p2p_advertiser_update.contact_info);
                this.setDefaultAdvertDescription(p2p_advertiser_update.default_advert_description);
                this.setIsSubmitSuccess(true);
            } else {
                this.setFormError(response.error);
            }
            setTimeout(() => {
                this.setIsSubmitSuccess(false);
            }, 3000);
        });
    }
    @action.bound
    handleToggle() {
        this.root_store.general_store.setShouldShowRealName(!this.root_store?.general_store?.should_show_real_name);
        requestWS({
            p2p_advertiser_update: 1,
            show_name: this.root_store?.general_store?.should_show_real_name ? 1 : 0,
        }).then(response => {
            if (response.error) {
                this.setFormError(response.error.message);
                this.root_store.general_store.setShouldShowRealName(
                    !this.root_store?.general_store?.should_show_real_name
                );
            }
        });
    }

    @action.bound
    hideAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(false);
    }

    @action.bound
    onClickDelete() {
        requestWS({
            p2p_advertiser_payment_methods: 1,
            delete: [this.payment_method_to_delete.ID],
        }).then(async response => {
            this.setIsConfirmDeleteModalOpen(false);
            if (!response.error) {
                this.getAdvertiserPaymentMethods();
            } else {
                this.setDeleteErrorMessage(response.error.message);
                await when(
                    () => !this.root_store.general_store.is_modal_open,
                    () => this.setIsDeletePaymentMethodErrorModalOpen(true)
                );
            }
        });
    }

    @action.bound
    showAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(true);
    }

    @action.bound
    updatePaymentMethod(values, { setSubmitting }) {
        requestWS({
            p2p_advertiser_payment_methods: 1,
            update: {
                [this.payment_method_to_edit.ID]: {
                    ...values,
                },
            },
        }).then(response => {
            if (response.error) {
                this.setAddPaymentMethodErrorMessage(response.error.message);
                this.setShouldShowAddPaymentMethodErrorModal(true);
            } else {
                this.setShouldShowEditPaymentMethodForm(false);
                this.getAdvertiserPaymentMethods();
            }

            setSubmitting(false);
        });
    }

    validateForm = values => {
        const validations = {
            contact_info: [v => textValidator(v)],
            default_advert_description: [v => textValidator(v)],
            payment_info: [v => textValidator(v)],
        };

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            payment_info: localize('Payment details'),
        };

        const errors = {};

        const getErrorMessages = field_name => [
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                {
                    field_name,
                }
            ),
        ];

        Object.entries(validations).forEach(([key, rule]) => {
            const error_index = rule.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                    case 'default_advert_description':
                    case 'payment_info':
                        errors[key] = getErrorMessages(mapped_key[key])[error_index];
                        break;
                    default: {
                        errors[key] = getErrorMessages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };

    @action.bound
    validatePaymentMethodFields = values => {
        const errors = {};
        const no_symbols_regex = /^[a-zA-Z0-9\s\-.@_+#(),:;']+$/;

        Object.keys(values).forEach(key => {
            const value = values[key];
            const payment_method_field_set = this.payment_method_field_set[key];
            const { display_name, required } = payment_method_field_set;

            if (required && !value) {
                errors[key] = localize('This field is required.');
            } else if (value && !no_symbols_regex.test(value)) {
                errors[key] = localize(
                    "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                    {
                        field_name: display_name,
                        interpolation: { escapeValue: false },
                    }
                );
            } else if (value.length > 200) {
                errors[key] = localize('{{field_name}} has exceeded maximum length of 200 characters.', {
                    field_name: display_name,
                    interpolation: { escapeValue: false },
                });
            }
        });

        return errors;
    };

    @action.bound
    setActiveTab(active_tab) {
        this.active_tab = active_tab;
    }

    @action.bound
    setAddPaymentMethodErrorMessage(add_payment_method_error_message) {
        this.add_payment_method_error_message = add_payment_method_error_message;
    }

    @action.bound
    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    @action.bound
    setAdvertiserPaymentMethods(advertiser_payment_methods) {
        this.advertiser_payment_methods = advertiser_payment_methods;
    }

    @action.bound
    setAdvertiserPaymentMethodsError(advertiser_payment_methods_error) {
        this.advertiser_payment_methods_error = advertiser_payment_methods_error;
    }

    @action.bound
    setAvailablePaymentMethods(available_payment_methods) {
        this.available_payment_methods = available_payment_methods;
    }

    @action.bound
    setBalanceAvailable(balance_available) {
        this.balance_available = balance_available;
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
    setDeleteErrorMessage(delete_error_message) {
        this.delete_error_message = delete_error_message;
    }

    @action.bound
    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    @action.bound
    setFormError(form_error) {
        this.form_error = form_error;
    }

    @action.bound
    setFullName(full_name) {
        this.full_name = full_name;
    }

    @action.bound
    setIsCancelAddPaymentMethodModalOpen(is_cancel_add_payment_method_modal_open) {
        this.is_cancel_add_payment_method_modal_open = is_cancel_add_payment_method_modal_open;
    }

    @action.bound
    setIsCancelEditPaymentMethodModalOpen(is_cancel_edit_payment_method_modal_open) {
        this.is_cancel_edit_payment_method_modal_open = is_cancel_edit_payment_method_modal_open;
    }

    @action.bound
    setIsConfirmDeleteModalOpen(is_confirm_delete_modal_open) {
        this.is_confirm_delete_modal_open = is_confirm_delete_modal_open;
    }

    @action.bound
    setIsDeletePaymentMethodErrorModalOpen(is_delete_payment_method_error_modal_open) {
        this.is_delete_payment_method_error_modal_open = is_delete_payment_method_error_modal_open;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsSubmitSuccess(is_submit_success) {
        this.is_submit_success = is_submit_success;
    }

    @action.bound
    setPaymentMethodValue(payment_method_value) {
        this.payment_method_value = payment_method_value;
    }

    @action.bound
    setPaymentMethodsList(payment_methods_list) {
        this.payment_methods_list = payment_methods_list;
    }

    @action.bound
    setPaymentMethodToDelete(payment_method_to_delete) {
        this.payment_method_to_delete = payment_method_to_delete;
    }

    @action.bound
    setPaymentMethodToEdit(payment_method_to_edit) {
        this.payment_method_to_edit = payment_method_to_edit;
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
    setSelectedPaymentMethod(selected_payment_method) {
        this.selected_payment_method = selected_payment_method;
    }

    @action.bound
    setSelectedPaymentMethodDisplayName(selected_payment_method_display_name) {
        this.selected_payment_method_display_name = selected_payment_method_display_name;
    }

    @action.bound
    setSelectedPaymentMethodFields(selected_payment_method_fields) {
        this.selected_payment_method_fields = selected_payment_method_fields;
    }

    @action.bound
    setSelectedPaymentMethodType(selected_payment_method_type) {
        this.selected_payment_method_type = selected_payment_method_type;
    }

    @action.bound
    setShouldHideMyProfileTab(should_hide_my_profile_tab) {
        this.should_hide_my_profile_tab = should_hide_my_profile_tab;
    }

    @action.bound
    setShouldShowAddPaymentMethodErrorModal(should_show_add_payment_method_error_modal) {
        this.should_show_add_payment_method_error_modal = should_show_add_payment_method_error_modal;
    }

    @action.bound
    setShouldShowAddPaymentMethodForm(should_show_add_payment_method_form) {
        this.should_show_add_payment_method_form = should_show_add_payment_method_form;
    }

    @action.bound
    setShouldShowEditPaymentMethodForm(should_show_edit_payment_method_form) {
        this.should_show_edit_payment_method_form = should_show_edit_payment_method_form;
    }
}
