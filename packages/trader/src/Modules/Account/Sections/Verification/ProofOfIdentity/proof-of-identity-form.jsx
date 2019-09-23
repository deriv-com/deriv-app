import * as Cookies     from 'js-cookie';
import React            from 'react';
import { localize }     from 'App/i18n';
import { connect }      from 'Stores/connect';
import { WS }           from 'Services';
import BinarySocket     from '_common/base/socket_base';
import POI              from './poi.jsx';
import Loading          from '../../../../../templates/app/components/loading.jsx';
import ApiErrorMessage  from '../../ErrorMessages/LoadErrorMessage';

class ProofOfIdentityForm extends React.Component {
    state = {
        is_loading        : true,
        api_error         : false,
        onfido_unsupported: false,
        view              : '',
    };

    getOnfidoServiceToken = () => new Promise((resolve) => {
        const onfido_cookie = Cookies.get('onfido_token');

        if (!onfido_cookie) {
            WS.serviceToken({
                service_token: 1,
                service      : 'onfido',
            }).then((response) => {
                if (response.error || !response.service_token) {
                    if (response.error.code === 'UnsupportedCountry') {
                        this.setState({ onfido_unsupported: true });
                    } else {
                        this.setState({ api_error: true, is_loading: false });
                    }
                    resolve();
                    return;
                }

                const { token } = response.service_token;
                const in_90_minutes = 1 / 16;
                Cookies.set('onfido_token', token, {
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
        }).then((data) => {
            if (data.error) {
                this.setState({ api_error: true });
                return;
            }
            this.setState({ view: 'pending' });
        });
    };

    componentDidMount() {
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            this.getOnfidoServiceToken().then(onfido_service_token => {
                const { identity, document } = this.props.account_status.authentication;
                const { onfido_unsupported } = this.state;
                const has_poa                = !!(document && document.status === 'none');

                // handle in in account.jsx:
                // const is_not_high_risk_client = (identity.status === 'none' && document.status === 'none' && !needs_verification.length);

                if (!identity.further_resubmissions_allowed) {
                    switch (identity.status) {
                        case 'none':
                            if (onfido_unsupported) {
                                this.setState({ view: 'unsupported' });
                                break;
                            }
                            this.setState({ view: 'onfido', onfido_service_token });
                            break;
                        case 'pending':
                            this.setState({ view: 'pending' });
                            break;
                        case 'rejected':
                            this.setState({ view: 'rejected' });
                            break;
                        case 'verified':
                            this.setState({ view: 'verified' });
                            break;
                        case 'expired':
                            this.setState({ view: 'expired' });
                            break;
                        case 'suspected':
                            this.setState({ view: 'suspected' });
                            break;
                        default:
                            break;
                    }
                } else {
                    this.setState({ view: 'onfido', onfido_service_token  });
                }
                this.setState({ is_loading: false, has_poa });
            });
        });
    }

    render() {
        const {
            is_loading,
            view,
            onfido_service_token,
            has_poa,
            api_error,
        } = this.state;

        if (api_error) return <ApiErrorMessage error_message={localize('Sorry, there was a connection error. Please try again later.')} />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        return (
            <POI
                view={view}
                onfido_service_token={onfido_service_token}
                has_poa={has_poa}
                handleComplete={this.handleComplete}
            />
        );
    }
}

export default connect(
    ({ client }) => ({
        is_virtual    : client.is_virtual,
        account_status: client.account_status,
    }),
)(ProofOfIdentityForm);
