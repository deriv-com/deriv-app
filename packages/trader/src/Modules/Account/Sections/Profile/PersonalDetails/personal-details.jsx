// import PropTypes        from 'prop-types';
import React                                   from 'react';
import { Formik, Field }                       from 'formik';
import { localize }                            from 'App/i18n';
import { WS }                                  from 'Services';
import { connect }                             from 'Stores/connect';
import {
    Autocomplete,
    Checkbox,
    Button,
    Dropdown,
    Input }                                    from 'deriv-components';
// import { formatDate }                       from 'Utils/Date';
import { account_opening_reason_list }         from './constants';
import Loading                                 from '../../../../../templates/app/components/loading.jsx';
import { LeaveConfirm }                        from '../../../Components/leave-confirm'
import { FormFooter, FormBody, FormSubHeader } from '../../../Components/layout-components.jsx';

const getResidence = (residence_list, value, type) => residence_list.find(location => location[type === 'text' ? 'value' : 'text'] === value)[type];

const makeSettingsRequest = ({...settings}, residence_list) => {
    let { email_consent, tax_residence_text, citizen_text } = settings;

    email_consent = +email_consent; // checkbox is boolean but api expects number (1 or 0)

    let tax_residence = getResidence(residence_list, tax_residence_text, 'value');
    let citizen       = getResidence(residence_list, citizen_text, 'value');

    const settings_to_be_removed_for_api = ['email', 'tax_residence_text', 'citizen_text', 'email_consent'];
    settings_to_be_removed_for_api.forEach(setting => delete settings[setting]);

    return { ...settings, citizen, tax_residence, email_consent };
}

const isValidPhoneNumber = phone_number => /^\+?((-|\s)*[0-9])*$/.test(phone_number);

const isValidLength = (value, min, max) =>  value.length > min && value.length < max;

const validateFields = values => {
    let errors = {};
    const required_fields = ['first_name', 'last_name', 'tax_residence_text', 'tax_identification_number', 'phone' ];
    required_fields.forEach(required => {
        if (!values[required]) errors[required] = localize('This field is required');
    });

    if (values.phone && !isValidPhoneNumber(values.phone)) {
        errors.phone = localize('Only numbers, hyphens, and spaces are allowed.');
    }  else if (values.phone && !isValidLength(values.phone.trim(), 8, 35)) {
        errors.phone = localize('You should enter 8-35 characters.');
    }

    return errors;
}

const InputGroup = ({ children }) => (
    <fieldset className='account-management-form-fieldset'>
        <div style={{display: 'flex'}}>{children}</div>
    </fieldset>
);

class PersonalDetailsForm extends React.Component {
    state = { is_loading: true, show_form: true, }

    onSubmit = (values, { setSubmitting }) => {
        const request = makeSettingsRequest(values, this.props.residence_list);
        console.log('request: ', request);

        WS.setSettings(request).then(() => {
            setSubmitting(false);
            // force request to update settings cache since settings have been updated
            WS.getSettings({ forced: true });
        })
    }

    showForm = show_form => this.setState({ show_form });

