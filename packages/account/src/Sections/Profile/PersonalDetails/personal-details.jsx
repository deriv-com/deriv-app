import classNames from 'classnames';
import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
    Autocomplete,
    Button,
    Checkbox,
    DateOfBirthPicker,
    DesktopWrapper,
    Dropdown,
    FormSubmitErrorMessage,
    HintBox,
    Input,
    Loading,
    MobileWrapper,
    SelectNative,
    Text,
    useStateCallback,
} from '@deriv/components';
import {
    PlatformContext,
    WS,
    filterObjProperties,
    getBrandWebsiteName,
    getLocation,
    isMobile,
    regex_checks,
    removeObjProperties,
    routes,
    toMoment,
    useIsMounted,
    validAddress,
    validLength,
    validLetterSymbol,
    validName,
    validPhone,
    validPostCode,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormBodySection from 'Components/form-body-section';
import FormFooter from 'Components/form-footer';
import FormSubHeader from 'Components/form-sub-header';
import LeaveConfirm from 'Components/leave-confirm';
import LoadErrorMessage from 'Components/load-error-message';
import POAAddressMismatchHintBox from 'Components/poa-address-mismatch-hint-box';
import { connect } from 'Stores/connect';
import { getEmploymentStatusList } from 'Sections/Assessment/FinancialAssessment/financial-information-list';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (/^\s+$/.test(value) || (!fn(value) && !errors[field] && err_msg !== true)) errors[field] = err_msg;
    });
};

