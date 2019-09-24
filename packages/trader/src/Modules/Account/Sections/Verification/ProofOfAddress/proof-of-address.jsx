// import PropTypes            from 'prop-types';
import React                   from 'react';
import {
    Button,
    Input }                    from 'deriv-components';
import { Formik }              from 'formik';
import IconClearPhoto          from 'Assets/AccountManagement/ProofOfAddress/icon-clear-photo.svg';
import IconIssuedUnder         from 'Assets/AccountManagement/ProofOfAddress/icon-issued-under.svg';
import IconLessThanEight       from 'Assets/AccountManagement/ProofOfAddress/icon-less-than-8.svg';
import IconOneToSixMonths      from 'Assets/AccountManagement/ProofOfAddress/icon-one-to-six-months.svg';
import IconRecentBank          from 'Assets/AccountManagement/ProofOfAddress/icon-recent-bank.svg';
import IconRecentUtility       from 'Assets/AccountManagement/ProofOfAddress/icon-recent-utility.svg';
import { connect }             from 'Stores/connect';
import {
    validAddress,
    validPostCode,
    validLetterSymbol }        from 'Utils/Validator/declarative-validation-rules';
import { localize }            from 'App/i18n';
import { WS }                  from 'Services';
import UploadFile              from './upload-file.jsx';
import {
    FormFooter,
    FormBody,
    FormSubHeader }            from '../../../Components/layout-components.jsx';
import ButtonLoading           from '../../../Components/button-loading.jsx';
import Loading                 from '../../../../../templates/app/components/loading.jsx';
import FormSubmitErrorMessage  from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage        from '../../ErrorMessages/LoadErrorMessage';
import DemoMessage             from '../../ErrorMessages/DemoMessage';
import DocumentNeedsReview     from '../VerificationMessages/DocumentNeedsReview';
import DocumentsSubmitted      from '../VerificationMessages/DocumentsSubmitted';
import DocumentsExpired        from '../VerificationMessages/DocumentsExpired';
import DocumentsVerified       from '../VerificationMessages/DocumentsVerified';
import { LeaveConfirm }        from '../../../Components/leave-confirm.jsx';
import { Unverified }          from '../ProofOfIdentity/proof-of-identity-messages.jsx';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

// TODO: standardize validations and refactor this
const makeSettingsRequest = ({ ...settings }) => {
    const {
        address_line_1,
        address_line_2,
        address_city,
        address_state,
        address_postcode } = settings;

    const settings_to_be_removed_for_api = [
        'address_line_1',
        'address_line_2',
        'address_city',
        'address_state',
        'address_postcode',
        'document_file',
    ];

    settings_to_be_removed_for_api.forEach(setting => delete settings[setting]);

    return {
        ...settings,
        address_line_1,
        address_line_2,
        address_city,
        address_state,
        address_postcode,
    };
};

class ProofOfAddress extends React.Component {
    constructor(props) {
        super(props);
        this.document_uploader_ref = React.createRef();
        this.state = {
            is_loading        : true,
            is_resubmit       : false,
            needs_poi         : true,
            show_form         : true,
            document_file     : [],
            file_error_message: null,
        };
    }

    handleResubmit = () => {
        this.setState({ is_resubmit: false });
    }

    // TODO: standardize validations and refactor this
    validateFields = (values) => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        if (this.props.is_virtual) return errors;

        const required_fields = ['address_line_1', 'address_city', 'address_state', 'address_postcode'];
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

