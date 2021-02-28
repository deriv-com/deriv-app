import * as Cookies from 'js-cookie';
import React from 'react';
import { Loading, usePrevious, useStateCallback } from '@deriv/components';
import { localize } from '@deriv/translations';
import Limited from 'Components/poi-limited';
import Unverified from 'Components/poi-unverified';
import NotRequired from 'Components/poi-not-required';
import RejectedReasons from 'Components/poi-rejected-reasons';
import ErrorMessage from 'Components/error-component';
import Onfido from './onfido.jsx';
import { getIdentityStatus, onfido_status_codes } from './proof-of-identity';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = ({
    account_status,
    addNotificationByKey,
    getAccountStatus,
    serviceToken,
    notificationEvent,
    removeNotificationByKey,
    refreshNotifications,
    removeNotificationMessage,
    onStateChange,
    is_mx_mlt,
    height,
    redirect_button,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [api_error, setAPIError] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [documents_supported, setDocumentsSupported] = React.useState(null);
    const [country_code_key, setCountryCode] = React.useState(null);
    const [onfido_service_token, setOnfidoServiceToken] = React.useState(null);
    const [verification_status, setVerificationStatus] = useStateCallback({});
    const [submissions_left_key, setSubmissionsLeft] = React.useState(null);
    const [rejected_reasons_key, setRejectedReasons] = React.useState([]);
    const [is_continue_uploading, setContinueUploading] = React.useState(false);
    const [identity_status_key, setIdentityStatus] = React.useState(false);
    const previous_account_status = usePrevious(account_status);

    const getOnfidoServiceToken = React.useCallback(
        () =>
            new Promise(resolve => {
                const onfido_cookie_name = 'onfido_token';
                const onfido_cookie = Cookies.get(onfido_cookie_name);

                if (!onfido_cookie) {
                    serviceToken({
                        service_token: 1,
                        service: 'onfido',
                    }).then(response => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }

                        const { token } = response.service_token.onfido;
                        const in_90_minutes = 1 / 16;
                        Cookies.set(onfido_cookie_name, token, {
                            expires: in_90_minutes,
                            secure: true,
                            sameSite: 'strict',
                        });
                        resolve(token);
                    });
                } else {
                    resolve(onfido_cookie);
                }
            }),
        [serviceToken]
    );

    const createVerificationConfig = React.useCallback(
        (account_status_obj, onfido_token) => {
            const {
                allow_document_upload,
                has_poa,
                needs_poa,
                is_unwelcome,
                onfido_supported_docs,
                country_code,
                rejected_reasons,
                submissions_left,
            } = populateVerificationStatus(account_status_obj);

            const { identity, needs_verification } = account_status_obj.authentication;

            const identity_status = getIdentityStatus(identity, needs_verification, is_mx_mlt);

            const has_no_rejections = !rejected_reasons?.length;

            setVerificationStatus({ allow_document_upload, has_poa, needs_poa, is_unwelcome }, () => {
                setStatus(identity_status);
                setIdentityStatus(identity?.status);
                if (onfido_token) {
                    setOnfidoServiceToken(onfido_token);
                }
                setDocumentsSupported(onfido_supported_docs);
                setCountryCode(country_code);
                setSubmissionsLeft(submissions_left);
                setRejectedReasons(rejected_reasons);
                setContinueUploading(has_no_rejections);
                refreshNotifications();
                if (onStateChange) onStateChange({ status });
            });
        },
        [is_mx_mlt, onStateChange, refreshNotifications, setVerificationStatus, status]
    );

    const handleComplete = () => {
        notificationEvent({
            notification_event: 1,
            category: 'authentication',
            event: 'poi_documents_uploaded',
        }).then(response => {
            if (response.error) {
                setAPIError(true);
                return;
            }
            setStatus('pending');
            // TODO: clean all of this up by simplifying the manually toggled notifications functions
            removeNotificationMessage({ key: 'authenticate' });
            removeNotificationByKey({ key: 'authenticate' });
            removeNotificationMessage({ key: 'needs_poi' });
            removeNotificationByKey({ key: 'needs_poi' });
            removeNotificationMessage({ key: 'poi_expired' });
            removeNotificationByKey({ key: 'poi_expired' });
            if (verification_status?.needs_poa) addNotificationByKey('needs_poa');
            if (onStateChange) onStateChange({ status: 'pending' });
        });
    };

    // component didMount hook
    React.useEffect(() => {
        getAccountStatus().then(response => {
            const { get_account_status } = response;
            getOnfidoServiceToken().then(token => {
                // TODO: handle error for onfido_service_token.error.code === 'MissingPersonalDetails'
                createVerificationConfig(get_account_status, token);
            });
            setIsLoading(false);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // component didUpdate hook, checks previous account_status and current account_status to handle account switching
    React.useEffect(() => {
        if (account_status && previous_account_status) {
            if (previous_account_status !== account_status) {
                createVerificationConfig(account_status);
            }
        }
    }, [createVerificationConfig, previous_account_status, account_status]);

    const { has_poa, is_unwelcome, allow_document_upload } = verification_status;
    const is_rejected = identity_status_key === onfido_status_codes.rejected;
    const has_rejected_reasons = !!rejected_reasons_key.length && is_rejected;

    if (api_error)
        return (
            <ErrorMessage error_message={localize('Sorry, there was a connection error. Please try again later.')} />
        );
    if (is_loading || status.length === 0) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (is_unwelcome && !allow_document_upload) return <Unverified />;
    if (status === onfido_status_codes.not_required) return <NotRequired />;
    if (!submissions_left_key && is_rejected) return <Limited />;
    if (has_rejected_reasons && !is_continue_uploading)
        return <RejectedReasons rejected_reasons={rejected_reasons_key} setContinueUploading={setContinueUploading} />;

    return (
        <Onfido
            country_code={country_code_key}
            documents_supported={documents_supported}
            status={status}
            onfido_service_token={onfido_service_token}
            has_poa={has_poa}
            height={height ?? null}
            handleComplete={handleComplete}
            redirect_button={redirect_button}
        />
    );
};

export default ProofOfIdentityContainer;
