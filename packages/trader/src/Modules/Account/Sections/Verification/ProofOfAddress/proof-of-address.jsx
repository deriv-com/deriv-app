// import PropTypes           from 'prop-types';
import React                  from 'react';
import {
    Button,
    FileDropzone,
    Input }                   from 'deriv-components';
import { Formik }             from 'formik';
import IconClearPhoto         from 'Assets/AccountManagement/ProofOfAddress/icon-clear-photo.svg';
import IconCloudUpload        from 'Assets/AccountManagement/ProofOfAddress/icon-cloud-uploading.svg';
import IconIssuedUnder        from 'Assets/AccountManagement/ProofOfAddress/icon-issued-under.svg';
import IconLessThanEight      from 'Assets/AccountManagement/ProofOfAddress/icon-less-than-8.svg';
import IconOneToSixMonths     from 'Assets/AccountManagement/ProofOfAddress/icon-one-to-six-months.svg';
import IconRecentBank         from 'Assets/AccountManagement/ProofOfAddress/icon-recent-bank.svg';
import IconRecentUtility      from 'Assets/AccountManagement/ProofOfAddress/icon-recent-utility.svg';
import { connect }            from 'Stores/connect';
import { localize }           from 'App/i18n';
import { WS }                 from 'Services';
import {
    FormFooter,
    FormBody,
    FormSubHeader }           from '../../../Components/layout-components.jsx';
import Loading                from '../../../../../templates/app/components/loading.jsx';
import FormSubmitErrorMessage from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage       from '../../ErrorMessages/LoadErrorMessage';
import DemoMessage            from '../../ErrorMessages/DemoMessage';
import { LeaveConfirm }       from '../../../Components/leave-confirm.jsx';

const upload_message = (
    <>
        <IconCloudUpload className='dc-file-dropzone__message-icon' />
        <div className='dc-file-dropzone__message-subtitle' >
            {localize('Drop file (JPEG  JPG  PNG  PDF  GIF) or click here to upload')}
        </div>
    </>
);

class ProofOfAddress extends React.Component {
    state = { files: [], is_loading: true, show_form: true }

    showForm = show_form => this.setState({ show_form });

    handleDrop = (files) => {
        if (files.length > 0) {
            console.log(files);
            this.setState({ files });
        }
    }

    onSubmit = () => {
    }

    render() {
        const {
            api_initial_load_error,
            address_line_1,
            address_line_2,
            address_city,
            address_state,
            address_postcode,
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
                        {show_form && (
                            <form className='account-form' onSubmit={this.onSubmit}>
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
                                                onDrop={this.onDrop = (files) => this.handleDrop(files)}
                                                accept='image/png, image/jpeg, image/jpg, image/gif, application/pdf'
                                                max_size={8388608}
                                                multiple={false}
                                                message={upload_message}
                                                hover_message={localize('Drop files here..')}
                                                error_message_type={localize('File type not accepted')}
                                                error_message_size={localize('File size should be 8MB or less')}
                                            />
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