    onSubmit = (values, { setStatus, setSubmitting }) => {
        this.setState({ is_btn_loading: true });

        // Settings update is handled here
        setStatus({ msg: '' });
        const request = makeSettingsRequest(values);
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
                        this.setState({ api_initial_load_error: response.error.message });
                        return;
                    }
                    this.setState({ ...response.get_settings, is_loading: false });
                });
            }
        });

        // Check if uploaded document is present after validation
        if (!!this.state.file_error_message || (this.state.document_file && this.state.document_file.length < 1)) {
            setStatus({ msg: localize('Error occured with document file. Please try again') });
            return;
        }

        // Upload document
        this.document_uploader_ref.current.upload().then((api_response) => {
            this.setState({ is_btn_loading: false });
            if (api_response.warning) {
                setStatus({ msg: api_response.message });
            } else {
                this.setState({ is_submit_success: true });
            }
        }).catch((error) => {
            setStatus({ msg: error.message });
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
            document_is_suspect,
            document_expired,
            document_verified,
            // document_needs_action,
            document_under_review,
            file_error_message,
            needs_poi,
            show_form,
            is_loading,
            is_btn_loading,
            is_submit_success,
        } = this.state;

        if (api_initial_load_error) {
            return <LoadErrorMessage error_message={api_initial_load_error} />;
        }
        if (this.props.is_virtual) return <DemoMessage />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (document_under_review) return <DocumentNeedsReview />;
        if (document_verified) return <DocumentsVerified needs_poi={needs_poi} />;
        if (document_expired) return <DocumentsExpired onClick={this.handleResubmit} />;
        if (is_submit_success) return <DocumentsSubmitted needs_poi={needs_poi} />;
        if (document_is_suspect) return <Unverified />;

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
                            <form className='account-form' onSubmit={handleSubmit}>
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
                                                    label={localize('State/Province')}
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
                                    <div className='account-poa__upload-section'>
                                        <ul className='account-poa__upload-list'>
                                            <li className='account-poa__upload-box'>
                                                <IconRecentUtility className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('A recent utility bill (e.g. electricity, water, gas, phone or internet)')}
                                                </div>
                                            </li>
                                            <li className='account-poa__upload-box'>
                                                <IconRecentBank className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('A recent bank statement or government-issued letter with your name and address')}
                                                </div>
                                            </li>
                                            <li className='account-poa__upload-box'>
                                                <IconIssuedUnder className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('Issued under your name with your current address')}
                                                </div>
                                            </li>
                                            <li className='account-poa__upload-box'>
                                                <IconLessThanEight className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('Less than 8MB')}
                                                </div>
                                            </li>
                                            <li className='account-poa__upload-box'>
                                                <IconOneToSixMonths className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('1 - 6 months old')}
                                                </div>
                                            </li>
                                            <li className='account-poa__upload-box'>
                                                <IconClearPhoto className='account-poa__upload-icon' />
                                                <div className='account-poa__upload-item'>
                                                    {localize('A clear colour photo or scanned image')}
                                                </div>
                                            </li>
                                        </ul>
                                        <div className='account-poa__upload-file'>
                                            <UploadFile
                                                ref={this.document_uploader_ref}
                                                onFileDrop={this.onFileDrop}
                                            />
                                        </div>
                                    </div>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <Button
                                        className='account-form__footer-btn btn--primary'
                                        type='submit'
                                        is_disabled={isSubmitting || (
                                            this.props.is_virtual ?
                                                false
                                                :
                                                !!((errors.address_line_1 || !values.address_line_1) ||
                                                (errors.address_line_2) ||
                                                (errors.address_city || !values.address_city) ||
                                                (errors.address_state || !values.address_state) ||
                                                (errors.address_postcode || !values.address_postcode)) ||
                                                ((document_file && document_file.length < 1) ||
                                                !!file_error_message)
                                        )}
                                        has_effect
                                        is_loading={is_btn_loading && <ButtonLoading />}
                                        is_submit_success={is_submit_success}
                                        text={localize('Save and submit')}
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
        WS.authorized.getSettings().then((data) => {
            if (data.error) {
                this.setState({ api_initial_load_error: data.error.message });
                return;
            }
            this.setState({ ...data.get_settings, is_loading: false });
        });
        WS.authorized.getAccountStatus().then((data) => {
            const { authentication } = data.get_account_status;

            const { identity, document } = authentication;

            if (identity.status === 'none') this.setState({ needs_poi: false });
            if (document.status === 'pending') this.setState({ document_under_review: true });
            if (document.status === 'expired') this.setState({ document_is_expired: true, is_resubmit: true });
            if (document.status === 'verified') this.setState({ document_is_verified: true });
            if (document.status === 'suspected') this.setState({ document_is_suspect: true });

            if (data.get_account_status.status &&
                data.get_account_status.status.some(state => state === 'authenticated')
            ) {
                this.setState({ is_account_authenticated: true });
            }
        });
    }
}

// ProofOfAddress.propTypes = {};

export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(ProofOfAddress);
