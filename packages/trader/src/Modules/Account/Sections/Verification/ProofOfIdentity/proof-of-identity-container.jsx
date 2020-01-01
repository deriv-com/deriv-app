import * as Cookies          from 'js-cookie';
import React                 from 'react';
import { localize }          from 'deriv-translations';
import { WS }                from 'Services/ws-methods';
import Onfido                from './onfido.jsx';
import { getIdentityStatus } from './proof-of-identity';
import { Unverified }        from './proof-of-identity-messages.jsx';
import ErrorMessage          from '../../ErrorMessages/LoadErrorMessage';
import Loading               from '../../../../../templates/app/components/loading.jsx';

class ProofOfIdentityContainer extends React.Component {
    is_mounted = false;
    state = {
        is_loading        : true,
        api_error         : false,
        onfido_unsupported: false,
        status            : '',
    };

    onStateChange = (payload) => {
        if (typeof this.props.onStateChange !== 'function') {
            this.setState(payload);
            return; // noop;
        }

        this.setState(payload);
        this.props.onStateChange(payload);
    };

    getOnfidoServiceToken = () => new Promise((resolve) => {
        const onfido_cookie_name       = 'onfido_token';
        const onfido_cookie            = Cookies.get(onfido_cookie_name);
        const unsupported_country_code = 'UnsupportedCountry';

        if (!onfido_cookie) {
            WS.serviceToken({
                service_token: 1,
                service      : 'onfido',
            }).then((response) => {
                if (response.error || !response.service_token) {
                    if (response.error.code === unsupported_country_code) {
                        this.setState({ onfido_unsupported: true });
                    } else {
                        this.setState({ api_error: true, is_loading: false });
                    }
                    resolve();
                    return;
                }

                const { token } = response.service_token;
                const in_90_minutes = (1 / 16);
                Cookies.set(onfido_cookie_name, token, {
                    expires: in_90_minutes,
                    secure : true,
                });
                resolve(token);
            });
        } else {
            resolve(onfido_cookie);
        }
    });

    handleComplete = () => {
        WS.notificationEvent({
            notification_event: 1,
            category          : 'authentication',
            event             : 'poi_documents_uploaded',
        }).then((response) => {
            if (response.error) {
                this.setState({ api_error: true });
                return;
            }
            const payload = { status: 'pending' };
            this.onStateChange(payload);
            // TODO: clean all of this up by simplifying the manually toggled notifications functions
            this.props.removeNotificationMessage({ key: 'authenticate' });
            this.props.removeNotificationByKey({ key: 'authenticate' });
            this.props.removeNotificationMessage({ key: 'needs_poi' });
            this.props.removeNotificationByKey({ key: 'needs_poi' });
            this.props.removeNotificationMessage({ key: 'poi_expired' });
            this.props.removeNotificationByKey({ key: 'poi_expired' });
            if (this.state.needs_poa) this.props.addNotificationByKey('needs_poa');
        });
    };

    componentDidMount() {
        // TODO: Find a better solution for handling no-op instead of using is_mounted flags
        this.is_mounted = true;
        WS.authorized.getAccountStatus().then(response => {
            const { get_account_status } = response;
            this.getOnfidoServiceToken().then(onfido_service_token => {
                const { document, identity, needs_verification } = get_account_status.authentication;
                const has_poa                          = !(document && document.status === 'none');
                const needs_poa                        = needs_verification.length && needs_verification.includes('document');
                const { onfido_unsupported }           = this.state;
                const status                           = getIdentityStatus(identity, onfido_unsupported);
                const unwelcome                        = get_account_status.status.some(account_status => account_status === 'unwelcome');
                if (this.is_mounted) {
                    const payload = { is_loading: false, has_poa, needs_poa, status, onfido_service_token, unwelcome };
                    this.onStateChange(payload);
                    this.props.refreshNotifications();
                }
            });
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const {
            is_loading,
            status,
            onfido_service_token,
            has_poa,
            api_error,
            unwelcome,
        } = this.state;

        if (api_error)  return <ErrorMessage error_message={localize('Sorry, there was a connection error. Please try again later.')} />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (unwelcome)  return <Unverified is_description_enabled={this.props.is_description_enabled} />; // CS manually mark the account as unwelcome / suspends the account

        return (
            <Onfido
                status={status}
                onfido_service_token={onfido_service_token}
                has_poa={has_poa}
                handleComplete={this.handleComplete}
                is_description_enabled={this.props.is_description_enabled}
            />
        );
    }
}

ProofOfIdentityContainer.defaultProps = {
    is_description_enabled: true,
}

export default ProofOfIdentityContainer;
