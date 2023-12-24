import React from 'react';
import { useHistory } from 'react-router';
import { Button, Loading } from '@deriv/components';
import { AUTH_STATUS_CODES, getPlatformRedirect, platforms, service_code, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import DemoMessage from '../../../Components/demo-message';
import ErrorMessage from '../../../Components/error-component';
import Unsupported from '../../../Components/poi/status/unsupported';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import { populateVerificationStatus } from '../Helpers/verification';
import IdvContainer from './idv';
import Onfido from './onfido.jsx';
import { getPOIStatusMessages, getUploadCompleteStatusMessages } from './proof-of-identity-configs';
import POISubmission from './proof-of-identity-submission.jsx';

const ProofOfIdentityContainer = observer(
    ({ height, is_from_external, onStateChange, setIsCfdPoiCompleted, getChangeableFields, updateAccountStatus }) => {
        const history = useHistory();
        const [api_error, setAPIError] = React.useState();
        const [has_require_submission, setHasRequireSubmission] = React.useState(false);
        const [residence_list, setResidenceList] = React.useState([]);
        const [is_status_loading, setStatusLoading] = React.useState(true);
        const [authentication_status, setAuthenticationStatus] = React.useState({
            allow_poi_resubmission: false,
            needs_poa: false,
            is_age_verified: false,
            idv: {},
            identity_last_attempt: {},
            identity_status: AUTH_STATUS_CODES.NONE,
            is_idv_disallowed: false,
            manual: {},
            onfido: {},
        });

        const { client, common, notifications, ui } = useStore();

        const {
            account_settings,
            fetchResidenceList,
            is_switching,
            is_high_risk,
            is_withdrawal_lock,
            should_allow_authentication,
            is_virtual,
            is_already_attempted,
        } = client;
        const { app_routing_history, routeBackInApp, is_language_changing } = common;
        const { refreshNotifications } = notifications;
        const { is_mobile } = ui;

        const from_platform = getPlatformRedirect(app_routing_history);

        const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref);
        const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);
        const handleRequireSubmission = () => setHasRequireSubmission(true);
        const country_code = account_settings?.citizen || account_settings?.country_code;
        const handleManualSubmit = () => {
            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        };
        const loadResidenceList = React.useCallback(() => {
            fetchResidenceList().then(response_residence_list => {
                if (response_residence_list.error) {
                    setAPIError(response_residence_list.error);
                } else {
                    setResidenceList(response_residence_list.residence_list);
                }
            });
        }, [fetchResidenceList]);
        React.useEffect(() => {
            if (is_language_changing) {
                loadResidenceList();
            }
        }, [is_language_changing, loadResidenceList]);
        React.useEffect(() => {
            // only re-mount logic when switching is done
            if (!is_switching) {
                setAPIError(null);
                WS.authorized.getAccountStatus().then(response_account_status => {
                    if (response_account_status.error) {
                        setAPIError(response_account_status.error);
                        setStatusLoading(false);
                        return;
                    }
                    loadResidenceList();
                    if (response_account_status.get_account_status) {
                        const {
                            idv,
                            allow_poi_resubmission,
                            identity_last_attempt,
                            identity_status,
                            is_age_verified,
                            is_idv_disallowed,
                            manual,
                            needs_poa,
                            onfido,
                        } = populateVerificationStatus(response_account_status.get_account_status);

                        setAuthenticationStatus(authentication_status => ({
                            ...authentication_status,
                            idv,
                            allow_poi_resubmission,
                            identity_last_attempt,
                            identity_status,
                            is_age_verified,
                            is_idv_disallowed,
                            manual,
                            needs_poa,
                            onfido,
                        }));
                        setStatusLoading(false);
                    }
                });
            }
        }, [loadResidenceList, is_switching]);

        const {
            idv,
            allow_poi_resubmission,
            identity_last_attempt,
            identity_status,
            is_age_verified,
            is_idv_disallowed,
            manual,
            needs_poa,
            onfido,
        } = authentication_status;
        const should_ignore_idv = is_high_risk && is_withdrawal_lock;

        const status_content = getPOIStatusMessages(
            identity_status,
            { needs_poa },
            should_show_redirect_btn,
            is_from_external
        );
        const upload_complete_status_content = getUploadCompleteStatusMessages(
            AUTH_STATUS_CODES.PENDING,
            { needs_poa, is_manual_upload: manual?.status === AUTH_STATUS_CODES.PENDING },
            should_show_redirect_btn,
            is_from_external
        );

        const onClickRedirectButton = () => {
            const platform = platforms[from_platform.ref];
            const { is_hard_redirect = false, url = '' } = platform ?? {};
            if (is_hard_redirect) {
                window.location.href = url;
                window.sessionStorage.removeItem('config.platform');
            } else {
                routeBackTo(from_platform.route);
            }
        };
        const redirect_button = should_show_redirect_btn && (
            <Button primary className='proof-of-identity__redirect' onClick={onClickRedirectButton}>
                <Localize
                    i18n_default_text='Back to {{platform_name}}'
                    values={{ platform_name: from_platform.name }}
                />
            </Button>
        );

        const should_show_mismatch_form =
            idv?.submissions_left > 0 &&
            [AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.EXPIRED].includes(idv.status);

        if (api_error) {
            return <ErrorMessage error_message={api_error?.message || api_error} />;
        } else if (is_status_loading || is_switching || residence_list.length === 0) {
            /**
             * Display loader while waiting for the account status and residence list to be populated
             */
            return <Loading is_fullscreen={false} />;
        } else if (is_virtual) {
            return <DemoMessage />;
        }

        if (!should_allow_authentication && !is_age_verified && identity_status === AUTH_STATUS_CODES.NONE) {
            return (
                <VerificationStatus
                    icon={status_content.icon}
                    is_mobile={is_mobile}
                    status_description={status_content.description}
                    status_title={status_content.title}
                />
            );
        }

        if (
            identity_status === AUTH_STATUS_CODES.NONE ||
            has_require_submission ||
            allow_poi_resubmission ||
            should_show_mismatch_form
        ) {
            return (
                <POISubmission
                    account_settings={account_settings}
                    allow_poi_resubmission={allow_poi_resubmission}
                    has_require_submission={has_require_submission}
                    height={height ?? null}
                    getChangeableFields={getChangeableFields}
                    identity_last_attempt={identity_last_attempt}
                    idv={idv}
                    is_from_external={!!is_from_external}
                    is_idv_disallowed={is_idv_disallowed || should_ignore_idv}
                    manual={manual}
                    needs_poa={needs_poa}
                    onfido={onfido}
                    onStateChange={onStateChange}
                    redirect_button={redirect_button}
                    refreshNotifications={refreshNotifications}
                    residence_list={residence_list}
                    setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                    updateAccountStatus={updateAccountStatus}
                    should_show_mismatch_form={should_show_mismatch_form}
                />
            );
        } else if (
            !identity_last_attempt ||
            // Prioritise verified status from back office. How we know this is if there is mismatch between current statuses (Should be refactored)
            (identity_status === AUTH_STATUS_CODES.VERIFIED && identity_status !== identity_last_attempt.status)
        ) {
            const onClick = () => {
                if (identity_status === AUTH_STATUS_CODES.VERIFIED || identity_status === AUTH_STATUS_CODES.PENDING) {
                    return onClickRedirectButton;
                }
                if (identity_status === AUTH_STATUS_CODES.EXPIRED) {
                    return handleRequireSubmission;
                }
            };
            const content =
                identity_status === AUTH_STATUS_CODES.PENDING ? upload_complete_status_content : status_content;

            return (
                <VerificationStatus
                    icon={content.icon}
                    is_mobile={is_mobile}
                    status_description={content.description}
                    status_title={content.title}
                >
                    {content.action_button?.({ onClick: onClick(), platform_name: from_platform.name })}
                </VerificationStatus>
            );
        }
        switch (identity_last_attempt.service) {
            case service_code.idv:
                return (
                    <IdvContainer
                        account_settings={account_settings}
                        handleRequireSubmission={handleRequireSubmission}
                        getChangeableFields={getChangeableFields}
                        idv={idv}
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                        residence_list={residence_list}
                        routeBackTo={routeBackTo}
                        app_routing_history={app_routing_history}
                        is_already_attempted={is_already_attempted}
                    />
                );
            case service_code.onfido:
                return (
                    <Onfido
                        handleRequireSubmission={handleRequireSubmission}
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        onfido={onfido}
                        manual={manual}
                        setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                        redirect_button={redirect_button}
                        country_code={country_code}
                        handleViewComplete={handleManualSubmit}
                        routeBackTo={routeBackTo}
                        app_routing_history={app_routing_history}
                    />
                );
            case service_code.manual:
                return (
                    <Unsupported
                        manual={manual}
                        country_code={country_code}
                        is_from_external={is_from_external}
                        setIsCfdPoiCompleted={setIsCfdPoiCompleted}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                        handleRequireSubmission={handleRequireSubmission}
                        handleViewComplete={handleManualSubmit}
                        onfido={onfido}
                        routeBackTo={routeBackTo}
                        app_routing_history={app_routing_history}
                    />
                );
            default:
                return null;
        }
    }
);
export default ProofOfIdentityContainer;
