import React from 'react';
import { Field, FieldProps, Form, Formik, FormikHandlers, FormikHelpers, FormikState, FormikValues } from 'formik';

import {
    Autocomplete,
    FormSubmitButton,
    Loading,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { useResidenceList, useStatesList } from '@deriv/hooks';
import { filterObjProperties, formatDate, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { InlineMessage, useDevice } from '@deriv-com/ui';

import DateOfBirthField from './date-of-birth-field';
import FormInputField from './form-input-field';

import './complete-user-profile-modal.scss';

type TAutoComplete = {
    value: string;
    text: string;
};

type TPersonalDetailsFormProps = {
    date_of_birth: string;
};

type CountryandCitizenshipFormProps = {
    residence: string;
    citizen: string;
};

type TAddressDetailFormProps = {
    address_line_1: string;
    address_line_2?: string;
    address_city: string;
    address_state?: string;
    address_postcode?: string;
};

type TCompleteUserProfileFormProps = TPersonalDetailsFormProps &
    CountryandCitizenshipFormProps &
    TAddressDetailFormProps;

const CompleteUserProfile = observer(() => {
    const { client, ui } = useStore();
    const { residence, account_settings, getChangeableFields } = client;
    const { is_complete_user_profile_modal_open, setShouldShowCompleteUserProfileModal } = ui;
    const { isDesktop } = useDevice();
    const { data: residence_list, isFetched: residence_list_fetched } = useResidenceList();
    const changeable_fields = getChangeableFields();

    const [address_state_to_display, setAddressStateToDisplay] = React.useState('');
    const [citizen_to_display, setCitizenToDisplay] = React.useState('');

    const { data: states_list, isFetched: state_list_fetched } = useStatesList(residence);

    const makeSettingsRequest = (values: FormikValues, changeable_fields: string[]) => {
        const request = filterObjProperties(values, changeable_fields);

        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }
        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = formatDate(request.date_of_birth, 'YYYY-MM-DD');
        }

        return request;
    };

    const handleSubmit = async (
        values: TCompleteUserProfileFormProps,
        { setSubmitting, setStatus }: FormikHelpers<TCompleteUserProfileFormProps>
    ) => {
        setSubmitting(true);

        const request = makeSettingsRequest(values, changeable_fields);

        const data = await WS.setSettings(request);

        if (data?.error) {
            setStatus({ error_message: data.error?.code });
            setSubmitting(false);
            return;
        }
        setSubmitting(false);
        setShouldShowCompleteUserProfileModal(false);
    };

    const initial_values: TCompleteUserProfileFormProps = {
        residence: residence || '',
        citizen: account_settings?.citizen || '',
        date_of_birth: formatDate(account_settings.date_of_birth, 'YYYY-MM-DD') || '',
        address_line_1: account_settings?.address_line_1 || '',
        address_city: account_settings?.address_city || '',
        address_state: account_settings?.address_state || '',
        address_postcode: account_settings?.address_postcode || '',
    };

    return (
        <Modal
            is_open={true}
            title='Complete your profile'
            height='640px'
            width='440px'
            should_header_stick_body
            has_close_icon={false}
            className='complete-user-profile-modal'
        >
            <ThemedScrollbars autohide={false}>
                <Formik initialValues={initial_values} validateOnMount onSubmit={handleSubmit}>
                    {({
                        handleSubmit,
                        isSubmitting,
                        values,
                        setFieldValue,
                        handleChange,
                        setFieldTouched,
                    }: FormikHandlers &
                        FormikHelpers<TCompleteUserProfileFormProps> &
                        FormikState<TCompleteUserProfileFormProps>) => (
                        <Form onSubmit={handleSubmit} noValidate className='complete-user-profile-modal__form'>
                            <InlineMessage
                                variant='info'
                                type='filled'
                                className='complete-user-profile-modal__bottom-margin'
                            >
                                <Localize i18n_default_text='To continue trading, provide your additional details below.' />
                            </InlineMessage>
                            <Text
                                weight='bold'
                                className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                            >
                                <Localize i18n_default_text='Personal Details' />
                            </Text>
                            <DateOfBirthField
                                name='date_of_birth'
                                label={localize('Date of birth')}
                                hint={localize('Your date of birth as in your identity document.')}
                                portal_id='modal_root'
                                data_testid='date_of_birth'
                                placeholder={localize('01-07-1999')}
                                className='complete-user-profile-modal__bottom-margin-field'
                                value={values.date_of_birth}
                            />
                            <Text
                                weight='bold'
                                className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                            >
                                <Localize i18n_default_text='Country and citizenship' />
                            </Text>
                            {!residence_list_fetched && (
                                <div className='details-form__loader'>
                                    <Loading is_fullscreen={false} />
                                </div>
                            )}
                            {residence_list?.length > 0 ? (
                                <Field name='residence'>
                                    {({ field }: FieldProps) => (
                                        <>
                                            {isDesktop ? (
                                                <Autocomplete
                                                    {...field}
                                                    label={localize('Country of residence')}
                                                    data-lpignore='true'
                                                    autoComplete='off'
                                                    list_items={residence_list}
                                                    onItemSelection={({ text }: TAutoComplete) => {
                                                        setFieldValue('residence', text, true);
                                                    }}
                                                    list_portal_id='modal_root'
                                                    hint={localize('Select the country where you currently live.')}
                                                    className='complete-user-profile-modal__bottom-margin-field'
                                                    value={values.residence}
                                                />
                                            ) : (
                                                <SelectNative
                                                    placeholder={localize('Please select')}
                                                    label={localize('Country of residence')}
                                                    value={values.residence}
                                                    list_items={residence_list}
                                                    use_text={true}
                                                    onChange={({ text }: TAutoComplete) => {
                                                        setFieldValue('residence', text, true);
                                                    }}
                                                    hint={localize('Select the country where you currently live.')}
                                                    className='complete-user-profile-modal__bottom-margin-field'
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                            ) : (
                                // Fallback to input field when states list is empty / unavailable for country
                                <FormInputField
                                    className='complete-user-profile-modal__bottom-margin'
                                    name='address_state'
                                    label={localize('Country of residence')}
                                    placeholder={localize('Country of residence')}
                                    hint={localize('Select the country where you currently live.')}
                                />
                            )}
                            {residence_list?.length > 0 ? (
                                <Field name='citizen'>
                                    {({ field }: FieldProps) => (
                                        <>
                                            {isDesktop ? (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    label={localize('Citizenship')}
                                                    list_items={residence_list}
                                                    onItemSelection={({ value, text }: TAutoComplete) => {
                                                        setFieldValue('citizen', value, true);
                                                        setCitizenToDisplay(text);
                                                    }}
                                                    list_portal_id='modal_root'
                                                    hint={localize(
                                                        'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                                    )}
                                                    className='complete-user-profile-modal__bottom-margin-field'
                                                    value={citizen_to_display}
                                                />
                                            ) : (
                                                <SelectNative
                                                    placeholder={localize('Please select')}
                                                    label={localize('Citizenship')}
                                                    value={citizen_to_display || values.citizen}
                                                    list_items={residence_list}
                                                    use_text={true}
                                                    onChange={({ value, text }: TAutoComplete) => {
                                                        setFieldValue('citizen', value, true);
                                                        setCitizenToDisplay(text);
                                                    }}
                                                    hint={localize(
                                                        'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                                    )}
                                                    className='complete-user-profile-modal__bottom-margin-field'
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                            ) : (
                                // Fallback to input field when states list is empty / unavailable for country
                                <FormInputField
                                    className='complete-user-profile-modal__bottom-margin-field'
                                    name='address_state'
                                    label={localize('Citizenship')}
                                    placeholder={localize('Citizenship')}
                                    hint={localize(
                                        'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                    )}
                                />
                            )}
                            <Text
                                weight='bold'
                                className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                            >
                                <Localize i18n_default_text='Address Details' />
                            </Text>
                            <div>
                                <FormInputField
                                    name='address_line_1'
                                    required
                                    label={localize('First line of address*')}
                                    maxLength={255}
                                    placeholder={localize('First line of address')}
                                />
                                <FormInputField
                                    name='address_line_2'
                                    label={localize('Second line of address')}
                                    maxLength={255}
                                    placeholder={localize('Second line of address')}
                                />
                                <FormInputField
                                    name='address_city'
                                    required
                                    label={localize('Town/City*')}
                                    placeholder={localize('Town/City')}
                                />
                                {!state_list_fetched && (
                                    <div className='details-form__loader'>
                                        <Loading is_fullscreen={false} />
                                    </div>
                                )}
                                {states_list?.length > 0 ? (
                                    <Field name='address_state'>
                                        {({ field }: FieldProps) => (
                                            <>
                                                {isDesktop ? (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        autoComplete='off'
                                                        label={localize('State/Province')}
                                                        list_items={states_list}
                                                        onItemSelection={({ value, text }: TAutoComplete) => {
                                                            setFieldValue('address_state', value ? text : '', true);
                                                            setAddressStateToDisplay('');
                                                        }}
                                                        list_portal_id='modal_root'
                                                        className='complete-user-profile-modal__bottom-margin'
                                                    />
                                                ) : (
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        label={localize('State/Province')}
                                                        value={address_state_to_display || values.address_state}
                                                        list_items={states_list}
                                                        use_text={true}
                                                        onChange={(e: { target: { value: string } }) => {
                                                            setFieldValue('address_state', e.target.value, true);
                                                            setAddressStateToDisplay('');
                                                        }}
                                                        className='complete-user-profile-modal__bottom-margin'
                                                    />
                                                )}
                                            </>
                                        )}
                                    </Field>
                                ) : (
                                    // Fallback to input field when states list is empty / unavailable for country
                                    <FormInputField
                                        name='address_state'
                                        label={localize('State/Province')}
                                        placeholder={localize('State/Province')}
                                        className='complete-user-profile-modal__bottom-margin'
                                    />
                                )}
                                <FormInputField
                                    name='address_postcode'
                                    label={localize('Postal/ZIP Code')}
                                    placeholder={localize('Postal/ZIP Code')}
                                    onChange={e => {
                                        setFieldTouched('address_postcode', true);
                                        handleChange(e);
                                    }}
                                />
                            </div>
                            <Modal.Footer>
                                <FormSubmitButton label={localize('Submit')} disabled={isSubmitting} />
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </ThemedScrollbars>
        </Modal>
    );
});

export default CompleteUserProfile;
