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

    // TODO: pass sdk_token here?
    initOnfido = async (sdk_token) => {
        try {
            const onfido = init({
                containerId: 'onfido',
                language   : {
                    locale: getLanguage().toLowerCase() || 'en',
                },
                token     : sdk_token,
                useModal  : false,
                onComplete: () => { console.log('onComplete '); },
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

    componentDidMount() {
        if (this.props.view === 'onfido') {
            this.initOnfido(this.props.onfido_service_token);
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
                return <div id='onfido' />;
        }
    }
}

export default POI;
