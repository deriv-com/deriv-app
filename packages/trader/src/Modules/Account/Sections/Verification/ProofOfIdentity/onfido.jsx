import { ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { init } from 'onfido-sdk-ui';
import { getLanguage } from '@deriv/translations';
import { Expired, OnfidoFailed, Verified, UploadComplete, Unsupported } from './proof-of-identity-messages.jsx';
import { onfido_status_codes } from './proof-of-identity';

const onfido_container_id = 'onfido';
const OnfidoContainer = () => (
    <ThemedScrollbars
        autoHide
        style={{
            height: '100%',
        }}
    >
        <div className='onfido-container'>
            <div id={onfido_container_id} />
        </div>
    </ThemedScrollbars>
);

class Onfido extends React.Component {
    state = {
        onfido: null,
        onfido_init_error: false,
    };

    initOnfido = () => {
        try {
            const { documents_supported } = this.props;
            const onfido = init({
                containerId: onfido_container_id,
                language: {
                    locale: getLanguage().toLowerCase() || 'en',
                },
                token: this.props.onfido_service_token,
                useModal: false,
                onComplete: this.handleComplete,
                steps: [
                    {
                        type: 'document',
                        options: {
                            documentTypes: {
                                passport: documents_supported.some(doc => /Passport/g.test(doc)),
                                driving_licence: documents_supported.some(doc => /Driving Licence/g.test(doc)),
                                national_identity_card: documents_supported.some(doc =>
                                    /National Identity Card/g.test(doc)
                                ),
                            },
                        },
                    },
                    'face',
                ],
            });
            this.setState({ onfido });
        } catch (err) {
            this.setState({ onfido_init_error: true });
        }
    };

    handleComplete = () => {
        this.state.onfido.tearDown();
        this.props.handleComplete();
    };

    componentDidMount() {
        if (this.props.status === onfido_status_codes.onfido) {
            this.initOnfido();
        }
    }

    componentWillUnmount() {
        if (this.state.onfido) {
            this.state.onfido.tearDown();
        }
    }

    render() {
        const { status, has_poa } = this.props;

        if (status === onfido_status_codes.onfido) return <OnfidoContainer />;

        switch (status) {
            case onfido_status_codes.unsupported:
                return <Unsupported />;
            case onfido_status_codes.pending:
                return <UploadComplete has_poa={has_poa} />;
            case onfido_status_codes.rejected:
                return <OnfidoFailed />;
            case onfido_status_codes.verified:
                return <Verified has_poa={has_poa} />;
            case onfido_status_codes.expired:
                return <Expired />;
            case onfido_status_codes.suspected:
                return <OnfidoFailed />;
            default:
                return null;
        }
    }
}

Onfido.propTypes = {
    documents_supported: PropTypes.array,
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    onfido_service_token: PropTypes.string,
    status: PropTypes.oneOf(Object.keys(onfido_status_codes)),
};

export default Onfido;
