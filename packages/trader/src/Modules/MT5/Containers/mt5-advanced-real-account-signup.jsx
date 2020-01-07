import PropTypes                   from 'prop-types';
import React, { Component }        from 'react';
import { FormProgress }            from '@deriv/components';
import { localize }                from '@deriv/translations';
import { connect }                 from 'Stores/connect';
import { WS }                      from 'Services/ws-methods';
import MT5POA                      from '../Components/mt5-poa.jsx';
import MT5PersonalDetailsForm      from '../Components/mt5-personal-details-form.jsx';
import MT5POI                      from '../Components/mt5-poi.jsx';
import MT5PendingVerificationModal from '../Components/mt5-pending-verification-modal.jsx';

const index_lookup = {
    MT5PersonalDetailsForm: 0,
    MT5POI                : 1,
    MT5POA                : 2,
    MT5PendingVerification: 3,
};

class MT5AdvancedRealAccountSignup extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {
            finished  : undefined,
            step      : 0,
            form_error: '',
            items     : [
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title       : localize('Personal details'),
                    },
                    body      : MT5PersonalDetailsForm,
                    form_value: {
                        citizen                  : '',
                        tax_residence            : '',
                        tax_identification_number: '',
                    },
                    props: ['residence_list', 'is_fully_authenticated'],
                },
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title       : localize('Proof of identity'),
                    },
                    body      : MT5POI,
                    form_value: {
                        poi_state: 'unknown',
                    },
                    props: ['refreshNotifications', 'removeNotificationMessage'],
                },
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title       : localize('Proof of address'),
                    },
                    body      : MT5POA,
                    form_value: {
                        address_line_1  : props.get_settings.address_line_1,
                        address_line_2  : props.get_settings.address_line_2,
                        address_city    : props.get_settings.address_city,
                        address_state   : props.get_settings.address_state,
                        address_postcode: props.get_settings.address_postcode,
                        upload_file     : '',
                    },
                    props: ['states_list', 'get_settings', 'storeProofOfAddress', 'refreshNotifications'],
                },
                {
                    body      : MT5PendingVerificationModal,
                    form_value: {},
                    header    : {
                        active_title: localize('Account password'),
                        title       : localize('Account password'),
                    },
                    props: ['toggleModal'],
                },
            ],
        };
    }

    get state_index() {
        return this.state.step;
    }

    hasMoreSteps() {
        return this.state.step + 1 < this.state.items.length;
    }

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    nextStep = (setSubmitting) => {
        this.clearError();
        // Check if the wizard is not finished
        if (this.hasMoreSteps()) {
            this.goNext();
        } else {
            this.props.onLoading();
            this.createMT5AdvancedAccount(setSubmitting);
        }
    };

    createMT5AdvancedAccount = (setSubmitting) => {
        setSubmitting(true);
        this.props.getAccountSettings();
        // get account settings
        // if POI/POA is accepted, open password modal
        // else show a prompt for user to wait and check back later.
        setSubmitting(false);
    };

    prevStep = () => {
        this.setState({
            step      : this.state.step - 1,
            form_error: '',
        });
    };

    updateValue = async (index, value, setSubmitting) => {
        if (index_lookup.MT5PersonalDetails === index) {
            // Set account settings
            const data = await WS.setSettings(value);
            if (data.error) {
                this.setState({
                    form_error: data.error.message,
                });
                console.log('error', data.error.message);
                setSubmitting(false);
                return;
            }
            this.initiatePersonalDetails(setSubmitting);
        }
        this.saveFormData(index, value);
        this.nextStep(setSubmitting);
    };

    initiatePersonalDetails = async (setSubmitting) => {
        // force request to update settings cache since settings have been updated
        const response = await WS.authorized.storage.getSettings();
        if (response.error) {
            this.setState({ form_error: response.error.message });
            if (typeof setSubmitting === 'function') {
                setSubmitting(false);
            }
            return;
        }

        const cloned = Object.assign([], this.state.items);
        if (response.get_settings.citizen) {
            cloned[index_lookup.MT5PersonalDetails].form_value.citizen =
                this.transform(response.get_settings.citizen);
        }
        if (response.get_settings.tax_residence) {
            cloned[index_lookup.MT5PersonalDetails].form_value.tax_residence =
                this.transform(response.get_settings.tax_residence);
        }
        if (response.get_settings.tax_identification_number) {
            cloned[index_lookup.MT5PersonalDetails].form_value.tax_identification_number =
                response.get_settings.tax_identification_number;
        }
        this.setState({
            items: cloned,
        });
        this.props.refreshNotifications();
    };

    transform = (value) => {
        const result = this.props.residence_list.filter(item => item.value === value);
        return result[0].text || value;
    };

    goNext() {
        this.setState({
            step: this.state.step + 1,
        });
    }

    componentDidMount() {
        if (this.state_index === index_lookup.MT5PersonalDetails) {
            this.initiatePersonalDetails();
        }
    }

    getCurrent = (key) => {
        return key ? this.state.items[this.state_index][key] : this.state.items[this.state_index];
    };

    saveFormData = (index, value) => {
        const cloned_items             = Object.assign([], this.state.items);
        cloned_items[index].form_value = value;
        if (this.state_index === index_lookup.MT5PersonalDetails) {
            cloned_items[index_lookup.MT5PersonalDetails].form_value.citizen =
                this.transform(value.citizen);

            cloned_items[index_lookup.MT5PersonalDetails].form_value.tax_residence =
                this.transform(value.tax_residence);
        }
        this.setState({
            items: cloned_items,
        });
    };

    render() {
        const BodyComponent = this.getCurrent('body');
        const passthrough   = (this.getCurrent('props') || []).reduce((arr, item) => {
            return Object.assign(arr, { [item]: this.props[item] });
        }, {});
        const height        = this.getCurrent('height') || 'auto';
        return (
            <div className='mt5-advanced-modal' id='real_mt5_advanced_account_opening'>
                <div className='mt5-advanced-modal__heading'>
                    {this.getCurrent() && <FormProgress
                        steps={this.state.items}
                        current_step={this.state.step}
                    />}
                </div>
                <div className='mt5-advanced-modal__body'>
                    <BodyComponent
                        value={this.getCurrent('form_value')}
                        index={this.state_index}
                        onSubmit={this.updateValue}
                        height={height}
                        onCancel={this.prevStep}
                        onSave={this.saveFormData}
                        {...passthrough}
                    />
                </div>
            </div>
        );
    }
}

MT5AdvancedRealAccountSignup.propTypes = {
    onError    : PropTypes.func,
    onLoading  : PropTypes.func,
    toggleModal: PropTypes.func,
};

export default connect(({ client, modules: { mt5 } }) => ({
    residence_list        : client.residence_list,
    is_fully_authenticated: client.is_fully_authenticated,
    refreshNotifications  : client.refreshNotifications,
    states_list           : client.states_list,
    get_settings          : client.account_settings,
    storeProofOfAddress   : mt5.storeProofOfAddress,
}))(MT5AdvancedRealAccountSignup);
