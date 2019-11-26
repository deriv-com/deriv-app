// import PropTypes        from 'prop-types';
import React                                   from 'react';
import { Formik, Field }                       from 'formik';
import classNames                              from 'classnames';
import {
    Autocomplete,
    Checkbox,
    Button,
    Input }                                    from 'deriv-components';
import { DateOfBirth }                         from 'App/Containers/RealAccountSignup/personal-details.jsx';
import { localize }                            from 'deriv-translations';
import { WS }                                  from 'Services/ws-methods';
import { connect }                             from 'Stores/connect';
import {
    validAddress,
    validPostCode,
    validTaxID,
    validPhone,
    validLetterSymbol,
    validLength }                              from 'Utils/Validator/declarative-validation-rules';
import { toMoment }                            from 'Utils/Date';
// import { account_opening_reason_list }         from './constants';
import Loading                                 from '../../../../../templates/app/components/loading.jsx';
import FormSubmitErrorMessage                  from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage                        from '../../ErrorMessages/LoadErrorMessage';
import { LeaveConfirm }                        from '../../../Components/leave-confirm.jsx';
import { FormFooter, FormBody, FormSubHeader } from '../../../Components/layout-components.jsx';

const getLocation = (location_list, value, type) => {
    const location_obj = location_list.find(location =>
        location[type === 'text' ? 'value' : 'text'].toLowerCase() === value.toLowerCase());

    if (location_obj) return location_obj[type];
    return '';
};

const removeObjProperties = (property_arr, { ...obj }) => {
    property_arr.forEach(property => delete obj[property]);
    return obj;
};

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

const InputGroup = ({ children, className }) => (
    <fieldset className='account-form__fieldset'>
        <div className={className}>
            {children}
        </div>
    </fieldset>
);

class PersonalDetailsForm extends React.Component {
    state = { is_loading: true, is_state_loading: false, show_form: true }

