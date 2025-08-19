import React from 'react';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikValues } from 'formik';

import {
    Autocomplete,
    AutoHeightWrapper,
    Dropdown,
    FormSubmitButton,
    Icon,
    Loading,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { useResidenceList, useStatesList } from '@deriv/hooks';
import {
    capitalizeFirstLetter,
    CURRENCY_TYPE,
    filterObjProperties,
    formatDate,
    reorderCurrencies,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { InlineMessage, useDevice } from '@deriv-com/ui';

import DateOfBirthField from './date-of-birth-field';
import FormInputField from './form-input-field';
import { ValidationSchema } from './validation';

import './complete-user-profile-modal.scss';

type TAutoComplete = {
    value: string;
    text: string;
};

type TCurrencyFormProps = {
    currency: string;
};

type TPersonalDetailsFormProps = {
    date_of_birth: string;
};

type TCountryandCitizenshipFormProps = {
    citizen: string;
};

type TAddressDetailFormProps = {
    address_line_1: string;
    address_line_2: string;
    address_city: string;
    address_state: string;
    address_postcode: string;
};

type TCompleteUserProfileFormProps = TPersonalDetailsFormProps &
    TCountryandCitizenshipFormProps &
    TAddressDetailFormProps &
    TCurrencyFormProps;

type TCompleteUserProfileProps = {
    account_settings: TCompleteUserProfileFormProps;
    residence: string;
    noCurrency?: boolean;
};

const makeSettingsRequest = (
    values: FormikValues,
    changeable_fields: string[],
    account_settings: TCompleteUserProfileFormProps
) => {
    const request = filterObjProperties(values, changeable_fields);

    if (request.currency) {
        delete request.currency;
    }

    Object.keys(request).forEach(key => {
        if (
            account_settings &&
            account_settings[key as keyof TCompleteUserProfileFormProps] !== undefined &&
            account_settings[key as keyof TCompleteUserProfileFormProps] === request[key]
        ) {
            delete request[key];
        }
    });

    if (request.date_of_birth) {
        request.date_of_birth = formatDate(request.date_of_birth, 'YYYY-MM-DD');
    }

    return request;
};

const CompleteUserProfile = observer(
    ({ account_settings, residence, noCurrency = false }: TCompleteUserProfileProps) => {
        const { client, ui } = useStore();
        const {
            getChangeableFields,
            is_svg,
            upgradeable_currencies: legal_allowed_currencies,
            setAccountCurrency,
            available_crypto_currencies,
            has_fiat,
        } = client;
        const { is_complete_user_profile_modal_open, setShouldShowCompleteUserProfileModal } = ui;
        const { isDesktop } = useDevice();
        const { data: residence_list, isFetched: residence_list_fetched } = useResidenceList();
        const changeable_fields = getChangeableFields();

        const [address_state_to_display, setAddressStateToDisplay] = React.useState('');
        const [citizen_to_display, setCitizenToDisplay] = React.useState('');
        const [submitting_currency, setSubmittingCurrency] = React.useState(false);

        const { data: states_list, isFetched: state_list_fetched } = useStatesList(residence);

        const {
            citizen,
            date_of_birth,
            address_line_1,
            address_line_2,
            address_city,
            address_state,
            address_postcode,
        } = account_settings || {};

        const initial_values: TCompleteUserProfileFormProps = {
            currency: '',
            citizen: citizen || '',
            date_of_birth: date_of_birth || '',
            address_line_1: address_line_1 || '',
            address_line_2: address_line_2 || '',
            address_city: address_city || '',
            address_state: address_state || '',
            address_postcode: address_postcode || '',
        };

        const showAddressDetailsFields = !address_line_1 || !address_city;

        const available_crypto_codes = new Set(available_crypto_currencies.map(c => c.value));

        const crypto = legal_allowed_currencies.filter(
            selected_currency =>
                String(selected_currency.type) === CURRENCY_TYPE.CRYPTO &&
                available_crypto_codes.has(String(selected_currency?.value))
        );

        // Wrapped with String() to avoid type mismatch
        const fiat = legal_allowed_currencies.filter(
            selected_currency => String(selected_currency.type) === CURRENCY_TYPE.FIAT
        );

        const reorderFiat = reorderCurrencies(fiat as keyof typeof reorderCurrencies, CURRENCY_TYPE.FIAT);
        const reorderCrypto = reorderCurrencies(crypto as keyof typeof reorderCurrencies, CURRENCY_TYPE.CRYPTO);

        const currency_list = has_fiat
            ? [...(reorderCrypto || [])]
            : [...(reorderFiat || []), ...(reorderCrypto || [])];

        const reorder_currency_list = (currency_list || []).map(currency => {
            const icon_name = `IcCurrency${capitalizeFirstLetter(currency?.value.toLowerCase())}`;
            return {
                ...currency,
                text: (
                    <div className='complete-user-profile-modal__dropdown-list'>
                        <Icon icon={icon_name} />
                        <Text size='xs'>
                            {currency.name} ({currency.value})
                        </Text>
                    </div>
                ),
            };
        });

        const handleSubmit = async (
            values: TCompleteUserProfileFormProps,
            { setSubmitting, setStatus }: FormikHelpers<TCompleteUserProfileFormProps>
        ) => {
            setSubmitting(true);
            if (values.currency) setSubmittingCurrency(true);

            try {
                const request = makeSettingsRequest(values, changeable_fields, account_settings);
                const data = await WS.setSettings(request);

                if (data?.error) {
                    setStatus({ error_message: data.error?.code });
                    return;
                }

                if (values.currency) {
                    const selected_currency_obj = currency_list.find(curr => curr.value === values.currency);

                    if (!selected_currency_obj) {
                        setStatus({ error_message: 'Missing currency list' });
                        return;
                    }

                    await setAccountCurrency(selected_currency_obj.value);
                }
                setShouldShowCompleteUserProfileModal(false);
            } catch (error) {
                setStatus({ error_message: error.message || 'An error occurred' });
            } finally {
                setSubmittingCurrency(false);
                setSubmitting(false);
            }
        };

        return (
            <Modal
                is_open={is_complete_user_profile_modal_open}
                title={localize('Complete your profile')}
                height='auto'
                width='440px'
                should_header_stick_body={true}
                has_close_icon={false}
                className='complete-user-profile-modal'
            >
                <AutoHeightWrapper default_height={isDesktop ? 625 : 500}>
                    {({ height }) => (
                        <ThemedScrollbars autohide={false} height={height}>
                            <Formik
                                initialValues={initial_values}
                                validateOnMount
                                onSubmit={handleSubmit}
                                validationSchema={ValidationSchema(is_svg, account_settings, noCurrency)}
                                initialStatus={{ error_message: '' }}
                            >
                                {({
                                    handleSubmit,
                                    isSubmitting,
                                    values,
                                    setFieldValue,
                                    handleChange,
                                    setFieldTouched,
                                    isValid,
                                    status,
                                }) => (
                                    <Form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className='complete-user-profile-modal__form'
                                    >
                                        <InlineMessage
                                            variant={status && status.error_message ? 'error' : 'info'}
                                            type='filled'
                                            className='complete-user-profile-modal__bottom-margin'
                                        >
                                            <Text size='xxxs'>
                                                {status && status.error_message ? (
                                                    <Localize i18n_default_text='An error has occurred. Click Submit to try again.' />
                                                ) : (
                                                    <Localize i18n_default_text='To continue trading, provide your additional details below.' />
                                                )}
                                            </Text>
                                        </InlineMessage>
                                        {(noCurrency || submitting_currency) && (
                                            <>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Account currency' />
                                                </Text>
                                                {reorder_currency_list.length > 0 ? (
                                                    <Field name='currency'>
                                                        {({ field }: FieldProps) => (
                                                            <Dropdown
                                                                {...field}
                                                                className='complete-user-profile-modal__bottom-margin-field'
                                                                is_align_text_left
                                                                list={reorder_currency_list}
                                                                placeholder={localize('Select currency*')}
                                                                onChange={(e: {
                                                                    target: { name: string; value: string };
                                                                }) => {
                                                                    setFieldValue('currency', e.target.value, true);
                                                                    handleChange(e);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                ) : (
                                                    <FormInputField
                                                        className='complete-user-profile-modal__bottom-margin'
                                                        name='currency'
                                                        label={localize('Select currency*')}
                                                        placeholder={localize('Select currency*')}
                                                    />
                                                )}
                                            </>
                                        )}
                                        {!date_of_birth && (
                                            <>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Personal details' />
                                                </Text>
                                                <DateOfBirthField
                                                    name='date_of_birth'
                                                    label={localize('Date of birth*')}
                                                    hint={localize('Your date of birth as in your identity document.')}
                                                    portal_id='modal_root'
                                                    data_testid='date_of_birth'
                                                    placeholder={localize('01-07-1999')}
                                                    className='complete-user-profile-modal__bottom-margin-field'
                                                    value={values.date_of_birth}
                                                />
                                            </>
                                        )}
                                        {!citizen && (
                                            <>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Citizenship' />
                                                </Text>
                                                {!residence_list_fetched && (
                                                    <div className='details-form__loader'>
                                                        <Loading is_fullscreen={false} />
                                                    </div>
                                                )}
                                                {residence_list?.length > 0 ? (
                                                    <Field name='citizen'>
                                                        {({ field }: FieldProps) => (
                                                            <>
                                                                {isDesktop ? (
                                                                    <Autocomplete
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        autoComplete='none'
                                                                        type='text'
                                                                        label={localize('Citizenship*')}
                                                                        list_items={residence_list}
                                                                        onItemSelection={({ value, text }) => {
                                                                            setFieldValue('citizen', value, true);
                                                                            setCitizenToDisplay(text);
                                                                        }}
                                                                        list_portal_id='modal_root'
                                                                        hint={localize(
                                                                            'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                                                        )}
                                                                        className='complete-user-profile-modal__bottom-margin-field'
                                                                        value={citizen_to_display || values.citizen}
                                                                        required
                                                                        onChange={e => {
                                                                            if (citizen_to_display) {
                                                                                setCitizenToDisplay('');
                                                                            }
                                                                            setFieldValue('citizen', '', false);
                                                                            field.onChange(e);
                                                                        }}
                                                                        onBlur={e => {
                                                                            if (!e.target.value && values.citizen) {
                                                                                setCitizenToDisplay(
                                                                                    residence_list.find(
                                                                                        item =>
                                                                                            item.value ===
                                                                                            values.citizen
                                                                                    )?.text || values.citizen
                                                                                );
                                                                            }
                                                                            field.onBlur(e);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <SelectNative
                                                                        {...field}
                                                                        placeholder={localize('Citizenship')}
                                                                        label={localize('Citizenship*')}
                                                                        list_items={residence_list}
                                                                        onChange={e => {
                                                                            handleChange(e);
                                                                            setFieldValue(
                                                                                'citizen',
                                                                                e.target.value,
                                                                                true
                                                                            );
                                                                            setCitizenToDisplay(e.target.text);
                                                                        }}
                                                                        hint={localize(
                                                                            'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                                                        )}
                                                                        className='complete-user-profile-modal__bottom-margin-field'
                                                                        required
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </Field>
                                                ) : (
                                                    // Fallback to input field when residence list is empty
                                                    <FormInputField
                                                        className='complete-user-profile-modal__bottom-margin-field'
                                                        name='address_state'
                                                        label={localize('Citizenship*')}
                                                        placeholder={localize('Citizenship')}
                                                        hint={localize(
                                                            'Select your citizenship/nationality as it appears on your passport or other government-issued ID'
                                                        )}
                                                        required
                                                    />
                                                )}
                                            </>
                                        )}
                                        {showAddressDetailsFields && (
                                            <>
                                                <Text
                                                    weight='bold'
                                                    className='complete-user-profile-modal__heading complete-user-profile-modal__bottom-margin'
                                                >
                                                    <Localize i18n_default_text='Address details' />
                                                </Text>
                                                <div>
                                                    {!address_line_1 && (
                                                        <>
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
                                                        </>
                                                    )}
                                                    {!address_city && (
                                                        <FormInputField
                                                            name='address_city'
                                                            required
                                                            label={localize('Town/City*')}
                                                            placeholder={localize('Town/City')}
                                                        />
                                                    )}
                                                    {!address_state && (
                                                        <>
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
                                                                                    onItemSelection={({
                                                                                        value,
                                                                                        text,
                                                                                    }: TAutoComplete) => {
                                                                                        setFieldValue(
                                                                                            'address_state',
                                                                                            value ? text : '',
                                                                                            true
                                                                                        );
                                                                                        setAddressStateToDisplay('');
                                                                                    }}
                                                                                    list_portal_id='modal_root'
                                                                                    className='complete-user-profile-modal__bottom-margin'
                                                                                />
                                                                            ) : (
                                                                                <SelectNative
                                                                                    placeholder={localize(
                                                                                        'Please select'
                                                                                    )}
                                                                                    label={localize('State/Province')}
                                                                                    value={
                                                                                        address_state_to_display ||
                                                                                        values.address_state
                                                                                    }
                                                                                    list_items={states_list}
                                                                                    use_text={true}
                                                                                    onChange={(e: {
                                                                                        target: { value: string };
                                                                                    }) => {
                                                                                        setFieldValue(
                                                                                            'address_state',
                                                                                            e.target.value,
                                                                                            true
                                                                                        );
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
                                                        </>
                                                    )}
                                                    {!address_postcode && (
                                                        <FormInputField
                                                            name='address_postcode'
                                                            label={localize('Postal/ZIP Code')}
                                                            placeholder={localize('Postal/ZIP Code')}
                                                            onChange={e => {
                                                                setFieldTouched('address_postcode', true);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        <Modal.Footer className='complete-user-profile-modal__footer'>
                                            <FormSubmitButton
                                                label={localize('Submit')}
                                                disabled={isSubmitting || !isValid}
                                                is_loading={isSubmitting}
                                                className='complete-user-profile-modal__submit-button'
                                            />
                                        </Modal.Footer>
                                    </Form>
                                )}
                            </Formik>
                        </ThemedScrollbars>
                    )}
                </AutoHeightWrapper>
            </Modal>
        );
    }
);

export default CompleteUserProfile;
