import { observable, action, computed } from 'mobx';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
import { textValidator } from 'Utils/validations';
import BaseStore from 'Stores/base_store';
import { my_profile_tabs } from 'Constants/my-profile-tabs';

export default class MyProfileStore extends BaseStore {
    @observable active_tab = my_profile_tabs.MY_STATS;
    @observable advertiser_info = {};
    @observable advertiser_payment_methods = {};
    @observable advertiser_payment_methods_error = '';
    @observable available_payment_methods = {};
    @observable balance_available = null;
    @observable contact_info = '';
    @observable default_advert_description = '';
    @observable error_message = '';
    @observable form_error = '';
    @observable full_name = '';
    @observable is_button_loading = false;
    @observable is_cancel_add_payment_method_modal_open = false;
    @observable is_confirm_delete_modal_open = false;
    @observable is_loading = true;
    @observable is_submit_success = false;
    @observable payment_info = '';
    @observable payment_method_to_delete = {};
    @observable payment_method_to_edit = {};
    @observable selected_payment_method = '';
    @observable selected_payment_method_display_name = '';
    @observable selected_payment_method_fields = [];
    @observable selected_payment_method_type = '';
    @observable should_hide_my_profile_tab = false;
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
    get initial_values() {
        const object = {};
        Object.entries(this.payment_method_info.fields).forEach(payment_method_field => {
            object[payment_method_field[0]] = payment_method_field[1].value;
        });

        return object;
    }

    @computed
    get payment_method_info() {
        return this.advertiser_payment_methods_list.filter(method => method.ID === this.payment_method_to_edit.ID)[0];
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
            if (methods.length) {
                if (methods.some(e => e.method !== key[1].method)) {
                    methods.push({ method: key[1].method, display_name: key[1].display_name });
                }
            } else {
                methods.push({ method: key[1].method, display_name: key[1].display_name });
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
                    account: values.account,
                    bank_name: values.bank_name,
                    method: this.selected_payment_method,
                },
            ],
        }).then(response => {
            if (response) {
                this.setShouldShowAddPaymentMethodForm(false);
                this.getAdvertiserPaymentMethods();
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
                this.setPaymentInfo(p2p_advertiser_info.payment_info);
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
        requestWS({
            p2p_advertiser_payment_methods: 1,
        }).then(response => {
            if (response.error) {
                this.setAdvertiserPaymentMethodsError(response.error.message);
            } else {
                this.setAdvertiserPaymentMethods(response.p2p_advertiser_payment_methods);
            }
        });
    }

    @action.bound
    getPaymentMethodsList() {
        requestWS({
            p2p_payment_methods: 1,
        }).then(response => {
            const { p2p_payment_methods } = response;
            this.setAvailablePaymentMethods(p2p_payment_methods);
        });
    }

    @action.bound
    getSelectedPaymentMethodDetails() {
        this.setSelectedPaymentMethodDisplayName(
            this.available_payment_methods[this.selected_payment_method].display_name
        );
        this.setSelectedPaymentMethodFields(
            Object.entries(this.available_payment_methods[this.selected_payment_method].fields)
        );
        this.setSelectedPaymentMethodType(this.available_payment_methods[this.selected_payment_method].type);
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
                this.setPaymentInfo(p2p_advertiser_update.payment_info);
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
        requestWS({
            p2p_advertiser_update: 1,
            show_name: this.root_store?.general_store?.should_show_real_name ? 0 : 1,
        }).then(response => {
            if (response.error) {
                this.setFormError(response.error.message);
            } else {
                this.root_store.general_store.setShouldShowRealName(true);
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
        }).then(response => {
            if (response) {
                this.getAdvertiserPaymentMethods();
                this.setIsConfirmDeleteModalOpen(false);
            }
        });
    }

    @action.bound
    showAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(true);
    }

    @action.bound
    updatePaymentMethod(values) {
        requestWS({
            p2p_advertiser_payment_methods: 1,
            update: {
                [this.payment_method_to_edit.ID]: {
                    values,
                },
            },
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
    setActiveTab(active_tab) {
        this.active_tab = active_tab;
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
    setIsConfirmDeleteModalOpen(is_confirm_delete_modal_open) {
        this.is_confirm_delete_modal_open = is_confirm_delete_modal_open;
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
    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
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
    setShouldShowAddPaymentMethodForm(should_show_add_payment_method_form) {
        this.should_show_add_payment_method_form = should_show_add_payment_method_form;
    }

    @action.bound
    setShouldShowEditPaymentMethodForm(should_show_edit_payment_method_form) {
        this.should_show_edit_payment_method_form = should_show_edit_payment_method_form;
    }
}
