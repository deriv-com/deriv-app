// import PropTypes           from 'prop-types';
import React                  from 'react';
import {
    Button,
    Input }                   from 'deriv-components';
import { Formik }             from 'formik';
import { localize }           from 'deriv-translations';
import { WS }                 from 'Services/ws-methods';
import { connect }            from 'Stores/connect';
import {
    validAddress,
    validPostCode,
    validLetterSymbol }       from 'Utils/Validator/declarative-validation-rules';
import FileUploaderContainer  from './file-uploader-container.jsx';
import FormSubmitErrorMessage from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage       from '../../ErrorMessages/LoadErrorMessage';
import {
    FormFooter,
    FormBody,
    FormSubHeader }           from '../../../Components/layout-components.jsx';
import { LeaveConfirm }       from '../../../Components/leave-confirm.jsx';
import Loading                from '../../../../../templates/app/components/loading.jsx';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

class ProofOfAddressForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            document_file     : [],
            file_error_message: null,
            is_loading        : true,
            show_form         : true,
        };
    }

    componentDidMount() {
        WS.wait('get_settings').then(() => {
            const {
                address_line_1,
                address_line_2,
                address_city,
                address_state,
                address_postcode,
            } = this.props.account_settings;

            this.setState({
                address_line_1,
                address_line_2,
                address_city,
                address_state,
                address_postcode,
                is_loading: false,
            });
        });
    }

    // TODO: standardize validations and refactor this
    validateFields = (values) => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        const required_fields = ['address_line_1', 'address_city', 'address_postcode'];
        validateValues(val => val, required_fields, localize('This field is required'));

        const permitted_characters = '- . \' # ; : ( ) , @ /';
        const address_validation_message = localize(`Only letters, numbers, space, and these special characters are allowed: ${permitted_characters}`);

        if (values.address_line_1 && !validAddress(values.address_line_1)) {
            errors.address_line_1 = address_validation_message;
        }
        if (values.address_line_2 && !validAddress(values.address_line_2)) {
            errors.address_line_2 = address_validation_message;
        }

        const validation_letter_symbol_message = localize('Only letters, space, hyphen, period, and apostrophe are allowed.');

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = validation_letter_symbol_message;
        }

        if (values.address_state && !validLetterSymbol(values.address_state)) {
            errors.address_state = validation_letter_symbol_message;
        }

        if (values.address_postcode && !validPostCode(values.address_postcode)) {
            errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
        }

        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    onFileDrop = ({ document_file, file_error_message }) => {
        this.setState({ document_file, file_error_message });
    }

    // Settings update is handled here
    onSubmit = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });

        WS.setSettings(values).then((data) => {
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage.getSettings()
                    .then(({ error, get_settings }) => {
                        if (error) {
                            this.setState({ api_initial_load_error: error.message });
                            return;
                        }
                        const {
                            address_line_1,
                            address_line_2,
                            address_city,
                            address_state,
                            address_postcode,
                        } = get_settings;

                        this.setState({
                            address_line_1,
                            address_line_2,
                            address_city,
                            address_state,
                            address_postcode,
                            is_loading: false,
                        });
                    })
                    .then(() => {
                        // upload files
                        this.file_uploader_ref.current.upload().then((api_response) => {
                            if (api_response.warning) {
                                setStatus({ msg: api_response.message });
                                this.setState({ is_btn_loading: false });
                            } else {
                                WS.authorized.storage.getAccountStatus().then(({ error, get_account_status }) => {
                                    if (error) {
                                        this.setState({ api_initial_load_error: error.message });
                                        return;
                                    }
                                    this.setState({
                                        is_btn_loading   : false,
                                        is_submit_success: true,
                                    }, () => {
                                        const { identity, needs_verification } = get_account_status.authentication;
                                        const has_poi   = !(identity && identity.status === 'none');
                                        // TODO: clean all of this up by simplifying the manually toggled notifications functions
                                        const needs_poi = needs_verification.length && needs_verification.includes('identity');
                                        this.props.onSubmit({ has_poi });
                                        this.props.removeNotificationMessage({ key: 'authenticate' });
                                        this.props.removeNotificationByKey({ key: 'authenticate' });
                                        this.props.removeNotificationMessage({ key: 'needs_poa' });
                                        this.props.removeNotificationByKey({ key: 'needs_poa' });
                                        this.props.removeNotificationMessage({ key: 'poa_expired' });
                                        this.props.removeNotificationByKey({ key: 'poa_expired' });
                                        if (needs_poi) {
                                            this.props.addNotificationByKey('needs_poi');
                                        }
                                    });
                                });
                            }
                        }).catch((error) => {
                            setStatus({ msg: error.message });
                        }).then(() => {
                            setSubmitting(false);
                        });
                    });
            }
        });
    }

    render() {
        const {
            api_initial_load_error,
            address_line_1,
            address_line_2,
            address_city,
            address_state,
            address_postcode,
            document_file,
            file_error_message,
            show_form,
            is_btn_loading,
            is_loading,
            is_submit_success,
        } = this.state;

        if (api_initial_load_error) {
            return <LoadErrorMessage error_message={api_initial_load_error} />;
        }
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        return (
            <Formik
                initialValues={{
                    address_line_1,
                    address_line_2,
                    address_city,
                    address_state,
                    address_postcode,
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
                }) => (
                    <>
                        <LeaveConfirm onDirty={this.showForm} />
                        {show_form && (
                            <form noValidate className='account-form' onSubmit={handleSubmit}>
                                <FormBody scroll_offset='80px'>
                                    <FormSubHeader title={localize('Details')} />
                                    <div className='account-poa__details-section'>
                                        <div className='account-poa__details-description'>
                                            <span className='account-poa__details-text'>
                                                {localize('Please ensure that this address is the same as in your proof of address')}
                                            </span>
                                        </div>
                                        <div className='account-poa__details-fields'>
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
                                                    required
                                                />
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
                                    </div>
                                    <FormSubHeader title={localize('Please upload one of the following:')} />
                                    <FileUploaderContainer
                                        onRef={ref => this.file_uploader_ref = ref}
                                        onFileDrop={this.onFileDrop}
                                    />
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <Button
                                        className='account-form__footer-btn'
                                        type='submit'
                                        is_disabled={isSubmitting || (
                                            !!((errors.address_line_1 || !values.address_line_1) ||
                                            (errors.address_line_2) ||
                                            (errors.address_city || !values.address_city) ||
                                            (errors.address_postcode || !values.address_postcode)) ||
                                            ((document_file && document_file.length < 1) ||
                                            !!file_error_message)
                                        )}
                                        has_effect
                                        is_loading={is_btn_loading}
                                        is_submit_success={is_submit_success}
                                        text={localize('Save and submit')}
                                        primary
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

// ProofOfAddressForm.propTypes = {};

export default connect(
    ({ client, ui }) => ({
        account_settings         : client.account_settings,
        addNotificationByKey     : ui.addNotificationMessageByKey,
        removeNotificationMessage: ui.removeNotificationMessage,
        removeNotificationByKey  : ui.removeNotificationByKey,
    }),
)(ProofOfAddressForm);
