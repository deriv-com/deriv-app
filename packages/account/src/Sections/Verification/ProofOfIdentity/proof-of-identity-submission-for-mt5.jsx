import React from 'react';
import { AutoHeightWrapper } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import {
    WS,
    isVerificationServiceSupported,
    formatIDVFormValues,
    formatIDVError,
    isIDVReportNotAvailable,
    getIDVNotApplicableOption,
} from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import Unsupported from '../../../Components/poi/status/unsupported';
import OnfidoUpload from './onfido-sdk-view-container';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';
import IdvFailed from '../../../Components/poi/idv-status/idv-failed';
import { IdvDocSubmitOnSignup } from '../../../Components/poi/poi-form-on-signup/idv-doc-submit-on-signup/idv-doc-submit-on-signup';
import { makeSettingsRequest } from '../../../Helpers/utils';

const POISubmissionForMT5 = observer(
    ({
        idv,
        is_idv_disallowed,
        onfido,
        onStateChange,
        citizen_data,
        is_from_external,
        residence_list,
        identity_last_attempt,
    }) => {
        const { isDesktop } = useDevice();
        const [submission_status, setSubmissionStatus] = React.useState(); // submitting
        const [submission_service, setSubmissionService] = React.useState();
        const [idv_mismatch_status, setIdvMismatchStatus] = React.useState(null);

        const { client, notifications, traders_hub } = useStore();
        const { account_settings, getChangeableFields, account_status } = client;
        const { refreshNotifications } = notifications;
        const { is_eu_user } = traders_hub;
        const is_report_not_available = isIDVReportNotAvailable(idv);
        const IDV_NOT_APPLICABLE_OPTION = React.useMemo(() => getIDVNotApplicableOption(), []);
        const shouldSkipIdv = document_id => document_id === IDV_NOT_APPLICABLE_OPTION.id;

        const attempts = account_status?.authentication?.attempts;

        const { service } = attempts?.latest ?? {};
        const { submissions_left: idv_submissions_left, last_rejected, status } = idv;
        const { submissions_left: onfido_submissions_left } = onfido;

        const is_idv_supported =
            service === service_code.idv || isVerificationServiceSupported(residence_list, account_settings, 'idv');
        const is_onfido_supported =
            service === service_code.onfido ||
            (account_settings?.citizen !== 'ng' &&
                isVerificationServiceSupported(residence_list, account_settings, 'onfido'));

        React.useEffect(() => {
            if (citizen_data) {
                if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed && !is_eu_user) {
                    setSubmissionService(service_code.idv);
                    if (
                        [
                            identity_status_codes.rejected,
                            identity_status_codes.suspected,
                            identity_status_codes.expired,
                        ].includes(status)
                    ) {
                        setIdvMismatchStatus(formatIDVError(last_rejected, status, undefined, is_report_not_available));
                    }
                } else if (onfido_submissions_left && is_onfido_supported) {
                    setSubmissionService(service_code.onfido);
                } else {
                    setSubmissionService(service_code.manual);
                }
                setSubmissionStatus(submission_status_code.submitting);
            }
        }, [citizen_data]);

        const handleSelectionNext = () => {
            setSubmissionService(service_code.manual);
        };

        const handlePOIComplete = () => {
            if (onStateChange && typeof onStateChange === 'function') {
                onStateChange(identity_status_codes.pending);
            }
            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        };

        const handleIdvSubmit = async (values, { setSubmitting, setErrors }) => {
            if (shouldSkipIdv(values?.document_type?.id)) {
                handleSelectionNext?.(true);
                return;
            }
            setSubmitting(true);

            const request = makeSettingsRequest(values, [...getChangeableFields()]);

            const data = await WS.setSettings(request);

            if (data.error) {
                setErrors({ error_message: data.error.message });
                setSubmitting(false);
                return;
            }
            const get_settings = WS.authorized.storage.getSettings();

            if (get_settings.error) {
                setErrors({ error_message: get_settings.error.message });
                setSubmitting(false);
                return;
            }

            const submit_data = {
                identity_verification_document_add: 1,
                ...formatIDVFormValues(values, citizen_data.value),
            };

            WS.send(submit_data).then(response => {
                setSubmitting(false);
                if (response.error) {
                    setErrors({ error_message: response.error.message });
                    return;
                }
                handlePOIComplete();
            });
        };

        if (submission_status === submission_status_code.submitting) {
            switch (submission_service) {
                case service_code.idv:
                    return idv_mismatch_status ? (
                        <IdvFailed
                            mismatch_status={idv_mismatch_status}
                            getChangeableFields={getChangeableFields}
                            account_settings={account_settings}
                            residence_list={residence_list}
                            is_from_external={is_from_external}
                            handleSubmit={handlePOIComplete}
                            latest_status={identity_last_attempt}
                            handleSelectionNext={handleSelectionNext}
                        />
                    ) : (
                        <IdvDocSubmitOnSignup
                            citizen_data={citizen_data}
                            onNext={handleIdvSubmit}
                            getChangeableFields={getChangeableFields}
                            account_settings={account_settings}
                        />
                    );
                case service_code.onfido: {
                    const country_code = citizen_data.value;
                    const doc_obj = citizen_data.identity.services.onfido.documents_supported;
                    const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);

                    return (
                        <AutoHeightWrapper height_offset={50}>
                            {({ setRef, height }) => (
                                <div ref={setRef} style={{ height }}>
                                    <OnfidoUpload
                                        account_settings={account_settings}
                                        getChangeableFields={getChangeableFields}
                                        country_code={country_code}
                                        documents_supported={documents_supported}
                                        handleViewComplete={handlePOIComplete}
                                        height={isDesktop ? 620 : height}
                                    />
                                </div>
                            )}
                        </AutoHeightWrapper>
                    );
                }
                case service_code.manual:
                    return (
                        <Unsupported
                            onfido={onfido}
                            country_code={citizen_data.value}
                            is_for_mt5
                            handlePOIforMT5Complete={handlePOIComplete}
                        />
                    );
                default:
                    return null;
            }
        } else {
            return null;
        }
    }
);

export default POISubmissionForMT5;
