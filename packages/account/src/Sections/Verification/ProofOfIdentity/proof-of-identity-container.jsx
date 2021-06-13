import React from 'react';
import { PropTypes } from 'prop-types';
import { useStateCallback } from '@deriv/components';
// TODO: Showing IDV upload and country selector
// import CountrySelector from 'Components/poi-country-selector/';
// import DocumentUpload from 'Components/poi-idv-document-upload';
import NotRequired from 'Components/poi-not-required';
import Unsupported from 'Components/poi-unsupported';
import Onfido from './onfido.jsx';
import { onfido_status_codes } from './proof-of-identity';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = ({
    account_status,
    refreshNotifications,
    onfido_service_token,
    is_description_enabled = true,
    height,
    redirect_button,
    setAPIError,
}) => {
    const [status, setStatus] = React.useState('');
    const [verification_status, setVerificationStatus] = useStateCallback({});

    const createVerificationConfig = React.useCallback(() => {
        const {
            allow_document_upload,
            identity_status,
            has_poa,
            needs_poa,
            needs_poi,
            documents_supported,
            country_code,
            rejected_reasons,
            submissions_left,
            is_country_supported,
        } = populateVerificationStatus(account_status);

        setVerificationStatus(
            {
                allow_document_upload,
                has_poa,
                needs_poa,
                needs_poi,
                documents_supported,
                country_code,
                submissions_left,
                rejected_reasons,
                is_country_supported,
            },
            () => {
                setStatus(identity_status);
            }
        );
    }, [account_status, setVerificationStatus]);

    // component didMount hook
    React.useEffect(() => {
        createVerificationConfig();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const { is_country_supported } = verification_status;

    // TODO: Showing IDV upload and country selector
    // if (true) return <DocumentUpload />;
    // if (true) return <CountrySelector />;

    if (status === onfido_status_codes.none) return <NotRequired />;
    if (!is_country_supported) return <Unsupported />;

    return (
        <Onfido
            status={status}
            verification_status={verification_status}
            onfido_service_token={onfido_service_token}
            setStatus={setStatus}
            height={height ?? null}
            refreshNotifications={refreshNotifications}
            is_description_enabled={is_description_enabled}
            setAPIError={setAPIError}
            redirect_button={redirect_button}
        />
    );
};

ProofOfIdentityContainer.propTypes = {
    account_status: PropTypes.object,
    addNotificationByKey: PropTypes.func,
    getAccountStatus: PropTypes.func,
    is_description_enabled: PropTypes.bool,
    serviceToken: PropTypes.func,
    notificationEvent: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    refreshNotifications: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    is_mx_mlt: PropTypes.bool,
    height: PropTypes.number,
    redirect_button: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default ProofOfIdentityContainer;
