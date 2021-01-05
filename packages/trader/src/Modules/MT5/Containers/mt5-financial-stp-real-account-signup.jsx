import PropTypes from 'prop-types';
import React from 'react';
import { FormProgress, DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import { getPropertyValue, isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import MT5POA from '../Components/mt5-poa.jsx';
import MT5PersonalDetailsForm from '../Components/mt5-personal-details-form.jsx';
import MT5POI from '../Components/mt5-poi.jsx';

const index_lookup = {
    MT5PersonalDetailsForm: 0,
    MT5POI: 1,
    MT5POA: 2,
    MT5PendingVerification: 3,
};

class MT5FinancialStpRealAccountSignup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: undefined,
            step: 0,
            form_error: '',
            is_loading: false,
            items: [
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title: localize('Personal details'),
                    },
                    body: MT5PersonalDetailsForm,
                    form_value: {
                        citizen: '',
                        tax_residence: '',
                        tax_identification_number: '',
                        account_opening_reason: '',
                    },
                    props: ['residence_list', 'is_fully_authenticated', 'landing_company'],
                },
                {
                    header: {
                        active_title: localize('Complete your proof of identity'),
                        title: localize('Proof of identity'),
                    },
                    body: MT5POI,
                    form_value: {
                        poi_state: 'unknown',
                    },
                    props: [
                        'addNotificationByKey',
                        'authentication_status',
                        'refreshNotifications',
                        'removeNotificationMessage',
                        'removeNotificationByKey',
                    ],
                },
                {
                    header: {
                        active_title: localize('Complete your proof of address'),
                        title: localize('Proof of address'),
                    },
                    body: MT5POA,
                    form_value: {
                        address_line_1: props.get_settings.address_line_1,
                        address_line_2: props.get_settings.address_line_2,
                        address_city: props.get_settings.address_city,
                        address_state: props.get_settings.address_state,
                        address_postcode: props.get_settings.address_postcode,
                        upload_file: '',
                    },
                    props: ['states_list', 'get_settings', 'storeProofOfAddress', 'refreshNotifications'],
                },
            ],
        };
    }

    get state_index() {
        return this.state.step;
    }

    get has_more_steps() {
        return this.state.step + 1 < this.state.items.length;
    }

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    nextStep = () => {
        this.clearError();
        if (this.has_more_steps) {
            this.goNext();
        } else {
            this.finishWizard();
        }
    };

    finishWizard = () => {
        this.props.openPendingDialog();
        this.props.toggleModal();
    };

    prevStep = () => {
        this.setState({
            step: this.state.step - 1,
            form_error: '',
        });
    };

    updateValue = async (index, value, setSubmitting, is_dirty = true) => {
        if (is_dirty && index_lookup.MT5PersonalDetailsForm === index) {
            // Set account settings
            const data = await WS.setSettings(value);
            if (data.error) {
                this.setState({
                    form_error: data.error.message,
                });
                setSubmitting(false);
                return;
            }
            this.initiatePersonalDetails(setSubmitting);
        }
        this.saveFormData(index, value);
        this.nextStep(setSubmitting);
    };

    initiatePersonalDetails = async setSubmitting => {
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
            cloned[index_lookup.MT5PersonalDetailsForm].form_value.citizen = this.transform(
                response.get_settings.citizen
            );
        }
        if (response.get_settings.tax_residence) {
            cloned[index_lookup.MT5PersonalDetailsForm].form_value.tax_residence = this.transform(
                response.get_settings.tax_residence
            );
        }
        if (response.get_settings.tax_identification_number) {
            cloned[index_lookup.MT5PersonalDetailsForm].form_value.tax_identification_number =
                response.get_settings.tax_identification_number;
        }
        if (response.get_settings.account_opening_reason) {
            cloned[index_lookup.MT5PersonalDetailsForm].form_value.account_opening_reason =
                response.get_settings.account_opening_reason;
        }
        this.setState(
            {
                items: cloned,
            },
            this.props.refreshNotifications
        );
    };

    transform = value => {
        const [result] = this.props.residence_list.filter(item => item.value === value);
        return getPropertyValue(result, ['text']) || value;
    };

    goNext = () => {
        this.setState({
            step: this.state.step + 1,
        });
    };

    componentDidMount() {
        if (this.state_index === index_lookup.MT5PersonalDetailsForm) {
            this.setState({
                is_loading: true,
            });
            this.initiatePersonalDetails().then(() => {
                this.setState({
                    is_loading: false,
                });
            });
        }
    }

    getCurrent = key => {
        return key ? this.state.items[this.state_index][key] : this.state.items[this.state_index];
    };

    saveFormData = (index, value) => {
        const cloned_items = Object.assign([], this.state.items);
        cloned_items[index].form_value = value;
        if (this.state_index === index_lookup.MT5PersonalDetailsForm) {
            cloned_items[index_lookup.MT5PersonalDetailsForm].form_value.citizen = this.transform(value.citizen);

            cloned_items[index_lookup.MT5PersonalDetailsForm].form_value.tax_residence = this.transform(
                value.tax_residence
            );
        }
        this.setState({
            items: cloned_items,
        });
    };

    render() {
        const BodyComponent = this.getCurrent('body');
        const form_value = this.getCurrent('form_value');
        const passthrough = (this.getCurrent('props') || []).reduce((arr, item) => {
            return Object.assign(arr, { [item]: this.props[item] });
        }, {});
        const height = this.getCurrent('height') || 'auto';
        return (
            <Div100vhContainer
                className='mt5-financial-stp-modal'
                id='real_mt5_financial_stp_account_opening'
                is_disabled={isDesktop()}
                height_offset='40px'
            >
                <div className='mt5-financial-stp-modal__heading'>
                    {this.getCurrent() && (
                        <>
                            <DesktopWrapper>
                                <FormProgress steps={this.state.items} current_step={this.state.step} />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='mt5-financial-stp-modal__header-steps'>
                                    <h4 className='mt5-financial-stp-modal__header-steps-title'>
                                        <Localize
                                            i18n_default_text='Step {{step}}: {{step_title}} ({{step}} of {{steps}})'
                                            values={{
                                                step: this.state.step + 1,
                                                steps: this.state.items.length,
                                                step_title: this.state.items[this.state.step].header.title,
                                            }}
                                        />
                                    </h4>
                                    {this.state.items[this.state.step].header.active_title && (
                                        <h4 className='mt5-financial-stp-modal__header-steps-subtitle'>
                                            {this.state.items[this.state.step].header.active_title}
                                        </h4>
                                    )}
                                </div>
                            </MobileWrapper>
                        </>
                    )}
                </div>
                <div className='mt5-financial-stp-modal__body'>
                    <BodyComponent
                        value={form_value}
                        index={this.state_index}
                        onSubmit={this.updateValue}
                        height={height}
                        is_loading={this.state.is_loading}
                        onCancel={this.prevStep}
                        onSave={this.saveFormData}
                        form_error={this.state.form_error}
                        {...passthrough}
                    />
                </div>
            </Div100vhContainer>
        );
    }
}

MT5FinancialStpRealAccountSignup.propTypes = {
    openPendingDialog: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default connect(({ client, modules: { mt5 }, ui }) => ({
    addNotificationByKey: ui.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    get_settings: client.account_settings,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    openPendingDialog: mt5.openPendingDialog,
    refreshNotifications: client.refreshNotifications,
    removeNotificationMessage: ui.removeNotificationMessage,
    removeNotificationByKey: ui.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    storeProofOfAddress: mt5.storeProofOfAddress,
}))(MT5FinancialStpRealAccountSignup);