const InputGroup = ({ children, className }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_appstore) {
        return React.Children.map(children, child => <fieldset className='account-form__fieldset'>{child}</fieldset>);
    }
    return (
        <fieldset className='account-form__fieldset'>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const TaxResidenceSelect = ({ field, errors, setFieldValue, values, is_changeable, residence_list }) => (
    <React.Fragment>
        <DesktopWrapper>
            <Autocomplete
                {...field}
                data-lpignore='true'
                autoComplete='new-password' // prevent chrome autocomplete
                type='text'
                label={localize('Tax residence*')}
                error={errors.tax_residence}
                disabled={!is_changeable}
                id='tax_residence'
                list_items={residence_list}
                onItemSelection={({ value, text }) => setFieldValue('tax_residence', value ? text : '', true)}
                required
            />
        </DesktopWrapper>
        <MobileWrapper>
            <SelectNative
                placeholder={localize('Tax residence*')}
                label={localize('Tax residence*')}
                value={values.tax_residence}
                list_items={residence_list}
                id={'tax_residence_mobile'}
                error={errors.tax_residence}
                disabled={!is_changeable}
                use_text={true}
                onChange={e => setFieldValue('tax_residence', e.target.value, true)}
                required
            />
        </MobileWrapper>
    </React.Fragment>
);

export const PersonalDetailsForm = ({
    authentication_status,
    is_eu,
    is_mf,
    is_uk,
    is_svg,
    is_virtual,
    residence_list,
    states_list,
    current_landing_company,
    refreshNotifications,
    showPOAAddressMismatchSuccessNotification,
    showPOAAddressMismatchFailureNotification,
    Notifications,
    fetchResidenceList,
    fetchStatesList,
    has_residence,
    account_settings,
    getChangeableFields,
    history,
    is_social_signup,
    updateAccountStatus,
    has_poa_address_mismatch,
    is_language_changing,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);

    const [is_state_loading, setIsStateLoading] = useStateCallback(false);

    const [is_btn_loading, setIsBtnLoading] = React.useState(false);

    const [is_submit_success, setIsSubmitSuccess] = useStateCallback(false);

    const [rest_state, setRestState] = React.useState({
        show_form: true,
        errors: false,
        form_initial_values: {},
    });

    const [start_on_submit_timeout, setStartOnSubmitTimeout] = React.useState({
        is_timeout_started: false,
        timeout_callback: null,
    });

    const { is_appstore } = React.useContext(PlatformContext);

    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            const getSettings = async () => {
                // waits for residence to be populated
                await WS.wait('get_settings');

                fetchResidenceList();

                if (has_residence) {
                    if (!is_language_changing) {
                        setIsStateLoading(true, () => {
                            fetchStatesList().then(() => {
                                setIsStateLoading(false);
                            });
                        });
                    }
                }
            };
            getSettings();
        }
        initializeFormValues();
    }, [account_settings, is_eu, is_mf, is_social_signup]);

    React.useEffect(() => {
        let timeout_id;
        if (start_on_submit_timeout.is_timeout_started) {
            timeout_id = setTimeout(() => {
                setIsSubmitSuccess(false, start_on_submit_timeout.timeout_callback);
            }, 10000);
        }

        return () => {
            clearTimeout(timeout_id);
        };
    }, [start_on_submit_timeout.is_timeout_started]);

    const makeSettingsRequest = settings => {
        if (is_virtual) return { email_consent: +settings.email_consent };
        const request = filterObjProperties(settings, [...rest_state.changeable_fields]);

        request.email_consent = +request.email_consent; // checkbox is boolean but api expects number (1 or 0)
        if (
            !!request.request_professional_status &&
            !!rest_state.form_initial_values.request_professional_status === false
        ) {
            // We can just send the value of request_professional_status once. Also backend just accepts true value for this field!
            request.request_professional_status = +request.request_professional_status; // checkbox is boolean but api expects number (1 or 0)
        } else {
            // if it is already active we have to exclude it from request. otherwise backend returns error!
            delete request.request_professional_status;
        }

        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }

        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        if (is_mf) {
            if (request.tax_residence) {
                request.tax_residence = getLocation(residence_list, request.tax_residence, 'value');
            }

            if (request.tax_identification_number) {
                request.tax_identification_number = request.tax_identification_number.trim();
            }
        }

        if (request.citizen) {
            request.citizen = getLocation(residence_list, request.citizen, 'value');
        }

        if (request.place_of_birth) {
            request.place_of_birth = getLocation(residence_list, request.place_of_birth, 'value');
        } else {
            delete request.place_of_birth;
        }

        if (request.address_state) {
            request.address_state = states_list.length
                ? getLocation(states_list, request.address_state, 'value')
                : request.address_state;
        }

        return request;
    };

    const onSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        const request = makeSettingsRequest(values);
        setIsBtnLoading(true);
        const data = await WS.setSettings(request);

        if (data.error) {
            setStatus({ msg: data.error.message });
            setIsBtnLoading(false);
            setSubmitting(false);
        } else {
            // Adding a delay to show the notification after the page reload
            setTimeout(() => {
                if (data.set_settings.notification) {
                    showPOAAddressMismatchSuccessNotification();
                } else if (has_poa_address_mismatch) {
                    showPOAAddressMismatchFailureNotification();
                }
            }, 2000);

            // force request to update settings cache since settings have been updated
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            // Fetches the status of the account after update
            updateAccountStatus();
            setRestState({ ...rest_state, ...response.get_settings });
            setIsLoading(false);
            refreshNotifications();
            setIsBtnLoading(false);
            setIsSubmitSuccess(true);
            setStartOnSubmitTimeout({
                is_timeout_started: true,
                timeout_callback: () => {
                    setSubmitting(false);
                },
            });
            // redirection back based on 'from' param in query string
            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            if (url_params.get('from')) {
                history.push(routes[url_params.get('from')]);
            }
        }
    };

    // TODO: standardize validations and refactor this
    const validateFields = values => {
        setIsSubmitSuccess(false);
        const errors = {};
        const validateValues = validate(errors, values);

        if (is_virtual) return errors;

        const required_fields = ['first_name', 'last_name', 'phone', 'address_line_1', 'address_city'];
        if (is_eu) {
            required_fields.push('citizen');
        }
        if (is_mf) {
            const required_tax_fields = ['tax_residence', 'tax_identification_number', 'employment_status'];
            required_fields.push(...required_tax_fields);
        }

        validateValues(val => val, required_fields, localize('This field is required'));

        const residence_fields = ['citizen'];
        const validateResidence = val => getLocation(residence_list, val, 'value');
        validateValues(validateResidence, residence_fields, true);

        const min_tax_identification_number = 0;
        const max_tax_identification_number = 25;
        if (values.tax_identification_number) {
            if (
                values.tax_identification_number &&
                !/^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/.test(values.tax_identification_number)
            ) {
                errors.tax_identification_number = localize(
                    'Only letters, numbers, space, hyphen, period, and forward slash are allowed.'
                );
            }
            if (!/^[a-zA-Z0-9].*$/.test(values.tax_identification_number.charAt(0))) {
                errors.tax_identification_number = localize(
                    'Should start with letter or number and may contain a hyphen, period and slash.'
                );
            }
            if (
                !validLength(values.tax_identification_number.trim(), {
                    min: min_tax_identification_number,
                    max: max_tax_identification_number,
                })
            ) {
                errors.tax_identification_number = localize(
                    "Tax Identification Number can't be longer than 25 characters."
                );
            }
        }

        const min_name = 2;
        const max_name = 50;
        const validateName = (name, field) => {
            if (name) {
                if (!validLength(name.trim(), { min: min_name, max: max_name })) {
                    errors[field] = localize('You should enter 2-50 characters.');
                } else if (!validName(name)) {
                    // validName() has the exact regex used at the backend for allowing non digit characters including accented unicode characters.
                    // two or more space between name not allowed.
                    errors[field] = localize('Letters, spaces, periods, hyphens, apostrophes only.');
                }
            }
        };
        validateName(values.first_name, 'first_name');
        validateName(values.last_name, 'last_name');

        if (values.phone) {
            // minimum characters required is 9 numbers (excluding +- signs or space)
            const min_phone_number = 9;
            const max_phone_number = 35;
            // phone_trim uses regex that trims non-digits
            const phone_trim = values.phone.replace(/\D/g, '');
            const phone_error_message = localize('Please enter a valid phone number (e.g. +15417541234).');

            if (!validLength(phone_trim, { min: min_phone_number, max: max_phone_number })) {
                errors.phone = localize('You should enter {{min}}-{{max}} numbers.', {
                    min: min_phone_number,
                    max: max_phone_number,
                });
            } else if (!validPhone(values.phone)) {
                errors.phone = phone_error_message;
            }
        }

        const address_line_1_validation_result = validAddress(values.address_line_1, { is_required: true });
        if (!address_line_1_validation_result.is_ok) {
            errors.address_line_1 = address_line_1_validation_result.message;
        }
        const address_line_2_validation_result = validAddress(values.address_line_2);
        if (!address_line_2_validation_result.is_ok) {
            errors.address_line_2 = address_line_2_validation_result.message;
        }

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = localize('Only letters, space, hyphen, period, and apostrophe are allowed.');
        }

        const state_is_input_element = values.address_state && !states_list.length;
        if (state_is_input_element) {
            if (!validLength(values.address_state, { min: 0, max: 35 })) {
                errors.address_state = localize('You should enter 0-35 characters.');
            } else if (!regex_checks.address_details.address_state.test(values.address_state)) {
                errors.address_state = localize('State is not in a proper format');
            }
        }

        // Not allowing Jersey postcodes with a UK residence.
        if (
            !regex_checks.address_details.non_jersey_postcode.test(values.address_postcode) &&
            (is_uk || values.citizen === 'United Kingdom')
        ) {
            errors.address_postcode = localize('Our accounts and services are unavailable for the Jersey postal code');
        }

        if (values.address_postcode) {
            if (!validLength(values.address_postcode, { min: 0, max: 20 })) {
                errors.address_postcode = localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('postal/ZIP code'),
                    max_number: 20,
                    interpolation: { escapeValue: false },
                });
            } else if (!validPostCode(values.address_postcode)) {
                errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
            }
        }

        setRestState({ ...rest_state, errors: Object.keys(errors).length > 0 });

        return errors;
    };

    const getWarningMessages = values => {
        const warnings = {};
        const active_errors = rest_state.errors;

        const filter_tin_regex = residence_list.filter(residence => {
            return residence.text === values.tax_residence && residence.tin_format;
        });

        const tin_regex = filter_tin_regex[0]?.tin_format?.[0];
        const test_tin = new RegExp(tin_regex).test(values.tax_identification_number);
        const valid_country_tin = tin_regex ? test_tin : true;

        if (!active_errors) {
            if (values.tax_identification_number) {
                if (!valid_country_tin) {
                    warnings.tax_identification_number = localize(
                        'This Tax Identification Number (TIN) is invalid. You may continue using it, but to facilitate future payment processes, valid tax information will be required.'
                    );
                }
            }
        }
        return warnings;
    };

    const showForm = show_form => setRestState({ show_form });

    const isChangeableField = name => {
        return rest_state.changeable_fields.some(field => field === name);
    };

    const initializeFormValues = () => {
        WS.wait('landing_company', 'get_account_status', 'get_settings').then(() => {
            // Convert to boolean
            account_settings.email_consent = !!account_settings.email_consent;
            const hidden_settings = [
                'account_opening_reason',
                'allow_copiers',
                !is_mf && 'tax_residence',
                !is_mf && 'tax_identification_number',
                !is_mf && 'employment_status',
                'client_tnc_status',
                'country_code',
                'has_secret_answer',
                'is_authenticated_payment_agent',
                'user_hash',
                'country',
                (!is_appstore || !is_eu) && 'salutation',
                'immutable_fields',
            ];
            const form_initial_values = removeObjProperties(hidden_settings, account_settings);
            setRestState({
                ...rest_state,
                changeable_fields: is_virtual ? [] : getChangeableFields(),
                form_initial_values,
            });
            setIsLoading(false);
        });
    };

    const salutation_list = [
        { text: localize('Mr'), value: 'Mr' },
        { text: localize('Mrs'), value: 'Mrs' },
        { text: localize('Ms'), value: 'Ms' },
        { text: localize('Miss'), value: 'Miss' },
    ];

    const {
        form_initial_values: { ...form_initial_values },
        api_error,
        show_form,
    } = rest_state;

    if (api_error) return <LoadErrorMessage error_message={api_error} />;

    if (is_loading || is_state_loading || !residence_list.length) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    form_initial_values.citizen = form_initial_values.citizen
        ? getLocation(residence_list, form_initial_values.citizen, 'text')
        : '';
    form_initial_values.place_of_birth = form_initial_values.place_of_birth
        ? getLocation(residence_list, form_initial_values.place_of_birth, 'text')
        : '';
    if (form_initial_values.address_state) {
        form_initial_values.address_state = states_list.length
            ? getLocation(states_list, form_initial_values.address_state, 'text')
            : form_initial_values.address_state;
    } else {
        form_initial_values.address_state = '';
    }
    if (is_mf) {
        if (form_initial_values.tax_residence) {
            const is_single_tax_value = form_initial_values.tax_residence.indexOf(',') < 0;
            // if there's only one tax residence set, show it in drop-down
            if (is_single_tax_value) {
                form_initial_values.tax_residence = getLocation(
                    residence_list,
                    form_initial_values.tax_residence,
                    'text'
                );
            } else if (isChangeableField('tax_residence')) {
                // if there are multiple tax residences and user is allowed to update it
                // select the first tax residence in drop-down
                const first_tax_residence = form_initial_values.tax_residence.split(',')[0];
                form_initial_values.tax_residence = getLocation(residence_list, first_tax_residence, 'text');
            } else {
                // otherwise show all tax residences in a disabled input field
                const tax_residences = [];
                form_initial_values.tax_residence.split(',').forEach(residence => {
                    tax_residences.push(getLocation(residence_list, residence, 'text'));
                });
                form_initial_values.tax_residence = tax_residences;
            }
        } else {
            form_initial_values.tax_residence = '';
        }
        if (!form_initial_values.tax_identification_number) form_initial_values.tax_identification_number = '';
        if (!form_initial_values.employment_status) form_initial_values.employment_status = '';
    }

    const is_poa_verified = authentication_status?.document_status === 'verified';
    const is_poi_verified = authentication_status?.identity_status === 'verified';

    const is_account_verified = is_poa_verified && is_poi_verified;

    //Generate Redirection Link to user based on verifiction status
    const getRedirectionLink = () => {
        if (!is_poi_verified) {
            return '/account/proof-of-identity';
        } else if (!is_poa_verified) {
            return '/account/proof-of-address';
        }
        return null;
    };

    return (
        <Formik initialValues={form_initial_values} enableReinitialize onSubmit={onSubmit} validate={validateFields}>
            {({
                values,
                errors,
                status,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
                setTouched,
                dirty,
            }) => (
                <>
                    {Notifications && <Notifications />}
                    <LeaveConfirm onDirty={isMobile() ? showForm : null} />
                    {show_form && (
                        <form
                            noValidate
                            className={classNames('account-form account-form__personal-details', {
                                'account-form account-form__personal-details--dashboard': is_appstore,
                            })}
                            onSubmit={handleSubmit}
                        >
                            <FormBody scroll_offset={isMobile() ? '199px' : '80px'}>
                                <FormSubHeader title={localize('Details')} />
                                {!is_virtual && (
                                    <React.Fragment>
                                        <FormBodySection
                                            has_side_note={is_appstore}
                                            side_note={localize(
                                                'We use the information you give us only for verification purposes. All information is kept confidential.'
                                            )}
                                        >
                                            {is_appstore && is_eu && (
                                                <fieldset className='account-form__fieldset'>
                                                    <DesktopWrapper>
                                                        <Field name='salutation'>
                                                            {({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={localize('Title*')}
                                                                    error={errors.salutation}
                                                                    list_items={salutation_list}
                                                                    onItemSelection={({ value, text }) =>
                                                                        setFieldValue(
                                                                            'salutation',
                                                                            value ? text : '',
                                                                            true
                                                                        )
                                                                    }
                                                                    id={'salutation'}
                                                                    disabled={!isChangeableField('salutation')}
                                                                />
                                                            )}
                                                        </Field>
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            label={localize('Title')}
                                                            value={values.salutation}
                                                            list_items={salutation_list}
                                                            use_text={true}
                                                            error={errors.salutation}
                                                            onChange={e =>
                                                                setFieldValue('salutation', e.target.value, true)
                                                            }
                                                            disabled={!isChangeableField('salutation')}
                                                            id={'salutation_mobile'}
                                                        />
                                                    </MobileWrapper>
                                                </fieldset>
                                            )}
                                            <DesktopWrapper>
                                                <InputGroup className='account-form__fieldset--2-cols'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='first_name'
                                                        label={localize('First name*')}
                                                        value={values.first_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!isChangeableField('first_name')}
                                                        error={errors.first_name}
                                                        id={'first_name'}
                                                    />
                                                    <Input
                                                        id={'last_name'}
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='last_name'
                                                        label={localize('Last name*')}
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!isChangeableField('last_name')}
                                                        error={errors.last_name}
                                                    />
                                                </InputGroup>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='first_name'
                                                        id='first_name_mobile'
                                                        label={localize('First name*')}
                                                        value={values.first_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!isChangeableField('first_name')}
                                                        error={errors.first_name}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='last_name'
                                                        id='last_name_mobile'
                                                        label={localize('Last name*')}
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!isChangeableField('last_name')}
                                                        error={errors.last_name}
                                                    />
                                                </fieldset>
                                            </MobileWrapper>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Field name='place_of_birth'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                type='text'
                                                                label={
                                                                    is_svg
                                                                        ? localize('Place of birth')
                                                                        : localize('Place of birth*')
                                                                }
                                                                error={errors.place_of_birth}
                                                                id='birth_place'
                                                                required={!is_svg}
                                                                disabled={!isChangeableField('place_of_birth')}
                                                                list_items={residence_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue(
                                                                        'place_of_birth',
                                                                        value ? text : '',
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        label={
                                                            is_svg
                                                                ? localize('Place of birth')
                                                                : localize('Place of birth*')
                                                        }
                                                        required={!is_svg}
                                                        disabled={!isChangeableField('place_of_birth')}
                                                        value={values.place_of_birth}
                                                        list_items={residence_list}
                                                        use_text={true}
                                                        error={errors.place_of_birth}
                                                        onChange={e =>
                                                            setFieldValue('place_of_birth', e.target.value, true)
                                                        }
                                                        id='birth_place_mobile'
                                                        should_hide_disabled_options={false}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DateOfBirthPicker
                                                    name='date_of_birth'
                                                    label={localize('Date of birth*')}
                                                    error={errors.date_of_birth}
                                                    onBlur={() => setTouched({ date_of_birth: true })}
                                                    onChange={({ target }) =>
                                                        setFieldValue(
                                                            'date_of_birth',
                                                            target?.value
                                                                ? toMoment(target.value).format('YYYY-MM-DD')
                                                                : '',
                                                            true
                                                        )
                                                    }
                                                    id={'birth_day'}
                                                    disabled={!isChangeableField('date_of_birth')}
                                                    value={values.date_of_birth}
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Field name='citizen'>
                                                        {({ field }) => (
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                type='text'
                                                                label={
                                                                    is_eu
                                                                        ? localize('Citizenship*')
                                                                        : localize('Citizenship')
                                                                }
                                                                error={errors.citizen}
                                                                disabled={!isChangeableField('citizen')}
                                                                list_items={residence_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue('citizen', value ? text : '', true)
                                                                }
                                                                id={'password'}
                                                                required={is_eu}
                                                            />
                                                        )}
                                                    </Field>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            label={
                                                                is_eu
                                                                    ? localize('Citizenship*')
                                                                    : localize('Citizenship')
                                                            }
                                                            id={'citizen_ship'}
                                                            required={is_eu}
                                                            disabled={!isChangeableField('citizen')}
                                                            value={values.citizen}
                                                            list_items={residence_list}
                                                            error={errors.citizen}
                                                            use_text={true}
                                                            onChange={e =>
                                                                setFieldValue('citizen', e.target.value, true)
                                                            }
                                                            should_hide_disabled_options={false}
                                                        />
                                                    </MobileWrapper>
                                                </MobileWrapper>
                                            </fieldset>
                                        </FormBodySection>
                                    </React.Fragment>
                                )}
                                <FormBodySection has_side_note={is_appstore}>
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='residence'
                                            id={'residence'}
                                            label={localize('Country of residence*')}
                                            value={values.residence}
                                            required
                                            disabled={!isChangeableField('residence')}
                                            error={errors.residence}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                    {is_social_signup && (
                                        <fieldset className='account-form__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='email'
                                                id={'email'}
                                                label={localize('Email address*')}
                                                value={values.email}
                                                required
                                                disabled={!isChangeableField('email')}
                                                error={errors.email}
                                                onChange={handleChange}
                                            />
                                        </fieldset>
                                    )}
                                </FormBodySection>
                                {!is_virtual && (
                                    <React.Fragment>
                                        <FormBodySection has_side_note={is_appstore}>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='phone'
                                                    id={'phone'}
                                                    label={localize('Phone number*')}
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    error={errors.phone}
                                                />
                                            </fieldset>
                                        </FormBodySection>
                                    </React.Fragment>
                                )}
                                <React.Fragment>
                                    {is_mf && (
                                        <React.Fragment>
                                            <FormSubHeader title={localize('Tax information')} />
                                            <FormBodySection
                                                has_side_note={is_appstore}
                                                side_note={localize(
                                                    'We’re legally obliged to ask for your tax information.'
                                                )}
                                            >
                                                {'tax_residence' in values && (
                                                    <fieldset className='account-form__fieldset'>
                                                        <Field name='tax_residence'>
                                                            {({ field }) => (
                                                                <React.Fragment>
                                                                    {Array.isArray(values.tax_residence) &&
                                                                    !isChangeableField('tax_residence') ? (
                                                                        <fieldset className='account-form__fieldset'>
                                                                            <Input
                                                                                type='text'
                                                                                id={'tax_residence_disabled'}
                                                                                name='tax_residence'
                                                                                label={localize('Tax residence*')}
                                                                                value={values.tax_residence.join(', ')}
                                                                                disabled
                                                                            />
                                                                        </fieldset>
                                                                    ) : (
                                                                        <TaxResidenceSelect
                                                                            is_changeable={isChangeableField(
                                                                                'tax_residence'
                                                                            )}
                                                                            field={field}
                                                                            id={'tax_residence'}
                                                                            touched={touched}
                                                                            errors={errors}
                                                                            setFieldValue={setFieldValue}
                                                                            values={values}
                                                                            residence_list={residence_list}
                                                                        />
                                                                    )}
                                                                </React.Fragment>
                                                            )}
                                                        </Field>
                                                    </fieldset>
                                                )}
                                                {'tax_identification_number' in values && (
                                                    <fieldset
                                                        className={classNames('account-form__fieldset', {
                                                            'account-form__fieldset--tin':
                                                                getWarningMessages(values).tax_identification_number,
                                                        })}
                                                    >
                                                        <Input
                                                            data-lpignore='true'
                                                            type='text'
                                                            id={'tax_identification_number'}
                                                            name='tax_identification_number'
                                                            label={localize('Tax identification number*')}
                                                            value={values.tax_identification_number}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            warn={getWarningMessages(values).tax_identification_number}
                                                            error={errors.tax_identification_number}
                                                            disabled={!isChangeableField('tax_identification_number')}
                                                            required
                                                        />
                                                    </fieldset>
                                                )}
                                                {'employment_status' in values && (
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Employment status')}
                                                                is_align_text_left
                                                                name='employment_status'
                                                                list={getEmploymentStatusList()}
                                                                value={values.employment_status}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                className={'emp-status'}
                                                                placeholder={localize('Please select')}
                                                                name='employment_status'
                                                                label={localize('Employment status')}
                                                                list_items={getEmploymentStatusList()}
                                                                value={values.employment_status}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                                onChange={e => {
                                                                    setFieldTouched('employment_status', true);
                                                                    handleChange(e);
                                                                }}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                )}
                                            </FormBodySection>
                                        </React.Fragment>
                                    )}
                                    {!is_appstore && !is_virtual && (
                                        <React.Fragment>
                                            {has_poa_address_mismatch && <POAAddressMismatchHintBox />}
                                            <FormSubHeader title={localize('Address')} />
                                            <FormBodySection has_side_note={is_appstore}>
                                                <div className='account-address__details-section'>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            maxLength={70}
                                                            name='address_line_1'
                                                            id='address_line_1'
                                                            label={localize('First line of address*')}
                                                            value={values.address_line_1}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={errors.address_line_1}
                                                            required
                                                            disabled={!isChangeableField('address_line_1')}
                                                        />
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            maxLength={70}
                                                            name='address_line_2'
                                                            id='address_line_2'
                                                            label={localize('Second line of address (optional)')}
                                                            value={values.address_line_2}
                                                            error={errors.address_line_2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            disabled={!isChangeableField('address_line_2')}
                                                        />
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            name='address_city'
                                                            id='address_city'
                                                            label={localize('Town/City*')}
                                                            value={values.address_city}
                                                            error={errors.address_city}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            disabled={!isChangeableField('address_city')}
                                                        />
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        {states_list.length ? (
                                                            <>
                                                                <DesktopWrapper>
                                                                    <Field name='address_state'>
                                                                        {({ field }) => (
                                                                            <Autocomplete
                                                                                {...field}
                                                                                data-lpignore='true'
                                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                                type='text'
                                                                                label={localize(
                                                                                    'State/Province (optional)'
                                                                                )}
                                                                                id={'state_province'}
                                                                                error={errors.address_state}
                                                                                list_items={states_list}
                                                                                onItemSelection={({ value, text }) =>
                                                                                    setFieldValue(
                                                                                        'address_state',
                                                                                        value ? text : '',
                                                                                        true
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    !isChangeableField('address_state')
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </DesktopWrapper>
                                                                <MobileWrapper>
                                                                    <SelectNative
                                                                        placeholder={localize('Please select')}
                                                                        label={localize('State/Province (optional)')}
                                                                        value={values.address_state}
                                                                        list_items={states_list}
                                                                        id={'state_province_mobile'}
                                                                        error={errors.address_state}
                                                                        use_text={true}
                                                                        onChange={e =>
                                                                            setFieldValue(
                                                                                'address_state',
                                                                                e.target.value,
                                                                                true
                                                                            )
                                                                        }
                                                                        disabled={!isChangeableField('address_state')}
                                                                    />
                                                                </MobileWrapper>
                                                            </>
                                                        ) : (
                                                            <Input
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                name='address_state'
                                                                id='address_state'
                                                                label={localize('State/Province (optional)')}
                                                                value={values.address_state}
                                                                error={errors.address_state}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                disabled={!isChangeableField('address_state')}
                                                            />
                                                        )}
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            name='address_postcode'
                                                            id='address_postcode'
                                                            label={localize('Postal/ZIP code')}
                                                            value={values.address_postcode}
                                                            error={errors.address_postcode}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={!isChangeableField('address_postcode')}
                                                        />
                                                    </fieldset>
                                                </div>
                                            </FormBodySection>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                                {!!current_landing_company?.support_professional_client && (
                                    <>
                                        <div className='account-form__divider' />
                                        <div className='pro-client'>
                                            <FormSubHeader title={localize('Professional Client')} />
                                            <FormBodySection>
                                                <fieldset className='account-form__fieldset'>
                                                    <div>
                                                        <Text as='p' size='xs'>
                                                            <Localize
                                                                i18n_default_text='By default, all {{brand_website_name}} clients are retail clients but anyone can request to be treated as a professional client.'
                                                                values={{ brand_website_name: getBrandWebsiteName() }}
                                                            />
                                                        </Text>
                                                        <Text as='p' size='xs'>
                                                            <Localize i18n_default_text='A professional client receives a lower degree of client protection due to the following.' />
                                                        </Text>
                                                        <Text as='p' size='xs'>
                                                            <Localize i18n_default_text='We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved.' />
                                                        </Text>
                                                        <Text as='p' size='xs' className='last-child'>
                                                            <Localize i18n_default_text='We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings.' />
                                                        </Text>
                                                    </div>
                                                    {is_account_verified ? (
                                                        <Checkbox
                                                            name='request_professional_status'
                                                            value={values.request_professional_status}
                                                            onChange={() => {
                                                                setFieldValue(
                                                                    'request_professional_status',
                                                                    !values.request_professional_status
                                                                );
                                                                setFieldTouched(
                                                                    'request_professional_status',
                                                                    true,
                                                                    true
                                                                );
                                                            }}
                                                            label={localize(
                                                                'I would like to be treated as a professional client.'
                                                            )}
                                                            id='request_professional_status'
                                                            defaultChecked={!!values.request_professional_status}
                                                            disabled={
                                                                is_virtual ||
                                                                !!form_initial_values.request_professional_status
                                                            }
                                                            greyDisabled
                                                            className={classNames({
                                                                'dc-checkbox-blue': is_appstore,
                                                            })}
                                                        />
                                                    ) : (
                                                        <HintBox
                                                            icon='IcInfoBlue'
                                                            icon_height={20}
                                                            icon_width={30}
                                                            message={
                                                                <Text as='p' size='xs'>
                                                                    <Localize
                                                                        i18n_default_text='You’ll need to authenticate your account before requesting to become a professional client. <0>Authenticate my account</0>'
                                                                        components={[
                                                                            <a
                                                                                key={0}
                                                                                className='link--no-bold'
                                                                                rel='noopener noreferrer'
                                                                                target='_blank'
                                                                                href={getRedirectionLink()}
                                                                            />,
                                                                        ]}
                                                                    />
                                                                </Text>
                                                            }
                                                            is_info
                                                            is_inline
                                                        />
                                                    )}
                                                </fieldset>
                                            </FormBodySection>
                                        </div>
                                        <div className='account-form__divider' />
                                    </>
                                )}
                                <FormSubHeader title={localize('Email preference')} />
                                <FormBodySection
                                    has_side_note={is_appstore}
                                    side_note={localize('Check this box to receive updates via email.')}
                                >
                                    <fieldset className='account-form__fieldset'>
                                        <Checkbox
                                            name='email_consent'
                                            value={values.email_consent}
                                            onChange={() => {
                                                setFieldValue('email_consent', !values.email_consent);
                                                setFieldTouched('email_consent', true, true);
                                            }}
                                            label={localize('Get updates about Deriv products, services and events.')}
                                            id='email_consent'
                                            defaultChecked={!!values.email_consent}
                                            disabled={!isChangeableField('email_consent') && !is_virtual}
                                            className={classNames({ 'dc-checkbox-blue': is_appstore })}
                                        />
                                    </fieldset>
                                </FormBodySection>
                            </FormBody>
                            <FormFooter>
                                {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                {!is_virtual && !(isSubmitting || is_submit_success || (status && status.msg)) && (
                                    <Text className='account-form__footer-note' size='xxxs'>
                                        {localize(
                                            'Please make sure your information is correct or it may affect your trading experience.'
                                        )}
                                    </Text>
                                )}
                                <Button
                                    className={classNames('account-form__footer-btn', {
                                        'dc-btn--green': is_submit_success,
                                    })}
                                    type='submit'
                                    is_disabled={
                                        isSubmitting ||
                                        !dirty ||
                                        (is_virtual
                                            ? false
                                            : !!(
                                                  errors.first_name ||
                                                  !values.first_name ||
                                                  errors.last_name ||
                                                  !values.last_name ||
                                                  errors.phone ||
                                                  !values.phone ||
                                                  (is_mf && errors.tax_residence) ||
                                                  (is_mf && !values.tax_residence) ||
                                                  (is_mf && errors.tax_identification_number) ||
                                                  (is_mf && !values.tax_identification_number) ||
                                                  (!is_svg && errors.place_of_birth) ||
                                                  (!is_svg && !values.place_of_birth) ||
                                                  errors.address_line_1 ||
                                                  !values.address_line_1 ||
                                                  errors.address_line_2 ||
                                                  errors.address_city ||
                                                  !values.address_city ||
                                                  errors.address_state ||
                                                  errors.address_postcode
                                              ))
                                    }
                                    has_effect
                                    is_loading={is_btn_loading}
                                    is_submit_success={is_submit_success}
                                    text={is_appstore ? localize('Save') : localize('Submit')}
                                    large
                                    primary
                                />
                            </FormFooter>
                        </form>
                    )}
                </>
            )}
        </Formik>
    );
};

PersonalDetailsForm.propTypes = {
    authentication_status: PropTypes.object,
    is_eu: PropTypes.bool,
    is_mf: PropTypes.bool,
    is_uk: PropTypes.bool,
    is_svg: PropTypes.bool,
    is_virtual: PropTypes.bool,
    residence_list: PropTypes.arrayOf(PropTypes.object),
    states_list: PropTypes.array,
    refreshNotifications: PropTypes.func,
    showPOAAddressMismatchSuccessNotification: PropTypes.func,
    showPOAAddressMismatchFailureNotification: PropTypes.func,
    Notifications: PropTypes.node,
    fetchResidenceList: PropTypes.func,
    fetchStatesList: PropTypes.func,
    has_residence: PropTypes.bool,
    account_settings: PropTypes.object,
    getChangeableFields: PropTypes.func,
    current_landing_company: PropTypes.object,
    history: PropTypes.object,
    is_social_signup: PropTypes.bool,
    updateAccountStatus: PropTypes.func,
    has_poa_address_mismatch: PropTypes.bool,
    is_language_changing: PropTypes.bool,
};

export default connect(({ client, notifications, ui, common }) => ({
    account_settings: client.account_settings,
    authentication_status: client.authentication_status,
    has_residence: client.has_residence,
    getChangeableFields: client.getChangeableFields,
    current_landing_company: client.current_landing_company,
    is_eu: client.is_eu,
    is_mf: client.landing_company_shortcode === 'maltainvest',
    is_svg: client.is_svg,
    is_uk: client.is_uk,
    is_virtual: client.is_virtual,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchResidenceList: client.fetchResidenceList,
    fetchStatesList: client.fetchStatesList,
    is_social_signup: client.is_social_signup,
    refreshNotifications: notifications.refreshNotifications,
    showPOAAddressMismatchSuccessNotification: notifications.showPOAAddressMismatchSuccessNotification,
    showPOAAddressMismatchFailureNotification: notifications.showPOAAddressMismatchFailureNotification,
    Notifications: ui.notification_messages_ui,
    updateAccountStatus: client.updateAccountStatus,
    has_poa_address_mismatch: client.account_status.status?.includes('poa_address_mismatch'),
    is_language_changing: common.is_language_changing,
}))(withRouter(PersonalDetailsForm));
