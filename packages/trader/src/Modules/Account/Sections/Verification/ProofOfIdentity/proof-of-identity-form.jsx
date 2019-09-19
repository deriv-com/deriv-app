// import PropTypes        from 'prop-types';
import React              from 'react';
import { connect }        from 'Stores/connect';
import { WS }             from 'Services';
import {
    Expired,
    MissingPersonalDetails,
    Verified,
    UploadComplete,
    Unsuported
}                         from './proof-of-identity-messages.jsx';
import Loading            from '../../../../../templates/app/components/loading.jsx';

class ProofOfIdentityForm extends React.Component {
    state = { is_loading: true };

    componentDidMount() {

        WS.authorized.storage.getAccountStatus().then((data) => {
            // TODO API error
            console.log('get_account_status: ', data.get_account_status);
            this.setState({ ...data.get_account_status, is_loading: false });
        });
    }

    render() {
        const { is_loading } = this.state;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        const { identity, document, needs_verification } = this.state.authentication;
        return <MissingPersonalDetails />;
        // TODO: Find out how why we need this:
        // if (identity.status === 'none' && document.status === 'none' && !needs_verification.length) {
        //     return <h1>POI not applicable</h1>;
        // }
        // TODO: move to state
        // if (!identity.further_resubmissions_allowed) {
        //     switch (identity.status) {
        //         case 'none':
        //             if (onfido_unsupported) {
        //                 // $('#not_authenticated_uns').setVisibility(1);
        //                 return <Unsuported />;
        //                 // initUnsupported();
        //             } else {
        //                 // initOnfido(onfido_token);
        //             }
        //             break;
        //         case 'pending':
        //             // $('#upload_complete').setVisibility(1);
        //             break;
        //         case 'rejected':
        //             // $('#unverified').setVisibility(1);
        //             break;
        //         case 'verified':
        //             // $('#verified').setVisibility(1);
        //             break;
        //         case 'expired':
        //             // $('#expired_poi').setVisibility(1);
        //             break;
        //         case 'suspected':
        //             // $('#unverified').setVisibility(1);
        //             break;
        //         default:
        //             break;
        //     }
        // } else {
        //     // initOnfido(onfido_token);
        // }
        return (
            <h1>Form</h1>
        );
    }
}

// ProofOfIdentityForm.propTypes = {};
export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
    }),
)(ProofOfIdentityForm);
