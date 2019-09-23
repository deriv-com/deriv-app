// import PropTypes            from 'prop-types';
import DocumentUploader        from '@binary-com/binary-document-uploader';
import classNames              from 'classnames';
import React                   from 'react';
import {
    Button,
    FileDropzone,
    Input }                    from 'deriv-components';
import { Formik }              from 'formik';
import IconClearPhoto          from 'Assets/AccountManagement/ProofOfAddress/icon-clear-photo.svg';
import IconCloudUpload         from 'Assets/AccountManagement/ProofOfAddress/icon-cloud-uploading.svg';
import IconIssuedUnder         from 'Assets/AccountManagement/ProofOfAddress/icon-issued-under.svg';
import IconLessThanEight       from 'Assets/AccountManagement/ProofOfAddress/icon-less-than-8.svg';
import IconOneToSixMonths      from 'Assets/AccountManagement/ProofOfAddress/icon-one-to-six-months.svg';
import IconRecentBank          from 'Assets/AccountManagement/ProofOfAddress/icon-recent-bank.svg';
import IconRecentUtility       from 'Assets/AccountManagement/ProofOfAddress/icon-recent-utility.svg';
import IconRemoveFile          from 'Assets/AccountManagement/icon-remove-file.svg';
import { connect }             from 'Stores/connect';
import {
    validAddress,
    validPostCode,
    validLength }              from 'Utils/Validator/declarative-validation-rules';
import { localize }            from 'App/i18n';
import BinarySocket            from '_common/base/socket_base';
import { WS }                  from 'Services';
import {
    filesize_error_message,
    getSupportedFiles,
    max_document_size,
    supported_filetypes,
    unsupported_file_message } from './constants';
import {
    FormFooter,
    FormBody,
    FormSubHeader }            from '../../../Components/layout-components.jsx';
import Loading                 from '../../../../../templates/app/components/loading.jsx';
import FormSubmitErrorMessage  from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage        from '../../ErrorMessages/LoadErrorMessage';
import DemoMessage             from '../../ErrorMessages/DemoMessage';
import { LeaveConfirm }        from '../../../Components/leave-confirm.jsx';

const upload_message = (
    <>
        <IconCloudUpload className='dc-file-dropzone__message-icon' />
        <div className='dc-file-dropzone__message-subtitle' >
            {localize('Drop file (JPEG  JPG  PNG  PDF  GIF) or click here to upload')}
        </div>
    </>
);

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

class ProofOfAddress extends React.Component {
    state = { document_file: [], is_loading: true, show_form: true }

    // TODO: standardize validations and refactor this
    validateFields = (values) => {
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        if (this.props.is_virtual) return errors;

        const required_fields = ['address_line_1', 'address_city', 'address_state', 'address_postcode'];
        validateValues(val => val, required_fields, localize('This field is required'));

        validateValues(validAddress, localize('Only alphabet is allowed'));

        return errors;
    };

    showForm = show_form => this.setState({ show_form, file_error_message: null });

    handleAcceptedFiles = (files) => {
        if (files.length > 0) {
            console.log(files);
            this.setState({ file_error_message: null, document_file: files });
        }
    }

    handleRejectedFiles = (files) => {
        const isFileTooLarge    = files.length > 0 && files[0].size > max_document_size;
        const hasSupportedFiles = files.filter((file) => getSupportedFiles(file.name));
        if (isFileTooLarge && (hasSupportedFiles.length > 0)) {
            this.setState({
                document_file     : files,
                file_error_message: filesize_error_message,
            });
        } else {
            this.setState({
                document_file     : files,
                file_error_message: unsupported_file_message,
            });
        }
    }

    removeFile = () => {
        this.setState({ file_error_message: null, document_file: [] });
    }

    onSubmit = () => {
        if (!!this.state.file_error_message || (this.state.document_file.length < 1)) return;
        const uploader = new DocumentUploader({ connection: BinarySocket.get() }); // send 'debug: true' here for debugging
        uploader.upload(this.state.document_file).then((api_response) => {
            console.warn(api_response);
        }).catch((error) => {
            this.setState({ upload_error: error });
            console.warn(error);
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
            is_account_authenticated,
            is_loading,
            is_btn_loading,
            is_submit_success,
        } = this.state;

        if (api_initial_load_error) {
            return <LoadErrorMessage error_message={api_initial_load_error} />;
        }
        if (this.props.is_virtual) return <DemoMessage />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        return (
            <Formik
                initialValues={{
                    address_line_1,
                    address_line_2,
                    address_city,
                    address_state,
                    address_postcode,
                    document_file,
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
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_line_1'
                                                    label={localize('First line of address')}
                                                    value={values.address_line_1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_line_2'
                                                    label={localize('Second line of address (optional)')}
                                                    value={values.address_line_2}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_city'
                                                    label={localize('Town/City')}
                                                    value={values.address_city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_state'
                                                    label={localize('State/Province')}
                                                    value={values.address_state}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    name='address_postcode'
                                                    label={localize('Postal/ZIP Code')}
                                                    value={values.address_postcode}
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
                                            <FileDropzone
                                                onDropAccepted={
                                                    this.onDropAccepted = (files) => this.handleAcceptedFiles(files)
                                                }
                                                onDropRejected={
                                                    this.onDropRejected = (files) => this.handleRejectedFiles(files)
                                                }
                                                accept={supported_filetypes}
                                                max_size={max_document_size}
                                                multiple={false}
                                                message={upload_message}
                                                hover_message={localize('Drop files here..')}
                                                error_message={localize('Please upload supported file type.')}
                                                validation_error_message={file_error_message}
                                                value={document_file}
                                            />
                                            {(document_file.length > 0 || !!file_error_message) &&
                                            <div className='account-poa__upload-remove-btn-container'>
                                                <IconRemoveFile
                                                    className={classNames('account-poa__upload-remove-btn', {
                                                        'account-poa__upload-remove-btn--error': !!file_error_message,
                                                    })}
                                                    onClick={this.removeFile}
                                                />
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <Button
                                        className='account-form__footer-btn btn--primary'
                                        type='submit'
                                        has_effect
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
        function getStatusValidations(status_arr) {
            return status_arr.reduce((validations, stats) => {
                validations[stats] = true;
                return validations;
            }, {});
        }
        this.props.fetchResidenceList();
        WS.authorized.storage.getSettings().then((data) => {
            if (data.error) {
                this.setState({ api_initial_load_error: data.error.message });
                return;
            }
            console.warn(data.get_settings);
            this.setState({ ...data.get_settings, is_loading: false });
        });
        WS.authorized.storage.getAccountStatus().then((data) => {
            const { status } = data.get_account_status;
            const {
                document_under_review,
                cashier_locked,
                withdrawal_locked,
                mt5_withdrawal_locked,
                document_needs_action,
                unwelcome,
                ukrts_max_turnover_limit_not_set,
                professional,
            } = getStatusValidations(status);

            console.warn(document_under_review);
            console.warn(cashier_locked);
            console.warn(withdrawal_locked);
            console.warn(mt5_withdrawal_locked);
            console.warn(document_needs_action);
            console.warn(unwelcome);
            console.warn(ukrts_max_turnover_limit_not_set);
            console.warn(professional);

            console.warn(data.get_account_status.status);
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
        is_virtual        : client.is_virtual,
        residence_list    : client.residence_list,
        fetchResidenceList: client.fetchResidenceList,
    }),
)(ProofOfAddress);
