import React from 'react';
import { PropTypes } from 'prop-types';
import { useStateCallback } from '@deriv/components';
import Unsupported from 'Components/poi-unsupported';
import IdvDocumentUpload from 'Components/poi-idv-document-upload/poi-idv-document-upload.jsx';
import POISubmission from './proof-of-identity-submission.jsx';
import Onfido from './onfido.jsx';
import IdvContainer from './idv.jsx';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = ({
    account_status,
    refreshNotifications,
    onfido_service_token,
    is_description_enabled = true,
    residence_list,
    height,
    redirect_button,
    setAPIError,
}) => {
    const [verification_status, setVerificationStatus] = useStateCallback({});
    const [require_submission, setRequireSubmission] = React.useState(false);

    const handleRequireSubmission = () => {
        setRequireSubmission(true);
    };

    const createVerificationConfig = React.useCallback(() => {
        const {
            has_poa,
            needs_poa,
            needs_poi,
            idv,
            onfido,
            manual,
            identity_status,
            identity_last_attempt,
        } = populateVerificationStatus(account_status);

        setVerificationStatus({
            has_poa,
            needs_poa,
            needs_poi,
            idv,
            onfido,
            manual,
            identity_status,
            identity_last_attempt,
        });
    }, [account_status, setVerificationStatus]);

    // component didMount hook
    React.useEffect(() => {
        createVerificationConfig();
    }, [createVerificationConfig]);

    const { idv, onfido, manual, identity_status, identity_last_attempt, needs_poa } = verification_status;

    // TODO: Showing IDV upload and country selector
    // TODO: Get country code and pass document. Currently hardcoded for testing
    const document_data = {
        alien_card: {
            display_name: 'Alien Card',
            format: '^[0-9]{6,9}$',
        },
        national_id: {
            display_name: 'National ID',
            format: '^[0-9]{1,9}$',
        },
        passport: {
            display_name: 'Passport',
            format: '^[A-Z0-9]{7,9}$',
        },
    };

    if (true) return <IdvDocumentUpload document_data={document_data} />;
    // if (true) return <CountrySelector />;

    if (identity_status === identity_status_codes.none || require_submission) {
        return (
            <POISubmission
                residence_list={residence_list}
                height={height ?? null}
                is_description_enabled={is_description_enabled}
                onfido_service_token={onfido_service_token}
                idv={idv}
                onfido={onfido}
                needs_poa={needs_poa}
                setAPIError={setAPIError}
                manual={manual}
                refreshNotifications={refreshNotifications}
                redirect_button={redirect_button}
            />
        );
    }

    switch (identity_last_attempt.service) {
        case service_code.idv:
            return (
                <IdvContainer
                    // TODO: start deprecated
                    is_description_enabled={is_description_enabled}
                    redirect_button={redirect_button}
                    // End deprecation
                    idv={idv}
                    residence_list={residence_list}
                    handleRequireSubmission={handleRequireSubmission}
                    setAPIError={setAPIError}
                    refreshNotifications={refreshNotifications}
                    verification_status={verification_status}
                />
            );
        case service_code.onfido:
            return (
                <Onfido
                    // TODO: start deprecated
                    is_description_enabled={is_description_enabled}
                    redirect_button={redirect_button}
                    // End deprecated
                    verification_status={verification_status}
                    handleRequireSubmission={handleRequireSubmission}
                    residence_list={residence_list}
                    onfido={onfido}
                    onfido_service_token={onfido_service_token}
                    height={height ?? null}
                    refreshNotifications={refreshNotifications}
                    setAPIError={setAPIError}
                />
            );
        case service_code.manual:
            return <Unsupported manual={manual} />;
        default:
            return null;
    }
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
