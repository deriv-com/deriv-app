import React from 'react';
import {
    Autocomplete,
    Loading,
    Button,
    Input,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
    FormSubmitErrorMessage,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import {
    isMobile,
    removeEmptyPropertiesFromObject,
    validAddress,
    validPostCode,
    validLetterSymbol,
    validLength,
    getLocation,
} from '@deriv/shared';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import FormFooter from 'Components/form-footer';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import LoadErrorMessage from 'Components/load-error-message';
import LeaveConfirm from 'Components/leave-confirm';
import FileUploaderContainer from 'Components/file-uploader-container';

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
            document_file: [],
            file_error_message: null,
            is_loading: true,
            show_form: true,
        };
    }

    componentDidMount() {
        const { fetchResidenceList, fetchStatesList } = this.props;

        fetchResidenceList().then(() => {
            Promise.all([fetchStatesList(), WS.wait('get_settings')]).then(() => {
                const {
                    address_line_1,
                    address_line_2,
                    address_city,
                    address_state,
                    address_postcode,
                    citizen,
                    tax_identification_number,
                    tax_residence,
                } = this.props.account_settings;

                if (this.props.is_eu) {
                    this.setState({
                        citizen,
                        tax_identification_number,
                        tax_residence,
                    });
                }

                this.setState({
                    address_line_1,
                    address_line_2,
                    address_city,
                    address_state,
                    address_postcode,
                    is_loading: false,
                });
            });
        });
    }

    // TODO: standardize validations and refactor this
    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        const required_fields = ['address_line_1', 'address_city'];
        validateValues(val => val, required_fields, localize('This field is required'));

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

        const validation_letter_symbol_message = localize(
            'Only letters, space, hyphen, period, and apostrophe are allowed.'
        );

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = validation_letter_symbol_message;
        }

        // only add state/province validation for countries that don't have states list fetched from API
        if (values.address_state && !validLetterSymbol(values.address_state) && this.props.states_list?.length < 1) {
            errors.address_state = validation_letter_symbol_message;
        }

        if (values.address_postcode) {
            if (!validLength(values.address_postcode, { min: 0, max: 20 })) {
                errors.address_postcode = localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('Postal/ZIP code'),
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

    onFileDrop = ({ document_file, file_error_message }) => {
        this.setState({ document_file, file_error_message });
    };

    // Settings update is handled here
    onSubmit = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });
        let form_values = values;

        if (this.props.is_eu) {
            const { citizen, tax_residence, tax_identification_number } = this.state;
            form_values = removeEmptyPropertiesFromObject({
                ...values,
                citizen,
                tax_identification_number,
                tax_residence,
            });
        }

        WS.setSettings(form_values).then(data => {
            if (data.error) {
                setStatus({ msg: data.error.message });
                this.setState({ is_btn_loading: false });
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage
                    .getSettings()
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
                        this.file_uploader_ref.current
                            .upload()
                            .then(api_response => {
                                if (api_response.warning) {
                                    setStatus({ msg: api_response.message });
                                    this.setState({ is_btn_loading: false });
                                } else {
                                    WS.authorized.storage.getAccountStatus().then(({ error, get_account_status }) => {
                                        if (error) {
                                            this.setState({ api_initial_load_error: error.message });
                                            return;
                                        }
                                        this.setState(
                                            {
                                                is_btn_loading: false,
                                                is_submit_success: true,
                                            },
                                            () => {
                                                const {
                                                    identity,
                                                    needs_verification,
                                                } = get_account_status.authentication;
                                                const has_poi = !(identity && identity.status === 'none');
                                                // TODO: clean all of this up by simplifying the manually toggled notifications functions
                                                const needs_poi =
                                                    needs_verification.length &&
                                                    needs_verification.includes('identity');
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
                                            }
                                        );
                                    });
                                }
                            })
                            .catch(error => {
                                setStatus({ msg: error.message });
                                this.setState({ is_btn_loading: false });
                            })
                            .then(() => {
                                setSubmitting(false);
                                this.setState({ is_btn_loading: false });
                            });
                    });
            }
        });
    };

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

        const form_initial_values = {
            address_line_1,
            address_line_2,
            address_city,
            address_state,
            address_postcode,
        };

        if (api_initial_load_error) {
            return <LoadErrorMessage error_message={api_initial_load_error} />;
        }
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        const mobile_scroll_offset = status && status.msg ? '200px' : '154px';

        if (form_initial_values.address_state) {
            form_initial_values.address_state = this.props.states_list.length
                ? getLocation(this.props.states_list, form_initial_values.address_state, 'text')
                : form_initial_values.address_state;
        } else {
            form_initial_values.address_state = '';
        }

        return (
            <Formik initialValues={form_initial_values} onSubmit={this.onSubmit} validate={this.validateFields}>
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
                        <LeaveConfirm onDirty={isMobile() ? this.showForm : null} />
                        {show_form && (
                            <form noValidate className='account-form' onSubmit={handleSubmit}>
                                <FormBody scroll_offset={isMobile() ? mobile_scroll_offset : '80px'}>
                                    <FormSubHeader title={localize('Details')} />
                                    <div className='account-poa__details-section'>
                                        <div className='account-poa__details-description'>
                                            <span className='account-poa__details-text'>
                                                {localize(
                                                    'Please ensure that this address is the same as in your proof of address'
                                                )}
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
                                                    label={localize('First line of address*')}
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
                                                                        label={localize('State/Province (optional)')}
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
                                                                error={touched.address_state && errors.address_state}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue('address_state', e.target.value, true)
                                                                }
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
                                                    />
                                                )}
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_postcode'
                                                    label={localize('Postal/ZIP code*')}
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
                                        onRef={ref => (this.file_uploader_ref = ref)}
                                        onFileDrop={this.onFileDrop}
                                        getSocket={WS.getSocket}
                                    />
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <Button
                                        className='account-form__footer-btn'
                                        type='submit'
                                        is_disabled={
                                            isSubmitting ||
                                            !!(
                                                errors.address_line_1 ||
                                                !values.address_line_1 ||
                                                errors.address_line_2 ||
                                                errors.address_city ||
                                                !values.address_city ||
                                                errors.address_postcode
                                            ) ||
                                            (document_file && document_file.length < 1) ||
                                            !!file_error_message
                                        }
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

export default connect(({ client, ui }) => ({
    account_settings: client.account_settings,
    is_eu: client.is_eu,
    addNotificationByKey: ui.addNotificationMessageByKey,
    removeNotificationMessage: ui.removeNotificationMessage,
    removeNotificationByKey: ui.removeNotificationByKey,
    states_list: client.states_list,
    fetchResidenceList: client.fetchResidenceList,
    fetchStatesList: client.fetchStatesList,
}))(ProofOfAddressForm);
