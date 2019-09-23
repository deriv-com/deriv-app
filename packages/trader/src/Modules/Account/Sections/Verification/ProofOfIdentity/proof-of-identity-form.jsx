// import PropTypes        from 'prop-types';
import * as Cookies           from 'js-cookie';
import React                  from 'react';
import { connect }            from 'Stores/connect';
import { WS }                 from 'Services';
import BinarySocket           from '_common/base/socket_base';
import POI                     from './poi.jsx';
import Loading                 from '../../../../../templates/app/components/loading.jsx';

class ProofOfIdentityForm extends React.Component {
    state = {
        is_loading        : true,
        onfido_unsupported: false,
        view              : '',
    };

    getOnfidoServiceToken = () => new Promise((resolve) => {
        const onfido_cookie = Cookies.get('onfido_token');

        if (!onfido_cookie) {
            WS.send({
                service_token: 1,
                service      : 'onfido',
            }).then((response) => {
                if (response.error || !response.service_token) {
                    if (response.error.code === 'UnsupportedCountry') {
                        this.setState({ onfido_unsupported: true });
                    }
                    // TODO: API error:
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
    })

    handleComplete = () =>  new Promise((resolve, reject) => {
        BinarySocket.send({
            notification_event: 1,
            category          : 'authentication',
            event             : 'poi_documents_uploaded',
        }).then((data) => {
            if (data.error) {
                reject();
                return;
            }
            resolve();
        });
    });

    componentDidMount() {
        BinarySocket.wait('authorize', 'get_account_status').then(() => {
            this.getOnfidoServiceToken()
                .then((onfido_service_token) => {
                    const { identity, document, needs_verification } = this.props.account_status.authentication;
                    const { onfido_unsupported } = this.state;
                    const has_poa = (document && document.status === 'none');
                    console.log('identity: ', identity);
                    console.log('document: ', document);
                    console.log('needs_verification: ', needs_verification);
                    console.log(onfido_unsupported);
                    console.log(onfido_service_token);

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
        const { is_loading, view, onfido_service_token, has_poa } = this.state;

        return (
            <>
                {is_loading ?
                    <Loading is_fullscreen={false} className='account___intial-loader' /> :
                    <POI view={view} onfido_service_token={onfido_service_token} has_poa={has_poa} />
                }
            </>
        );
    }
}

// ProofOfIdentityForm.propTypes = {};
export default connect(
    ({ client }) => ({
        is_virtual    : client.is_virtual,
        account_status: client.account_status,
    }),
)(ProofOfIdentityForm);
