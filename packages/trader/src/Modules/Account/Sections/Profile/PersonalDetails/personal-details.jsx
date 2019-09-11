// import PropTypes        from 'prop-types';
import React            from 'react';
import { WS }           from 'Services';
import { connect }      from 'Stores/connect';
import {
    Autocomplete,
    Checkbox,
    Button,
    Dropdown,
    Input }                          from 'deriv-components';
import { Formik, Field }             from 'formik';
// import { formatDate }                from 'Utils/Date';
import Loading                       from '../../../../../templates/app/components/loading.jsx';
import { FormFooter, FormBody, FormSubHeader } from '../../../Components/layout-components.jsx';

const makeSettingsRequest = (settings, residence_list) => {
    let citizen = residence_list.find(location => location.text === settings.tax_residence_text).value
    let tax_residence = residence_list.find(location => location.text === settings.citizen_text).value
    // const date_of_birth = formatDate(settings.formatted_date_of_birth, 'YYYY-MM-DD');

    const disabled_settings = ['email', 'tax_residence_text', 'citizen_text', 'date_of_birth_human'];
    disabled_settings.forEach(setting => delete settings[setting])
    console.log(settings);
    return { ...settings, citizen, tax_residence };
}

// TODO: localize
const InputGroup = ({ children }) => (
    <fieldset className='account-management-form-fieldset'>
        <div style={{display: 'flex'}}>{children}</div>
    </fieldset>
);

const account_opening_reason_list = [
    {text: 'Speculative', value: 'Speculative'},
    {text: 'Income Earning', value: 'Income Earning'},
    {text: 'Hedging', value: 'Hedging'}
];

class PersonalDetailsForm extends React.Component {
    state = { is_loading: true }

    onSubmit = (values, { setSubmitting }) => {
        const request = makeSettingsRequest(values, this.props.residence_list);
        WS.setSettings(request).then((data) => {
            setSubmitting(false);
            // force request to update settings cache since settings have been updated
            WS.getSettings({ forced: true });
        })
    }

    render() {
        const {
            account_opening_reason,
            date_of_birth,
            first_name,
            last_name,
            citizen,
            email,
            phone,
            tax_identification_number,
            tax_residence,
            email_consent,
            is_loading } = this.state;

        if (is_loading || !this.props.residence_list.length) return <Loading is_fullscreen={false}  className='initial-loader--accounts-modal' />;

        let citizen_text = '';
        let tax_residence_text = '';
        if (this.props.residence_list.length) {
            citizen_text = citizen ?
                this.props.residence_list.find(location => location.value === citizen).text : '';
            tax_residence_text = tax_residence ?
                this.props.residence_list.find(location => location.value === tax_residence).text : '';
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
                validate={values => {
                    let errors = {};
                    if (!values.first_name) {
                      errors.first_name = 'This field is required';
                    }
                    if (!values.last_name) {
                        errors.last_name = 'This field is required';
                    }
                    if (!values.tax_residence_text) {
                        errors.tax_residence_text = 'This field is required';
                    }
                    if (!values.tax_identification_number) {
                        errors.tax_identification_number = 'This field is required'; 
                    }
                    if (!values.phone) {
                        errors.phone = 'This field is required'; 
                    }
                    return errors;
                  }}
            >
                {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              validateField,
              setFieldValue,
            }) => (
                <form className='account-management-form' onSubmit={handleSubmit}>
                    <FormSubHeader title="Personal Details" />
                    <FormBody scroll_offset='90px'>
                        <InputGroup>
                            <Input
                                data-lpignore="true"
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
                                data-lpignore="true"
                                type='text'
                                name='last_name'
                                label='Last name'
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
                                        label='Citizenship'
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
                                label='Email'
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
                                label='Phone Number'
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
                        <FormSubHeader title='Tax information' />
                        <fieldset className='account-management-form-fieldset'>
                            <Field name='tax_residence_text'>
                                {({ field }) => (
                                    <Autocomplete
                                        { ...field }
                                        data-lpignore='true'
                                        type='text'
                                        label='Tax residence'
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
                                label='Tax identification number'
                                value={values.tax_identification_number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                        </fieldset>
                        {errors.tax_identification_number && touched.tax_identification_number && <div>{errors.tax_identification_number}</div>}    
                        <FormSubHeader title='Email Preference' />
                        <fieldset className='account-management-form-fieldset'>
                            <Checkbox
                                name='email_consent'
                                value={values.email_consent}
                                onChange={handleChange}
                                label='Get updates about Deriv products, services and events.'
                                defaultChecked={!!values.email_consent}
                            />
                        </fieldset>
                    </FormBody>
                    <FormFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </FormFooter>
                </form>
            )}
            </Formik>
        )
    }

    componentDidMount() {
        this.props.fetchResidenceList();
        WS.getSettings().then((data) => {
            console.log(data.get_settings);
            this.setState({ ...data.get_settings, is_loading: false });
        });
    }
}
// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        residence_list          : client.residence_list,
        fetchResidenceList      : client.fetchResidenceList
    }),
)(PersonalDetailsForm);
