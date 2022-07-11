import React from 'react';
import { Modal, MobileDialog, DesktopWrapper, MobileWrapper, Div100vhContainer, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TCFDPersonalDetailsModalProps } from './props.types';
import CFDPersonalDetailsForm from '../Components/cfd-personal-details-form';
import { getPropertyValue, isDesktop, WS } from '@deriv/shared';

type TFormValues = { [key: string]: string };
type TSetSubmiting = (isSubmitting: boolean) => void;

const CFDPersonalDetailsModal = ({
    account_type,
    disableApp,
    enableApp,
    getChangeableFields,
    is_fully_authenticated,
    is_open,
    jurisdiction_selected_shortcode,
    landing_company,
    openPasswordModal,
    toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal,
    trading_platform_available_accounts,
    residence_list,
}: TCFDPersonalDetailsModalProps) => {
    const [form_error, setFormError] = React.useState('');
    const [is_loading, setIsLoading] = React.useState(false);
    const [form_values, setFormValues] = React.useState<TFormValues>({});

    const initiatePersonalDetails = async (setSubmitting?: TSetSubmiting) => {
        // force request to update settings cache since settings have been updated
        const response = await WS.authorized.storage.getSettings();

        if (response.error) {
            setFormError(response.error.message);
            if (typeof setSubmitting === 'function') {
                setSubmitting(false);
            }
            return;
        }
        const mt5_signup_requirements_list =
            trading_platform_available_accounts?.find(
                _acc =>
                    ((_acc.market_type === 'gaming' && account_type === 'synthetic') ||
                        _acc.market_type === account_type) &&
                    _acc.shortcode === jurisdiction_selected_shortcode
            )?.requirements.signup || [];

        const initial_form_values = mt5_signup_requirements_list.reduce((acc, el) => {
            return { ...acc, [el]: transform(response.get_settings[el]) || '' };
        }, {});
        setFormValues({ ...form_values, ...initial_form_values });
    };

    React.useEffect(() => {
        if (is_open) {
            setIsLoading(true);
            initiatePersonalDetails().then(() => {
                setIsLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);

    const transform = (value: string | undefined) => {
        const [result] = residence_list.filter(item => item.value === value);
        return getPropertyValue(result, ['text']) || value;
    };

    const saveFormData = (_index: number, value: TFormValues) => {
        const new_form_values: TFormValues = {};
        Object.entries(value).forEach(([key, _value]) => {
            new_form_values[key] = transform(_value);
        });
        setFormValues(new_form_values);
    };

    const prevStep = () => {
        setFormError('');
        toggleCFDPersonalDetailsModal();
        toggleJurisdictionModal();
    };

    const updateValue = async (index: number, value: TFormValues, setSubmitting: TSetSubmiting, is_dirty = true) => {
        if (is_dirty) {
            // Set account settings
            const data = await WS.setSettings(value);
            if (data.error) {
                setFormError(data.error.message);
                setSubmitting(false);
                return;
            }
            initiatePersonalDetails(setSubmitting);
        }
        saveFormData(index, value);
        toggleCFDPersonalDetailsModal();
        openPasswordModal();
    };

    const getPersonalDetailsForm = () => (
        <Div100vhContainer
            className='cfd-personal-details-modal'
            id='cfd-personal-details-modal'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='cfd-personal-details-modal__heading-container'>
                <Text as='p' weight='bold' align='center' size='s'>
                    {localize('Complete your personal details')}
                </Text>
            </div>
            <div className='cfd-personal-details-modal__body'>
                <CFDPersonalDetailsForm
                    changeable_fields={getChangeableFields()}
                    form_error={form_error}
                    has_previous_button
                    index={0}
                    is_fully_authenticated={is_fully_authenticated}
                    is_in_personal_details_modal
                    is_loading={is_loading}
                    landing_company={landing_company}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    onSubmit={updateValue}
                    residence_list={residence_list}
                    value={form_values}
                />
            </div>
        </Div100vhContainer>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='real-account-signup-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    has_close_icon={true}
                    height='688px'
                    id='cfd-personal-details-modal'
                    is_open={is_open}
                    title={localize('Add a real MT5 account')}
                    toggleModal={toggleCFDPersonalDetailsModal}
                    width='904px'
                >
                    {getPersonalDetailsForm()}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    onClose={toggleCFDPersonalDetailsModal}
                    portal_element_id='modal_root'
                    title={localize('Add a real MT5 account')}
                    visible={is_open}
                    wrapper_classname='account-signup-mobile-dialog'
                >
                    {getPersonalDetailsForm()}
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui }: RootStore) => ({
    account_type: modules.cfd.account_type.type,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    getChangeableFields: client.getChangeableFields,
    is_fully_authenticated: client.is_fully_authenticated,
    is_open: modules.cfd.is_cfd_personal_details_modal_visible,
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
    landing_company: client.landing_company,
    openPasswordModal: modules.cfd.enableCFDPasswordModal,
    toggleCFDPersonalDetailsModal: modules.cfd.toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal: modules.cfd.toggleJurisdictionModal,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    residence_list: client.residence_list,
}))(CFDPersonalDetailsModal);
