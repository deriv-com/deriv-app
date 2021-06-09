import React from 'react';
import { PropTypes } from 'prop-types';
import { useStateCallback } from '@deriv/components';
import { WS } from 'Services/ws-methods';
// import Limited from 'Components/poi-limited';
// import Unverified from 'Components/poi-unverified';
import CountrySelector from 'Components/poi-country-selector/';
import DocumentUpload from 'Components/poi-idv-document-upload';
import NotRequired from 'Components/poi-not-required';
// import RejectedReasons from 'Components/poi-rejected-reasons';
// import ErrorMessage from 'Components/error-component';
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
        } = populateVerificationStatus(account_status);

        // if there is no rejection reasons, continue uploading document
        // const has_no_rejections = !rejected_reasons?.length;
        // setContinueUploading(has_no_rejections);

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
            },
            () => {
                setStatus(identity_status);
            }
        );
    }, [account_status, setVerificationStatus]);

    const handleComplete = () => {
        WS.notificationEvent({
            notification_event: 1,
            category: 'authentication',
            event: 'poi_documents_uploaded',
        }).then(response => {
            if (response.error) {
                setAPIError(true);
                return;
            }
            setStatus('pending');

            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        });
    };
    // component didMount hook
    React.useEffect(() => {
        createVerificationConfig();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        needs_poa,
        // allow_document_upload,
        documents_supported,
        country_code,
        // submissions_left,
        // rejected_reasons,
    } = verification_status;

    // const rejectionStatus = [onfido_status_codes.rejected, onfido_status_codes.suspected];
    // const is_rejected = rejectionStatus.includes(status);
    // const has_rejected_reasons = !!rejected_reasons.length && is_rejected;

    // TODO: These are just for display
    if (true) return <DocumentUpload />;
    if (true) return <CountrySelector />;

    if (status === onfido_status_codes.not_required) return <NotRequired />;
    // if (!submissions_left && is_rejected) return <Limited />;
    // if (has_rejected_reasons && !is_continue_uploading)
    //     return <RejectedReasons rejected_reasons={rejected_reasons} setContinueUploading={setContinueUploading} />;

    return (
        <Onfido
            country_code={country_code}
            documents_supported={documents_supported}
            status={status}
            onfido_service_token={onfido_service_token}
            needs_poa={needs_poa}
            height={height ?? null}
            handleComplete={handleComplete}
            is_description_enabled={is_description_enabled}
            // setContinueUploading={setContinueUploading}
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
