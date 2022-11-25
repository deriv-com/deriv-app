import React from 'react';
import { Modal, MobileDialog, DesktopWrapper, MobileWrapper, Div100vhContainer, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TCFDPersonalDetailsModalProps } from './props.types';
import CFDPersonalDetailsForm from '../Components/cfd-personal-details-form';
import { getPropertyValue, isDesktop, WS } from '@deriv/shared';
import { GetSettings } from '@deriv/api-types';

type TFormValues = { [key: string]: string };
type TSetSubmitting = (isSubmitting: boolean) => void;

const CFDPersonalDetailsModal = ({
    account_settings,
    disableApp,
    enableApp,
    getChangeableFields,
    is_from_mt5_compare_accounts_table,
    is_open,
    landing_company,
    openPasswordModal,
    toggleCompareAccounts,
    toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal,
    residence_list,
    setAccountSettings,
}: TCFDPersonalDetailsModalProps) => {
    const [form_error, setFormError] = React.useState('');
    const [is_loading, setIsLoading] = React.useState(false);
    const [form_values, setFormValues] = React.useState<TFormValues>({
        citizen: '',
        place_of_birth: '',
        tax_residence: '',
        tax_identification_number: '',
        account_opening_reason: '',
    });

    const initiatePersonalDetails = async (setSubmitting?: TSetSubmitting) => {
        // force request to update settings cache since settings have been updated
        let get_settings_response: GetSettings;
        if (!account_settings) {
            const response = await WS.authorized.storage.getSettings();

            if (response.error) {
                setFormError(response.error.message);
                if (typeof setSubmitting === 'function') {
                    setSubmitting(false);
                }
                return;
            }
            get_settings_response = response.get_settings;
        } else {
            get_settings_response = account_settings;
        }

        const { citizen, place_of_birth, tax_residence, tax_identification_number, account_opening_reason } =
            get_settings_response;

        setFormValues({
            ...form_values,
            citizen: transform(citizen) || '',
            place_of_birth: transform(place_of_birth) || '',
            tax_residence: transform(tax_residence) || '',
            tax_identification_number: tax_identification_number || '',
            account_opening_reason: account_opening_reason || '',
        });
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

    const transform = (value: unknown) => {
        const [result] = residence_list.filter(item => item.value === value);
        return getPropertyValue(result, ['text']) || value;
    };

    const saveFormData = (_index: number, value: TFormValues) => {
        setFormValues({
            ...value,
            citizen: transform(value.citizen),
            place_of_birth: transform(value.place_of_birth),
            tax_residence: transform(value.tax_residence),
        });
    };

    const prevStep = () => {
        setFormError('');
        toggleCFDPersonalDetailsModal();
        if (is_from_mt5_compare_accounts_table) {
            toggleCompareAccounts();
        } else {
            toggleJurisdictionModal();
        }
    };

    const updateValue = async (index: number, value: TFormValues, setSubmitting: TSetSubmitting, is_dirty = true) => {
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
        setAccountSettings({ ...account_settings, ...value });
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
                    exit_classname='cfd-modal--custom-exit'
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

export default connect(({ modules: { cfd }, ui, client }: RootStore) => ({
    account_settings: client.account_settings,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    getChangeableFields: client.getChangeableFields,
    is_open: cfd.is_cfd_personal_details_modal_visible,
    is_from_mt5_compare_accounts_table: cfd.is_from_mt5_compare_accounts_table,
    landing_company: client.landing_company,
    openPasswordModal: cfd.enableCFDPasswordModal,
    residence_list: client.residence_list,
    setAccountSettings: client.setAccountSettings,
    toggleCompareAccounts: cfd.toggleCompareAccountsModal,
    toggleCFDPersonalDetailsModal: cfd.toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal: cfd.toggleJurisdictionModal,
}))(CFDPersonalDetailsModal);
