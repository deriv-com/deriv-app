// import PropTypes           from 'prop-types';
import React                  from 'react';
import {
    Button,
    FileDropzone }            from 'deriv-components';
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
        if (this.state.api_initial_load_error) {
            return <LoadErrorMessage error_message={this.state.api_initial_load_error} />;
        }
        if (this.props.is_virtual) return <DemoMessage />;
        if (this.state.is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        return (
            <>
                <LeaveConfirm onDirty={this.showForm} />
                {this.state.show_form && (
                    <form className='account-form' onSubmit={this.onSubmit}>
                        <FormBody scroll_offset='80px'>
                            <FormSubHeader title={localize('Details')} />
                            <FormSubHeader title={localize('Please upload one of the following:')} />
                            <div className='account-poa__upload-section'>
                                <ul className='account-poa__upload-list'>
                                    <li className='account-poa__upload-box'>
                                        <IconRecentUtility className='account-poa__upload-icon' />
                                    </li>
                                    <li className='account-poa__upload-box'>
                                        <IconRecentBank className='account-poa__upload-icon' />
                                    </li>
                                    <li className='account-poa__upload-box'>
                                        <IconIssuedUnder className='account-poa__upload-icon' />
                                    </li>
                                    <li className='account-poa__upload-box'>
                                        <IconLessThanEight className='account-poa__upload-icon' />
                                    </li>
                                    <li className='account-poa__upload-box'>
                                        <IconOneToSixMonths className='account-poa__upload-icon' />
                                    </li>
                                    <li className='account-poa__upload-box'>
                                        <IconClearPhoto className='account-poa__upload-icon' />
                                    </li>
                                </ul>
                                <div className='account-poa__upload-file'>
                                    <FileDropzone
                                        onDrop={this.onDrop = (files) => this.handleDrop(files)}
                                        accept='image/png, image/jpeg, image/jpg, image/gif, application/pdf'
                                        max_size={8e+6}
                                        multiple={false}
                                        message={upload_message}
                                        hover_message={localize('Drop files here..')}
                                        error_message={localize('Please choose only one supported file type')}
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
        );
    }

    componentDidMount() {
        this.props.fetchResidenceList();
        WS.authorized.storage.getSettings().then((data) => {
            if (data.error) {
                this.setState({ api_initial_load_error: data.error.message });
                return;
            }
            this.setState({ ...data.get_settings, is_loading: false });
        });
        WS.authorized.storage.getAccountStatus().then((data) => {
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
