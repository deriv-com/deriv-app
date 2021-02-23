// import PropTypes        from 'prop-types';
import React from 'react';
import { Formik, Field } from 'formik';
import classNames from 'classnames';
import {
    Autocomplete,
    Checkbox,
    Button,
    FormSubmitErrorMessage,
    Input,
    DesktopWrapper,
    Loading,
    MobileWrapper,
    SelectNative,
    DateOfBirthPicker,
    Text,
} from '@deriv/components';
import {
    toMoment,
    isMobile,
    validAddress,
    validPostCode,
    validTaxID,
    validPhone,
    validLetterSymbol,
    validLength,
    validCountryCode,
    getLocation,
    removeObjProperties,
    filterObjProperties,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
// import { account_opening_reason_list }         from './constants';
import LeaveConfirm from 'Components/leave-confirm';
import FormFooter from 'Components/form-footer';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import LoadErrorMessage from 'Components/load-error-message';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

const InputGroup = ({ children, className }) => (
    <fieldset className='account-form__fieldset'>
        <div className={className}>{children}</div>
    </fieldset>
);

export class PersonalDetailsForm extends React.Component {
    state = { is_loading: true, is_state_loading: false, show_form: true };

    onSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        const request = this.makeSettingsRequest(values);
        this.setState({ is_btn_loading: true });
        const data = await WS.setSettings(request);
        this.setState({ is_btn_loading: false });

        setSubmitting(false);

        if (data.error) {
            setStatus({ msg: data.error.message });
        } else {
            // force request to update settings cache since settings have been updated
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                this.setState({ api_error: response.error.message });
                return;
            }
            this.setState({ ...response.get_settings, is_loading: false });
            this.props.refreshNotifications();
            this.setState({ is_submit_success: true });
            setTimeout(() => this.setState({ is_submit_success: false }), 3000);
        }
    };

    makeSettingsRequest = settings => {
        if (this.props.is_virtual) return { email_consent: +settings.email_consent };
        const request = filterObjProperties(settings, [...this.state.changeable_fields]);

        request.email_consent = +request.email_consent; // checkbox is boolean but api expects number (1 or 0)
        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }

        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        if (this.props.is_mf) {
            if (request.tax_residence) {
                request.tax_residence = getLocation(this.props.residence_list, request.tax_residence, 'value');
            }

            if (request.tax_identification_number) {
                request.tax_identification_number = request.tax_identification_number.trim();
            }
        }

        if (request.citizen) {
            request.citizen = getLocation(this.props.residence_list, request.citizen, 'value');
        }

        if (request.place_of_birth) {
            request.place_of_birth = getLocation(this.props.residence_list, request.place_of_birth, 'value');
        } else {
            delete request.place_of_birth;
        }

        if (request.address_state) {
            request.address_state = this.props.states_list.length
                ? getLocation(this.props.states_list, request.address_state, 'value')
                : request.address_state;
        }

        return request;
    };

    // TODO: standardize validations and refactor this
    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        if (this.props.is_virtual) return errors;

        const required_fields = [
            'first_name',
            'last_name',
            'phone',
            // 'account_opening_reason',
            'address_line_1',
            'address_city',
        ];
        if (this.props.is_eu) {
            required_fields.push('citizen');
        }
        if (this.props.is_mf) {
            const required_tax_fields = ['tax_residence', 'tax_identification_number'];
            required_fields.push(...required_tax_fields);
        }

        validateValues(val => val, required_fields, localize('This field is required'));
        const only_alphabet_fields = ['first_name', 'last_name'];
        validateValues(validLetterSymbol, only_alphabet_fields, localize('Only alphabet is allowed'));

        const { residence_list } = this.props;
        const residence_fields = ['citizen'];
        const validateResidence = val => getLocation(residence_list, val, 'value');
        validateValues(validateResidence, residence_fields, true);

        const min_tax_identification_number = 0;
        const max_tax_identification_number = 20;
        if (values.tax_identification_number) {
            if (!validTaxID(values.tax_identification_number.trim())) {
                errors.tax_identification_number = localize(
                    'Should start with letter or number, and may contain hyphen and underscore.'
                );
            } else if (
                !validLength(values.tax_identification_number.trim(), {
                    min: min_tax_identification_number,
                    max: max_tax_identification_number,
                })
            ) {
                errors.tax_identification_number = localize('You should enter 0-20 characters.');
            }
        }

        const min_name = 2;
        const max_name = 50;
        if (values.first_name && !validLength(values.first_name.trim(), { min: min_name, max: max_name })) {
            errors.first_name = localize('You should enter 2-50 characters.');
        }
        if (values.last_name && !validLength(values.last_name.trim(), { min: min_name, max: max_name })) {
            errors.last_name = localize('You should enter 2-50 characters.');
        }

        if (values.phone) {
            // minimum characters required is 9 including (+) sign
            // phone_trim uses regex that trims (+) sign
            // minimum characters required w/o (+) sign is 8 characters.
            const min_phone_number = 8;
            const max_phone_number = 35;
            const phone_trim = values.phone.replace(/\D/g, '');
            const phone_error_message = localize(
                'Please enter a valid phone number, including the country code (e.g +15417541234).'
            );

            if (!validLength(phone_trim, { min: min_phone_number, max: max_phone_number })) {
                errors.phone = localize('You should enter {{min}}-{{max}} numbers.', {
                    min: min_phone_number,
                    max: max_phone_number,
                });
            } else if (!validCountryCode(this.props.residence_list, values.phone)) {
                errors.phone = phone_error_message;
            } else if (!validPhone(values.phone)) {
                errors.phone = phone_error_message;
            }
        }

        const permitted_characters = "- . ' # ; : ( ) , @ /";
        const address_validation_message = localize(
            'Only letters, numbers, space, and these special characters are allowed: {{ permitted_characters }}',
            {
                permitted_characters,
                interpolation: { escapeValue: false },
            }
        );

        if (values.address_line_1 && !validAddress(values.address_line_1)) {
            errors.address_line_1 = address_validation_message;
        }
        if (values.address_line_2 && !validAddress(values.address_line_2)) {
            errors.address_line_2 = address_validation_message;
        }

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = localize('Only letters, space, hyphen, period, and apostrophe are allowed.');
        }

        const state_is_input_element = values.address_state && !this.props.states_list.length;
        if (state_is_input_element) {
            if (!validLength(values.address_state, { min: 0, max: 35 })) {
                errors.address_state = localize('You should enter 0-35 characters.');
            } else if (!/^[\w\s\W'.-;,]{0,35}$/.test(values.address_state)) {
                errors.address_state = localize('State is not in a proper format');
            }
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

        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    isChangeableField(name) {
        return this.state.changeable_fields.some(field => field === name);
    }

    async componentDidMount() {
        // waits for residence to be populated
        await WS.wait('get_settings');

        const { fetchResidenceList, fetchStatesList, has_residence } = this.props;

        fetchResidenceList();
        if (has_residence) {
            this.setState({ is_state_loading: true }, () => {
                fetchStatesList().then(() => {
                    this.setState({ is_state_loading: false });
                });
            });
        }
        this.initializeFormValues();
    }

    componentDidUpdate(prevProps) {
        if (
            Object.values(this.props.account_settings).join('|') !==
                Object.values(prevProps.account_settings).join('|') ||
            this.props.is_eu !== prevProps.is_eu ||
            this.props.is_mf !== prevProps.is_mf
        ) {
            this.initializeFormValues();
        }
    }

    initializeFormValues() {
        WS.wait('landing_company', 'get_account_status', 'get_settings').then(() => {
            const { getChangeableFields, is_virtual, account_settings } = this.props;

            // Convert to boolean
            account_settings.email_consent = !!account_settings.email_consent;

            const hidden_settings = [
                'account_opening_reason',
                'allow_copiers',
                !this.props.is_mf && 'tax_residence',
                !this.props.is_mf && 'tax_identification_number',
                'client_tnc_status',
                'country_code',
                'has_secret_answer',
                'is_authenticated_payment_agent',
                'user_hash',
                'country',
                'salutation',
                'request_professional_status',
                'immutable_fields',
            ];
            const form_initial_values = removeObjProperties(hidden_settings, account_settings);
            this.setState({
                changeable_fields: is_virtual ? [] : getChangeableFields(),
                is_loading: false,
                form_initial_values,
            });
        });
    }

    render() {
        const {
            form_initial_values: { ...form_initial_values },
            api_error,
            is_loading,
            is_state_loading,
            is_btn_loading,
            is_submit_success,
            show_form,
        } = this.state;

        const { residence_list, states_list } = this.props;

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
        if (this.props.is_mf) {
            form_initial_values.tax_residence = form_initial_values.tax_residence
                ? getLocation(residence_list, form_initial_values.tax_residence, 'text')
                : '';
            if (!form_initial_values.tax_identification_number) form_initial_values.tax_identification_number = '';
        }

        return (
            <Formik
                initialValues={form_initial_values}
                enableReinitialize={true}
                onSubmit={this.onSubmit}
                validate={this.validateFields}
            >
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
                        <LeaveConfirm onDirty={isMobile() ? this.showForm : null} />
                        {show_form && (
                            <form
                                noValidate
                                className='account-form account-form__personal-details'
                                onSubmit={handleSubmit}
                            >
                                <FormBody scroll_offset={isMobile() ? '199px' : '80px'}>
                                    <FormSubHeader title={localize('Details')} />
                                    {!this.props.is_virtual && (
                                        <React.Fragment>
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
                                                        disabled={!this.isChangeableField('first_name')}
                                                        error={touched.first_name && errors.first_name}
                                                    />
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='last_name'
                                                        label={localize('Last name*')}
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!this.isChangeableField('last_name')}
                                                        error={touched.last_name && errors.last_name}
                                                    />
                                                </InputGroup>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='first_name'
                                                        label={localize('First name*')}
                                                        value={values.first_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!this.isChangeableField('first_name')}
                                                        error={touched.first_name && errors.first_name}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='last_name'
                                                        label={localize('Last name*')}
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!this.isChangeableField('last_name')}
                                                        error={touched.last_name && errors.last_name}
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
                                                                    this.props.is_svg
                                                                        ? localize('Place of birth')
                                                                        : localize('Place of birth*')
                                                                }
                                                                error={touched.place_of_birth && errors.place_of_birth}
                                                                required={!this.props.is_svg}
                                                                disabled={!this.isChangeableField('place_of_birth')}
                                                                list_items={this.props.residence_list}
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
                                                            this.props.is_svg
                                                                ? localize('Place of birth')
                                                                : localize('Place of birth*')
                                                        }
                                                        required={!this.props.is_svg}
                                                        disabled={!this.isChangeableField('place_of_birth')}
                                                        value={values.place_of_birth}
                                                        list_items={this.props.residence_list}
                                                        use_text={true}
                                                        error={touched.place_of_birth && errors.place_of_birth}
                                                        onChange={e =>
                                                            setFieldValue('place_of_birth', e.target.value, true)
                                                        }
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DateOfBirthPicker
                                                    name='date_of_birth'
                                                    label={localize('Date of birth*')}
                                                    error={touched.date_of_birth && errors.date_of_birth}
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
                                                    disabled={!this.isChangeableField('date_of_birth')}
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
                                                                    this.props.is_eu
                                                                        ? localize('Citizenship*')
                                                                        : localize('Citizenship')
                                                                }
                                                                error={touched.citizen && errors.citizen}
                                                                disabled={!this.isChangeableField('citizen')}
                                                                list_items={this.props.residence_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue('citizen', value ? text : '', true)
                                                                }
                                                                required={this.props.is_eu}
                                                            />
                                                        )}
                                                    </Field>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            label={
                                                                this.props.is_eu
                                                                    ? localize('Citizenship*')
                                                                    : localize('Citizenship')
                                                            }
                                                            required={this.props.is_eu}
                                                            disabled={!this.isChangeableField('citizen')}
                                                            value={values.citizen}
                                                            list_items={this.props.residence_list}
                                                            error={touched.citizen && errors.citizen}
                                                            use_text={true}
                                                            onChange={e =>
                                                                setFieldValue('citizen', e.target.value, true)
                                                            }
                                                        />
                                                    </MobileWrapper>
                                                </MobileWrapper>
                                            </fieldset>
                                        </React.Fragment>
                                    )}
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='residence'
                                            label={localize('Country of residence*')}
                                            value={values.residence}
                                            required
                                            disabled={!this.isChangeableField('residence')}
                                            error={touched.residence && errors.residence}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='email'
                                            label={localize('Email address*')}
                                            value={values.email}
                                            required
                                            disabled={!this.isChangeableField('email')}
                                            error={touched.email && errors.email}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                    {!this.props.is_virtual && (
                                        <React.Fragment>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='phone'
                                                    label={localize('Phone number*')}
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    error={touched.phone && errors.phone}
                                                />
                                            </fieldset>
                                            {/* Hide Account Opening Reason, uncomment block below to re-enable */}
                                            {/* <fieldset className='account-form__fieldset'> */}
                                            {/*    {account_opening_reason && is_fully_authenticated ? ( */}
                                            {/*        <Input */}
                                            {/*            data-lpignore='true' */}
                                            {/*            type='text' */}
                                            {/*            name='account_opening_reason' */}
                                            {/*            label={localize('Account opening reason')} */}
                                            {/*            value={values.account_opening_reason} */}
                                            {/*            disabled */}
                                            {/*        /> */}
                                            {/*    ) : ( */}
                                            {/*        <Dropdown */}
                                            {/*            placeholder={'Account opening reason'} */}
                                            {/*            is_align_text_left */}
                                            {/*            name='account_opening_reason' */}
                                            {/*            list={account_opening_reason_list} */}
                                            {/*            value={values.account_opening_reason} */}
                                            {/*            onChange={handleChange} */}
                                            {/*            handleBlur={handleBlur} */}
                                            {/*            error={ */}
                                            {/*                touched.account_opening_reason && */}
                                            {/*                errors.account_opening_reason */}
                                            {/*            } */}
                                            {/*        /> */}
                                            {/*    )} */}
                                            {/* </fieldset> */}
                                            {this.props.is_mf && (
                                                <React.Fragment>
                                                    <FormSubHeader title={localize('Tax information')} />
                                                    {'tax_residence' in values && (
                                                        <fieldset className='account-form__fieldset'>
                                                            <Field name='tax_residence'>
                                                                {({ field }) => (
                                                                    <React.Fragment>
                                                                        <DesktopWrapper>
                                                                            <Autocomplete
                                                                                {...field}
                                                                                data-lpignore='true'
                                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                                type='text'
                                                                                label={localize('Tax residence*')}
                                                                                error={
                                                                                    touched.tax_residence &&
                                                                                    errors.tax_residence
                                                                                }
                                                                                disabled={
                                                                                    !this.isChangeableField(
                                                                                        'tax_residence'
                                                                                    )
                                                                                }
                                                                                list_items={this.props.residence_list}
                                                                                onItemSelection={({ value, text }) =>
                                                                                    setFieldValue(
                                                                                        'tax_residence',
                                                                                        value ? text : '',
                                                                                        true
                                                                                    )
                                                                                }
                                                                                required
                                                                            />
                                                                        </DesktopWrapper>
                                                                        <MobileWrapper>
                                                                            <SelectNative
                                                                                placeholder={localize('Tax residence*')}
                                                                                label={localize('Tax residence*')}
                                                                                value={values.tax_residence}
                                                                                list_items={this.props.residence_list}
                                                                                error={
                                                                                    touched.tax_residence &&
                                                                                    errors.tax_residence
                                                                                }
                                                                                disabled={
                                                                                    !this.isChangeableField(
                                                                                        'tax_residence'
                                                                                    )
                                                                                }
                                                                                use_text={true}
                                                                                onChange={e =>
                                                                                    setFieldValue(
                                                                                        'tax_residence',
                                                                                        e.target.value,
                                                                                        true
                                                                                    )
                                                                                }
                                                                                required
                                                                            />
                                                                        </MobileWrapper>
                                                                    </React.Fragment>
                                                                )}
                                                            </Field>
                                                        </fieldset>
                                                    )}
                                                    {'tax_identification_number' in values && (
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                type='text'
                                                                name='tax_identification_number'
                                                                label={localize('Tax identification number*')}
                                                                value={values.tax_identification_number}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={
                                                                    touched.tax_identification_number &&
                                                                    errors.tax_identification_number
                                                                }
                                                                disabled={
                                                                    !this.isChangeableField('tax_identification_number')
                                                                }
                                                                required
                                                            />
                                                        </fieldset>
                                                    )}
                                                </React.Fragment>
                                            )}
                                            <FormSubHeader title={localize('Address')} />
                                            <div className='account-address__details-section'>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        maxLength={70}
                                                        name='address_line_1'
                                                        label={localize('First line of address*')}
                                                        value={values.address_line_1}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.address_line_1 && errors.address_line_1}
                                                        required
                                                        disabled={!this.isChangeableField('address_line_1')}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        maxLength={70}
                                                        name='address_line_2'
                                                        label={localize('Second line of address (optional)')}
                                                        value={values.address_line_2}
                                                        error={touched.address_line_2 && errors.address_line_2}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!this.isChangeableField('address_line_2')}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        name='address_city'
                                                        label={localize('Town/City*')}
                                                        value={values.address_city}
                                                        error={touched.address_city && errors.address_city}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={!this.isChangeableField('address_city')}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    {this.props.states_list.length ? (
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
                                                                            error={
                                                                                touched.address_state &&
                                                                                errors.address_state
                                                                            }
                                                                            list_items={this.props.states_list}
                                                                            onItemSelection={({ value, text }) =>
                                                                                setFieldValue(
                                                                                    'address_state',
                                                                                    value ? text : '',
                                                                                    true
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                !this.isChangeableField('address_state')
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
                                                                    list_items={this.props.states_list}
                                                                    error={
                                                                        touched.address_state && errors.address_state
                                                                    }
                                                                    use_text={true}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            e.target.value,
                                                                            true
                                                                        )
                                                                    }
                                                                    disabled={!this.isChangeableField('address_state')}
                                                                />
                                                            </MobileWrapper>
                                                        </>
                                                    ) : (
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            name='address_state'
                                                            label={localize('State/Province (optional)')}
                                                            value={values.address_state}
                                                            error={touched.address_state && errors.address_state}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={!this.isChangeableField('address_state')}
                                                        />
                                                    )}
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        name='address_postcode'
                                                        label={localize('Postal/ZIP code')}
                                                        value={values.address_postcode}
                                                        error={touched.address_postcode && errors.address_postcode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={!this.isChangeableField('address_postcode')}
                                                    />
                                                </fieldset>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    <FormSubHeader title={localize('Email preference')} />
                                    <fieldset className='account-form__fieldset'>
                                        <Checkbox
                                            name='email_consent'
                                            value={values.email_consent}
                                            onChange={() => {
                                                setFieldValue('email_consent', !values.email_consent);
                                                setFieldTouched('email_consent', true, true);
                                            }}
                                            label={localize('Get updates about Deriv products, services and events.')}
                                            defaultChecked={!!values.email_consent}
                                            disabled={
                                                !this.isChangeableField('email_consent') && !this.props.is_virtual
                                            }
                                        />
                                    </fieldset>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    {!this.props.is_virtual &&
                                        !(isSubmitting || is_submit_success || (status && status.msg)) && (
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
                                            (this.props.is_virtual
                                                ? false
                                                : !!(
                                                      errors.first_name ||
                                                      !values.first_name ||
                                                      errors.last_name ||
                                                      !values.last_name ||
                                                      errors.phone ||
                                                      !values.phone ||
                                                      (this.props.is_mf && errors.tax_residence) ||
                                                      (this.props.is_mf && !values.tax_residence) ||
                                                      (this.props.is_mf && errors.tax_identification_number) ||
                                                      (this.props.is_mf && !values.tax_identification_number) ||
                                                      (!this.props.is_svg && errors.place_of_birth) ||
                                                      (!this.props.is_svg && !values.place_of_birth) ||
                                                      // (errors.account_opening_reason || !values.account_opening_reason) ||
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
                                        text={localize('Submit')}
                                        primary
                                        large
                                    />
                                </FormFooter>
                            </form>
                        )}
                    </>
                )}
            </Formik>
        );
    }
}

// PersonalDetailsForm.propTypes = {};
export default connect(({ client }) => ({
    account_settings: client.account_settings,
    has_residence: client.has_residence,
    getChangeableFields: client.getChangeableFields,
    is_eu: client.is_eu,
    is_mf: client.landing_company_shortcode === 'maltainvest',
    is_svg: client.is_svg,
    is_virtual: client.is_virtual,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchResidenceList: client.fetchResidenceList,
    fetchStatesList: client.fetchStatesList,
    refreshNotifications: client.refreshNotifications,
}))(PersonalDetailsForm);
