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
    @observable is_loading = true;
    @observable is_submit_success = false;
    @observable payment_info = '';
    // @observable payment_methods_list_items = [];
    @observable selected_payment_method = '';
    @observable should_hide_my_profile_tab = false;
    @observable should_show_add_payment_method_form = false;

    @computed
    get advertiser_has_payment_methods() {
        return !!this.advertiser_payment_methods.length;
    }

    @computed
    get payment_methods_list_items() {
        const list_items = [];

        Object.entries(this.available_payment_methods).forEach(key => {
            list_items.push({ text: key[1].display_name, value: key[0] });
        });
        // this.setPaymentMethodsListItems(list_items);
        console.log(list_items);
        return list_items;
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
            console.log(response);
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

    getSelectedPaymentMethodFields() {
        console.log(Object.entries(this.available_payment_methods));
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

    handleToggle = () => {
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
    };

    @action.bound
    hideAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(false);
    }

    @action.bound
    showAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(true);
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
    setPaymentMethodsListItems(payment_methods_list_items) {
        this.payment_methods_list_items = payment_methods_list_items;
    }

    @action.bound
    setSelectedPaymentMethod(selected_payment_method) {
        this.selected_payment_method = selected_payment_method;
    }

    @action.bound
    setShouldHideMyProfileTab(should_hide_my_profile_tab) {
        this.should_hide_my_profile_tab = should_hide_my_profile_tab;
    }

    @action.bound
    setShouldShowAddPaymentMethodForm(should_show_add_payment_method_form) {
        this.should_show_add_payment_method_form = should_show_add_payment_method_form;
    }
}
