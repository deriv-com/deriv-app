import * as Cookies          from 'js-cookie';
import React                 from 'react';
import { localize }          from 'App/i18n';
import { connect }           from 'Stores/connect';
import { WS }                from 'Services';
import BinarySocket          from '_common/base/socket_base';
import Onfido                from './onfido.jsx';
import { getIdentityStatus } from './proof-of-identity';
import ErrorMessage          from '../../ErrorMessages/LoadErrorMessage';
import Loading               from '../../../../../templates/app/components/loading.jsx';

class ProofOfIdentityContainer extends React.Component {
    state = {
        is_loading        : true,
        api_error         : false,
        onfido_unsupported: false,
        status            : '',
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
            this.setState({ status: 'pending' });
        });
    };

    componentDidMount() {
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            this.getOnfidoServiceToken().then(onfido_service_token => {
                const { identity, document } = this.props.account_status.authentication;
                const { onfido_unsupported } = this.state;
                const has_poa                = !(document && document.status === 'none');
                const status                 = getIdentityStatus(identity, onfido_unsupported);

                this.setState({ is_loading: false, has_poa, status, onfido_service_token });
            });
        });
    }

    render() {
        const {
            is_loading,
            status,
            onfido_service_token,
            has_poa,
            api_error,
        } = this.state;

        if (api_error) return <ErrorMessage error_message={localize('Sorry, there was a connection error. Please try again later.')} />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        return (
            <Onfido
                status={status}
                onfido_service_token={onfido_service_token}
                has_poa={has_poa}
                handleComplete={this.handleComplete}
            />
        );
    }
}

export default connect(
    ({ client }) => ({
        account_status: client.account_status,
    }),
)(ProofOfIdentityContainer);
