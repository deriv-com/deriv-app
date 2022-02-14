import PropTypes from 'prop-types';
import React from 'react';
import { FormProgress, DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import { getPropertyValue, isDesktop, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CFDPOA from '../Components/cfd-poa';
import CFDPersonalDetailsForm from '../Components/cfd-personal-details-form';
import CFDPOI from '../Components/cfd-poi';

const index_lookup = {
    CFDPersonalDetailsForm: 0,
    CFDPOI: 1,
    CFDPOA: 2,
    CFDPendingVerification: 3,
};

const CFDFinancialStpRealAccountSignup = props => {
    const { refreshNotifications } = props;
    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const [is_loading, setIsLoading] = React.useState(false);
    const [items, setItems] = React.useState([
        {
            header: {
                active_title: localize('Complete your personal details'),
                title: localize('Personal details'),
            },
            body: CFDPersonalDetailsForm,
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
            body: CFDPOI,
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
            body: CFDPOA,
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
    ]);

    const state_index = step;

    const clearError = () => {
        setFormError('');
    };

    const nextStep = () => {
        clearError();
        if (step + 1 < items.length) {
            setStep(step + 1);
        } else {
            props.openPendingDialog();
            props.toggleModal();
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setFormError('');
    };
    const updateValue = async (index, value, setSubmitting, is_dirty = true) => {
        if (is_dirty && index_lookup.CFDPersonalDetailsForm === index) {
            // Set account settings
            const data = await WS.setSettings(value);
            if (data.error) {
                setFormError(data.error.message);
                setSubmitting(false);
                return;
            }
            initiatePersonalDetails(setSubmitting);
        }
        if (index === 0) await WS.triggerMt5DryRun({ email: props.client_email });
        saveFormData(index, value);
        nextStep(setSubmitting);
    };

    const initiatePersonalDetails = async setSubmitting => {
        // force request to update settings cache since settings have been updated
        const response = await WS.authorized.storage.getSettings();

        if (response.error) {
            setFormError(response.error.message);
            if (typeof setSubmitting === 'function') {
                setSubmitting(false);
            }
            return;
        }

        const cloned = Object.assign([], items);
        if (response.get_settings.citizen) {
            cloned[index_lookup.CFDPersonalDetailsForm].form_value.citizen = transform(response.get_settings.citizen);
        }
        if (response.get_settings.tax_residence) {
            cloned[index_lookup.CFDPersonalDetailsForm].form_value.tax_residence = transform(
                response.get_settings.tax_residence
            );
        }
        if (response.get_settings.tax_identification_number) {
            cloned[index_lookup.CFDPersonalDetailsForm].form_value.tax_identification_number =
                response.get_settings.tax_identification_number;
        }
        if (response.get_settings.account_opening_reason) {
            cloned[index_lookup.CFDPersonalDetailsForm].form_value.account_opening_reason =
                response.get_settings.account_opening_reason;
        }
        setItems(cloned);
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    const transform = value => {
        const [result] = props.residence_list.filter(item => item.value === value);
        return getPropertyValue(result, ['text']) || value;
    };

    React.useEffect(() => {
        if (state_index === index_lookup.CFDPersonalDetailsForm) {
            setIsLoading(true);
            initiatePersonalDetails().then(() => {
                setIsLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrent = key => {
        return key ? items[state_index][key] : items[state_index];
    };

    const saveFormData = (index, value) => {
        const cloned_items = Object.assign([], items);
        cloned_items[index].form_value = value;
        if (state_index === index_lookup.CFDPersonalDetailsForm) {
            cloned_items[index_lookup.CFDPersonalDetailsForm].form_value.citizen = transform(value.citizen);

            cloned_items[index_lookup.CFDPersonalDetailsForm].form_value.tax_residence = transform(value.tax_residence);
        }
        setItems(cloned_items);
    };
    const BodyComponent = getCurrent('body');
    const form_value = getCurrent('form_value');
    const passthrough = (getCurrent('props') || []).reduce((arr, item) => {
        return Object.assign(arr, { [item]: props[item] });
    }, {});
    const height = getCurrent('height') || 'auto';

    return (
        <Div100vhContainer
            className='cfd-financial-stp-modal'
            id='real_mt5_financial_stp_account_opening'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='cfd-financial-stp-modal__heading'>
                {getCurrent() && (
                    <>
                        <DesktopWrapper>
                            <FormProgress steps={items} current_step={step} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='cfd-financial-stp-modal__header-steps'>
                                <h4 className='cfd-financial-stp-modal__header-steps-title'>
                                    <Localize
                                        i18n_default_text='Step {{step}}: {{step_title}} ({{step}} of {{steps}})'
                                        values={{
                                            step: step + 1,
                                            steps: items.length,
                                            step_title: items[step].header.title,
                                        }}
                                    />
                                </h4>
                                {items[step].header.active_title && (
                                    <h4 className='cfd-financial-stp-modal__header-steps-subtitle'>
                                        {items[step].header.active_title}
                                    </h4>
                                )}
                            </div>
                        </MobileWrapper>
                    </>
                )}
            </div>
            <div className='cfd-financial-stp-modal__body'>
                <BodyComponent
                    value={form_value}
                    index={state_index}
                    onSubmit={updateValue}
                    height={height}
                    is_loading={is_loading}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                    {...passthrough}
                />
            </div>
        </Div100vhContainer>
    );
};

CFDFinancialStpRealAccountSignup.propTypes = {
    openPendingDialog: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default connect(({ client, modules: { cfd }, notifications }) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    get_settings: client.account_settings,
    client_email: client.email,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    openPendingDialog: cfd.openPendingDialog,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    storeProofOfAddress: cfd.storeProofOfAddress,
}))(CFDFinancialStpRealAccountSignup);