    onSubmit = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });

        const request = this.makeSettingsRequest(values);

        this.setState({ is_btn_loading: true });

        WS.setSettings(request).then((data) => {
            this.setState({ is_btn_loading: false });

            setSubmitting(false);

            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage.getSettings().then((response) => {
                    if (response.error) {
                        this.setState({ api_error: response.error.message });
                        return;
                    }
                    this.setState({ ...response.get_settings, is_loading: false });
                    this.props.refreshNotifications();
                });
                this.setState({ is_submit_success: true });
            }
        });
    }

    makeSettingsRequest = settings => {
        if (this.props.is_virtual) return { email_consent: +settings.email_consent };
        const settings_to_be_removed_for_api = ['email', 'residence'];
        const request                        = removeObjProperties(settings_to_be_removed_for_api, settings);

        request.email_consent             = +request.email_consent; // checkbox is boolean but api expects number (1 or 0)
        request.first_name                = request.first_name.trim();
        request.last_name                 = request.last_name.trim();
        // request.tax_identification_number = request.tax_identification_number ? request.tax_identification_number.trim() : '';
        request.date_of_birth             = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        request.citizen                   = request.citizen ? getLocation(this.props.residence_list, request.citizen, 'value') : '';
        request.place_of_birth            = request.place_of_birth ? getLocation(this.props.residence_list, request.place_of_birth, 'value') : '';

        if (request.address_state) {
            request.address_state = this.props.states_list.length ?
                getLocation(this.props.states_list, request.address_state, 'value') : request.address_state;
        }

        return request;
    };

    // TODO: standardize validations and refactor this
    validateFields = (values) => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        if (this.props.is_virtual) return errors;

        const required_fields = [
            'first_name',
            'last_name',
            'phone',
            // 'account_opening_reason',
            'place_of_birth',
            'address_line_1',
            'address_city',
            'address_postcode',
        ];
        validateValues(val => val, required_fields, localize('This field is required'));
        const only_alphabet_fields = ['first_name', 'last_name', 'address_state'];
        validateValues(validLetterSymbol, only_alphabet_fields, localize('Only alphabet is allowed'));

        const { residence_list } = this.props;
        const residence_fields = ['place_of_birth', 'citizen'];
        const validateResidence = val => getLocation(residence_list, val, 'value');
        validateValues(validateResidence, residence_fields, true);

        const min_tax_identification_number = 0;
        const max_tax_identification_number = 20;
        if (values.tax_identification_number) {
            if (!validTaxID(values.tax_identification_number.trim())) {
                errors.tax_identification_number = localize('Should start with letter or number, and may contain hyphen and underscore.');
            } else if (!validLength(values.tax_identification_number.trim(),
                { min: min_tax_identification_number, max: max_tax_identification_number })) {
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
            const min_phone_number = 8;
            const max_phone_number = 35;
            const phone_trim =  values.phone.replace(/\D/g,'');

            if (!validPhone(values.phone.trim())) {
                errors.phone = localize('Only numbers, hyphens, and spaces are allowed.');
            }  else if (!validLength(phone_trim, { min: min_phone_number, max: max_phone_number })) {
                errors.phone = localize('You should enter 8-35 characters.');
            }
        }

        const permitted_characters = '- . \' # ; : ( ) , @ /';
        const address_validation_message = localize(`Only letters, numbers, space, and these special characters are allowed: ${permitted_characters}`);

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
            const max_state_length = 35;
            if (!validLength(values.address_state, { min: 0, max: max_state_length })) {
                errors.address_state = localize('You should enter 0-35 characters.');
            }
        }

        if (values.address_postcode && !validPostCode(values.address_postcode)) {
            errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
        }

        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    isChangeableField(name) {
        return !this.state.changeable_fields.some(field => field === name);
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

        const { is_fully_authenticated, residence_list, states_list } = this.props;

        if (api_error) return <LoadErrorMessage error_message={api_error} />;

        if (is_loading || is_state_loading || !residence_list.length) {
            return <Loading is_fullscreen={false} className='account___intial-loader' />;
        }

        form_initial_values.citizen = form_initial_values.citizen ? getLocation(residence_list, form_initial_values.citizen, 'text') : '';
        // form_initial_values.tax_residence = form_initial_values.tax_residence ? getLocation(residence_list, tax_residence, 'text') : '';
        form_initial_values.place_of_birth = form_initial_values.place_of_birth ? getLocation(residence_list, form_initial_values.place_of_birth, 'text') : '';
        if (form_initial_values.address_state) {
            form_initial_values.address_state = states_list.length ? getLocation(states_list, form_initial_values.address_state, 'text') : form_initial_values.address_state;
        } else {
            form_initial_values.address_state = '';
        }

        // if (!form_initial_values.tax_identification_number) form_initial_values tax_identification_number = '';
        return (
            <Formik
                initialValues={{
                    ...form_initial_values,
                }}
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
                }) => (
                    <>
                        <LeaveConfirm onDirty={this.showForm} />
                        { show_form && (
                            <form noValidate className='account-form' onSubmit={handleSubmit}>
                                <FormBody scroll_offset='80px'>
                                    <FormSubHeader title={localize('Details')} />
                                    {!this.props.is_virtual &&
                                    <React.Fragment>
                                        <InputGroup className='account-form__fieldset--2-cols'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='first_name'
                                                label={localize('First name')}
                                                value={values.first_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                disabled={this.isChangeableField('first_name')}
                                                error={touched.first_name && errors.first_name}
                                            />
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='last_name'
                                                label={localize('Last name')}
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                disabled={this.isChangeableField('last_name')}
                                                error={touched.last_name && errors.last_name}
                                            />
                                        </InputGroup>
                                        <fieldset className='account-form__fieldset'>
                                            <Field name='place_of_birth'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        { ...field }
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Place of birth')}
                                                        error={
                                                            touched.place_of_birth && errors.place_of_birth
                                                        }
                                                        required
                                                        disabled={form_initial_values.place_of_birth && this.isChangeableField('place_of_birth')}
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={
                                                            ({ value, text }) => setFieldValue('place_of_birth', value ? text : '', true)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <DateOfBirth
                                                name='date_of_birth'
                                                label={localize('Date of birth')}
                                                value={values.date_of_birth}
                                                disabled={is_fully_authenticated}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Field name='citizen'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        { ...field }
                                                        data-lpignore='true'
                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                        type='text'
                                                        label={localize('Citizenship')}
                                                        error={touched.citizen && errors.citizen}
                                                        disabled={form_initial_values.citizen && is_fully_authenticated}
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={
                                                            ({ value, text }) => setFieldValue('citizen', value ? text : '', true)
                                                        }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                    </React.Fragment>
                                    }
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='residence'
                                            label={localize('Country of residence')}
                                            value={values.residence}
                                            required
                                            disabled={this.isChangeableField('residence')}
                                            error={touched.residence && errors.residence}
                                        />
                                    </fieldset>
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='email'
                                            label={localize('Email address')}
                                            value={values.email}
                                            required
                                            disabled={this.isChangeableField('email')}
                                            error={touched.email && errors.email}
                                        />
                                    </fieldset>
                                    {!this.props.is_virtual &&
                                    <React.Fragment>
                                        <fieldset className='account-form__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='phone'
                                                label={localize('Phone number')}
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.phone && errors.phone}
                                            />
                                        </fieldset>
                                        {/* Hide Account Opening Reason, uncomment block below to re-enable */}
                                        {/* <fieldset className='account-form__fieldset'>
                                            {account_opening_reason && is_fully_authenticated ?
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='account_opening_reason'
                                                    label={localize('Account opening reason')}
                                                    value={values.account_opening_reason}
                                                    disabled
                                                />
                                                :
                                                <Dropdown
                                                    placeholder={'Account opening reason'}
                                                    is_align_text_left
                                                    name='account_opening_reason'
                                                    list={account_opening_reason_list}
                                                    value={values.account_opening_reason}
                                                    onChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    error={
                                                        touched.account_opening_reason &&
                                                        errors.account_opening_reason
                                                    }
                                                />
                                            }
                                        </fieldset> */}
                                        {/* Hide Tax Information, uncomment block below to re-enable */}
                                        {/* <FormSubHeader title={localize('Tax information')} />
                                            <fieldset className='account-form__fieldset'>
                                                <Field name='tax_residence_text'>
                                                    {({ field }) => (
                                                        <Autocomplete
                                                            { ...field }
                                                            data-lpignore='true'
                                                            autoComplete='new-password' // prevent chrome autocomplete
                                                            type='text'
                                                            label={localize('Tax residence')}
                                                            error={touched.tax_residence_text && errors.tax_residence_text}
                                                            disabled={tax_residence && is_fully_authenticated}
                                                            list_items={this.props.residence_list}
                                                            onItemSelection={
                                                                ({ value, text }) => setFieldValue('tax_residence_text', value ? text : '', true)
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='tax_identification_number'
                                                    label={localize('Tax identification number')}
                                                    value={values.tax_identification_number}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                        touched.tax_identification_number &&
                                                        errors.tax_identification_number
                                                    }
                                                    disabled={tax_identification_number && is_fully_authenticated}
                                                />
                                            </fieldset> */}
                                        <FormSubHeader title={localize('Address')} />
                                        <div className='account-address__details-section'>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    maxLength={70}
                                                    name='address_line_1'
                                                    label={localize('First line of address')}
                                                    value={values.address_line_1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.address_line_1 && errors.address_line_1}
                                                    required
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
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_city'
                                                    label={localize('Town/City')}
                                                    value={values.address_city}
                                                    error={touched.address_city && errors.address_city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                {
                                                    this.props.states_list.length ?
                                                        <Field name='address_state'>
                                                            {({ field }) => (
                                                                <Autocomplete
                                                                    { ...field }
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={localize('State/Province (optional)')}
                                                                    error={
                                                                        touched.address_state && errors.address_state
                                                                    }
                                                                    list_items={this.props.states_list}
                                                                    onItemSelection={
                                                                        ({ value, text }) => setFieldValue('address_state', value ? text : '', true)
                                                                    }
                                                                />
                                                            )}
                                                        </Field> :
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
                                                        />
                                                }
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_postcode'
                                                    label={localize('Postal/ZIP Code')}
                                                    value={values.address_postcode}
                                                    error={touched.address_postcode && errors.address_postcode}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                        </div>
                                    </React.Fragment>
                                    }
                                    <FormSubHeader title={localize('Email Preference')} />
                                    <fieldset className='account-form__fieldset'>
                                        <Checkbox
                                            name='email_consent'
                                            value={values.email_consent}
                                            onChange={handleChange}
                                            label={localize('Get updates about Deriv products, services and events.')}
                                            defaultChecked={!!values.email_consent}
                                        />
                                    </fieldset>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <div className='account-form__footer-note'>
                                        { localize('Please make sure your information is correct or it may affect your trading experience.') }
                                    </div>
                                    <Button
                                        className={classNames('account-form__footer-btn', {
                                            'btn--primary--green': is_submit_success,
                                        })}
                                        type='submit'
                                        is_disabled={isSubmitting || (
                                            this.props.is_virtual ?
                                                false
                                                :
                                                !!((errors.first_name || !values.first_name) ||
                                                (errors.last_name || !values.last_name) ||
                                                (errors.phone || !values.phone) ||
                                                (errors.tax_identification_number) ||
                                                (errors.place_of_birth || !values.place_of_birth) ||
                                                // (errors.account_opening_reason || !values.account_opening_reason) ||
                                                (errors.address_line_1 || !values.address_line_1) ||
                                                (errors.address_line_2) ||
                                                (errors.address_city || !values.address_city) ||
                                                (errors.address_state) ||
                                                (errors.address_postcode || !values.address_postcode))
                                        )}
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

    componentDidMount() {
        const { fetchResidenceList, fetchStatesList, has_residence } = this.props;

        fetchResidenceList();
        if (has_residence) {
            this.setState({ is_state_loading: true }, () => {
                fetchStatesList().then(() => {
                    this.setState({ is_state_loading: false });
                });
            });
        }

        WS.wait('landing_company', 'get_account_status', 'get_settings').then(() => {
            const { getChangeableFields, is_virtual, account_settings } = this.props;

            const hidden_settings = [
                'account_opening_reason',
                'tax_residence',
                'tax_identification_number',
                'client_tnc_status',
                'country_code',
                'has_secret_answer',
                'is_authenticated_payment_agent',
                'user_hash',
                'country',
                'request_professional_status'];
            const form_initial_values = removeObjProperties(hidden_settings, account_settings);

            this.setState({
                changeable_fields: is_virtual ? [] : getChangeableFields(),
                is_loading       : false,
                form_initial_values,
            });
        });
    }
}

// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        account_settings      : client.account_settings,
        has_residence         : client.has_residence,
        getChangeableFields   : client.getChangeableFields,
        is_fully_authenticated: client.is_fully_authenticated,
        is_virtual            : client.is_virtual,
        residence_list        : client.residence_list,
        states_list           : client.states_list,
        fetchResidenceList    : client.fetchResidenceList,
        fetchStatesList       : client.fetchStatesList,
        refreshNotifications  : client.refreshNotifications,
    }),
)(PersonalDetailsForm);
