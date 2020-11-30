import PropTypes from 'prop-types';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { init } from 'onfido-sdk-ui';
import { isMobile } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import UploadComplete from 'Components/poi-upload-complete';
import Unsupported from 'Components/poi-unsupported';
import Expired from 'Components/poi-expired';
import OnfidoFailed from 'Components/poi-onfido-failed';
import Verified from 'Components/poi-verified';
import onfido_phrases from 'Constants/onfido-phrases';
import { onfido_status_codes } from './proof-of-identity';

const onfido_container_id = 'onfido';

const OnfidoContainer = ({ height }) => {
    return (
        <ThemedScrollbars is_bypassed={isMobile()} height={height}>
            <div className='onfido-container'>
                <div id={onfido_container_id} />
            </div>
        </ThemedScrollbars>
    );
};

export default class Onfido extends React.Component {
    state = {
        onfido: null,
        onfido_init_error: false,
    };

    initOnfido = async () => {
        try {
            const { documents_supported } = this.props;
            const onfido = await init({
                containerId: onfido_container_id,
                language: {
                    locale: getLanguage().toLowerCase() || 'en',
                    phrases: onfido_phrases,
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
        const { status, height } = this.props;

        if (status === onfido_status_codes.onfido) return <OnfidoContainer height={height} />;

        switch (status) {
            case onfido_status_codes.unsupported:
                return <Unsupported {...this.props} />;
            case onfido_status_codes.pending:
                return <UploadComplete {...this.props} />;
            case onfido_status_codes.rejected:
                return <OnfidoFailed {...this.props} />;
            case onfido_status_codes.verified:
                return <Verified {...this.props} />;
            case onfido_status_codes.expired:
                return <Expired {...this.props} />;
            case onfido_status_codes.suspected:
                return <OnfidoFailed {...this.props} />;
            default:
                return null;
        }
    }
}

Onfido.propTypes = {
    documents_supported: PropTypes.array,
    handleComplete: PropTypes.func,
    has_poa: PropTypes.bool,
    onfido_service_token: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    status: PropTypes.oneOf(Object.keys(onfido_status_codes)),
};
