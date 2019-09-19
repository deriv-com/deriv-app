// import PropTypes        from 'prop-types';
import React                  from 'react';
import {
    Button,
    FileDropzone }            from 'deriv-components';
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

class ProofOfAddress extends React.Component {
    state = { is_loading: true, show_form: true }

    showForm = show_form => this.setState({ show_form });

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
                            <FileDropzone
                                accept='image/png, image/jpeg, image/jpg, image/gif, application/pdf'
                                max_size={8e+6}
                                multiple={false}
                                message={localize('Drop file (JPEG  JPG  PNG  PDF  GIF) or click here to upload')}
                                hover_message={localize('Drop files here..')}
                                error_message={localize('Please choose only one supported file type')}
                            />
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
