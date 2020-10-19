import * as Cookies from 'js-cookie';
import React from 'react';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import Unverified from 'Components/poi-unverified';
import ErrorMessage from 'Components/error-component';
import Onfido from './onfido.jsx';
import { getIdentityStatus } from './proof-of-identity';

class ProofOfIdentityContainer extends React.Component {
    is_mounted = false;
    state = {
        is_loading: true,
        api_error: false,
        status: '',
    };

    getOnfidoServiceToken = () =>
        new Promise(resolve => {
            const onfido_cookie_name = 'onfido_token';
            const onfido_cookie = Cookies.get(onfido_cookie_name);

            if (!onfido_cookie) {
                this.props
                    .serviceToken({
                        service_token: 1,
                        service: 'onfido',
                    })
                    .then(response => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }

                        const { token } = response.service_token.onfido;
                        const in_90_minutes = 1 / 16;
                        Cookies.set(onfido_cookie_name, token, {
                            expires: in_90_minutes,
                            secure: true,
                            sameSite: 'strict',
                        });
                        resolve(token);
                    });
            } else {
                resolve(onfido_cookie);
            }
        });

    handleComplete = () => {
        this.props
            .notificationEvent({
                notification_event: 1,
                category: 'authentication',
                event: 'poi_documents_uploaded',
            })
            .then(response => {
                if (response.error) {
                    this.setState({ api_error: true });
                    return;
                }
                this.setState({ status: 'pending' });
                // TODO: clean all of this up by simplifying the manually toggled notifications functions
                this.props.removeNotificationMessage({ key: 'authenticate' });
                this.props.removeNotificationByKey({ key: 'authenticate' });
                this.props.removeNotificationMessage({ key: 'needs_poi' });
                this.props.removeNotificationByKey({ key: 'needs_poi' });
                this.props.removeNotificationMessage({ key: 'poi_expired' });
                this.props.removeNotificationByKey({ key: 'poi_expired' });
                if (this.state.needs_poa) this.props.addNotificationByKey('needs_poa');
                if (this.props.onStateChange) this.props.onStateChange({ status: 'pending' });
            });
    };

    componentDidMount() {
        // TODO: Find a better solution for handling no-op instead of using is_mounted flags
        this.is_mounted = true;
        this.props.getAccountStatus().then(response => {
            const { get_account_status } = response;
            this.getOnfidoServiceToken().then(onfido_service_token => {
                // TODO: handle error for onfido_service_token.error.code === 'MissingPersonalDetails'

                const { document, identity, needs_verification } = get_account_status.authentication;
                const has_poa = !(document && document.status === 'none');
                const needs_poa = needs_verification.length && needs_verification.includes('document');
                const onfido_unsupported = !identity.services.onfido.is_country_supported;
                const status = getIdentityStatus(identity, onfido_unsupported);
                const unwelcome = get_account_status.status.some(account_status => account_status === 'unwelcome');
                const allow_document_upload = get_account_status.status.some(
                    account_status => account_status === 'allow_document_upload'
                );
                const documents_supported = identity.services.onfido.documents_supported;
                if (this.is_mounted) {
                    this.setState({
                        is_loading: false,
                        has_poa,
                        needs_poa,
                        status,
                        onfido_service_token,
                        unwelcome,
                        documents_supported,
                        allow_document_upload,
                    });
                    this.props.refreshNotifications();
                    if (this.props.onStateChange) this.props.onStateChange({ status });
                }
            });
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const {
            documents_supported,
            is_loading,
            status,
            onfido_service_token,
            has_poa,
            api_error,
            unwelcome,
            allow_document_upload,
        } = this.state;

        if (api_error)
            return (
                <ErrorMessage
                    error_message={localize('Sorry, there was a connection error. Please try again later.')}
                />
            );
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (unwelcome && !allow_document_upload) return <Unverified />; // CS manually mark the account as unwelcome / suspends the account

        return (
            <Onfido
                documents_supported={documents_supported}
                status={status}
                onfido_service_token={onfido_service_token}
                has_poa={has_poa}
                height={this.props.height ?? null}
                handleComplete={this.handleComplete}
                redirect_button={this.props.redirect_button}
            />
        );
    }
}

export default ProofOfIdentityContainer;