    render() {
        const {
            account_opening_reason,
            // date_of_birth,
            first_name,
            last_name,
            citizen,
            email,
            phone,
            tax_identification_number,
            tax_residence,
            email_consent,
            show_form,
            is_loading } = this.state;

        const { residence_list } = this.props;

        if (is_loading || !residence_list.length) return <Loading is_fullscreen={false}  className='initial-loader--accounts-modal' />;

        let citizen_text = '';
        let tax_residence_text = '';
        if (this.props.residence_list.length) {
            citizen_text = citizen ? getResidence(residence_list, citizen, 'text') : '';
            tax_residence_text = tax_residence ? getResidence(residence_list, tax_residence, 'text') : '';
        }

        // const formatted_date_of_birth = formatDate(date_of_birth)
        return (
            <Formik
                initialValues={{
                    account_opening_reason,
                    first_name,
                    last_name,
                    citizen_text,
                    tax_residence_text,
                    phone,
                    email,
                    email_consent,
                    tax_identification_number
                }}
                onSubmit={this.onSubmit}
                validate={validateFields}
            >
                {({
              values,
              errors,
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
                        <form className='account-management-form' onSubmit={handleSubmit}>
                            <FormSubHeader title={localize('Personal Details')} />
                            <FormBody scroll_offset='90px'>
                                <InputGroup>
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='first_name'
                                        value={values.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label='First name'
                                        required
                                    />
                                    {errors.first_name && touched.first_name && <div>{errors.first_name}</div>}
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='last_name'
                                        label={localize('Last name')}
                                        value={values.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.last_name && touched.last_name && <div>{errors.last_name}</div>}
                                </InputGroup>
                                <fieldset className='account-management-form-fieldset'>
                                    <Field name='citizen_text'>
                                        {({ field }) => (
                                            <Autocomplete
                                                { ...field }
                                                data-lpignore='true'
                                                type='text'
                                                label={localize('Citizenship')}
                                                error={touched.citizen_text && errors.citizen_text}
                                                required
                                                list_items={this.props.residence_list}
                                                onItemSelection={
                                                    (item) => setFieldValue('citizen_text', item.text, true)
                                                }
                                            />
                                        )}
                                    </Field>
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Input
                                        data-lpignore="true"
                                        type='text'
                                        name='email'
                                        label={localize('Email')}
                                        value={values.email}
                                        required
                                        disabled
                                    />
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Input
                                        data-lpignore="true"
                                        type='text'
                                        name='phone'
                                        label={localize('Phone Number')}
                                        value={values.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}
                                        required
                                    />
                                    {errors.phone && touched.phone && <div>{errors.phone}</div>}
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Dropdown
                                        placeholder={'Account opening reason'}
                                        is_align_text_left
                                        name='account_opening_reason'
                                        list={account_opening_reason_list}
                                        value={values.account_opening_reason}
                                        onChange={handleChange}
                                    />
                                    {(errors.account_opening_reason || (touched.account_opening_reason && errors.account_opening_reason)) &&
                                    <span className='fa-dropdown__error-message'>
                                        {errors.account_opening_reason}
                                    </span>
                                    }
                                </fieldset>
                                <FormSubHeader title={localize('Tax information')} />
                                <fieldset className='account-management-form-fieldset'>
                                    <Field name='tax_residence_text'>
                                        {({ field }) => (
                                            <Autocomplete
                                                { ...field }
                                                data-lpignore='true'
                                                type='text'
                                                label={localize('Tax residence')}
                                                error={touched.tax_residence_text && errors.tax_residence_text}
                                                required
                                                list_items={this.props.residence_list}
                                                onItemSelection={
                                                    (item) => setFieldValue('tax_residence_text', item.text, true)
                                                }
                                            />
                                        )}
                                    </Field>
                                </fieldset>
                                <fieldset className='account-management-form-fieldset'>
                                    <Input
                                        data-lpignore="true"
                                        type='text'
                                        name='tax_identification_number'
                                        label={localize('Tax identification number')}
                                        value={values.tax_identification_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </fieldset>
                                {errors.tax_identification_number && touched.tax_identification_number && <div>{errors.tax_identification_number}</div>}    
                                <FormSubHeader title={localize('Email Preference')} />
                                <fieldset className='account-management-form-fieldset'>
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
                                <Button type="submit" disabled={isSubmitting}>
                                    {localize('Submit')}
                                </Button>
                            </FormFooter>
                        </form>
                    )}
                </>
            )}
            </Formik>
        )
    }

    componentDidMount() {
        this.props.fetchResidenceList();
        WS.getSettings().then((data) => {
            console.log('getSettings response: ', data.get_settings);
            this.setState({ ...data.get_settings, is_loading: false });
        });
    }
};
// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        residence_list          : client.residence_list,
        fetchResidenceList      : client.fetchResidenceList
    }),
)(PersonalDetailsForm);
