
import PropTypes              from 'prop-types';
import React                  from 'react';
import { init }               from 'onfido-sdk-ui';
import { get as getLanguage } from '_common/language';
import {
    Expired,
    // MissingPersonalDetails,
    Verified,
    Unverified,
    UploadComplete,
    Unsuported,
}                              from './proof-of-identity-messages.jsx';

class POI extends React.Component {
    state = {
        onfido           : null,
        onfido_init_error: false,
    }

    initOnfido = async () => {
        try {
            const onfido = init({
                containerId: 'onfido',
                language   : {
                    locale: getLanguage().toLowerCase() || 'en',
                },
                token     : this.props.onfido_service_token,
                useModal  : false,
                onComplete: this.handleComplete,
                steps     : [
                    'document',
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
    }

    componentDidMount() {
        if (this.props.view === 'onfido') {
            this.initOnfido(this.props.onfido_service_token);
        }
    }

    componentWillUnmount() {
        if (this.state.onfido) {
            this.state.onfido.tearDown();
        }
    }

    render() {
        const { view, has_poa } = this.props;

        switch (view) {
            case 'unsupported':
                return <Unsuported />;
            case 'pending':
                return <UploadComplete has_poa={has_poa} />;
            case 'rejected':
                return <Unverified />;
            case 'verified':
                return <Verified has_poa={has_poa} />;
            case 'expired':
                return <Expired />;
            case 'suspected':
                return <Unverified />;
            default:
                return <div style={{ marginTop: '20px' }}><div id='onfido' /></div>;
        }
    }
}

POI.propTypes = {
    handleComplete      : PropTypes.func,
    has_poa             : PropTypes.bool,
    onfido_service_token: PropTypes.string,
    // TODO: change to enum
    view                : PropTypes.string,
};

export default POI;
// ProofOfIdentityForm.propTypes = {};
