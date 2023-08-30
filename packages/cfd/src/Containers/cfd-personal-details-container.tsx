import React from 'react';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TCFDPersonalDetailsContainerProps } from './props.types';
import CFDPersonalDetailsForm from '../Components/cfd-personal-details-form';
import { getPropertyValue, isDesktop, WS } from '@deriv/shared';
import { GetSettings } from '@deriv/api-types';
import { observer, useStore } from '@deriv/stores';

type TFormValues = { [key: string]: string };
type TSetSubmitting = (isSubmitting: boolean) => void;

const CFDPersonalDetailsContainer = observer(({ onSubmit }: TCFDPersonalDetailsContainerProps) => {
    const { client } = useStore();

    const { account_settings, getChangeableFields, landing_company, residence_list, setAccountSettings } = client;

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
        setIsLoading(true);
        initiatePersonalDetails().then(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const transform = (value: unknown) => {
        const [result] = residence_list?.filter(item => item.value === value);
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
        setAccountSettings({ ...account_settings, ...value });
        onSubmit(index, value);
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
                    form_error={form_error}
                    index={2}
                    is_loading={is_loading}
                    landing_company={landing_company}
                    onSubmit={updateValue}
                    residence_list={residence_list}
                    changeable_fields={getChangeableFields()}
                    value={form_values}
                />
            </div>
        </Div100vhContainer>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>{getPersonalDetailsForm()}</DesktopWrapper>
            <MobileWrapper>{getPersonalDetailsForm()}</MobileWrapper>
        </React.Fragment>
    );
});

export default CFDPersonalDetailsContainer;
