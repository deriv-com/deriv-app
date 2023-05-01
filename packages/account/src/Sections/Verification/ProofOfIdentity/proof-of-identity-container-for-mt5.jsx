import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ErrorMessage from 'Components/error-component';
import IconWithMessage from 'Components/icon-with-message';
import POISubmissionForMT5 from './proof-of-identity-submission-for-mt5.jsx';
import { service_code } from './proof-of-identity-utils';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainerForMt5 = ({
    account_settings,
    account_status,
    fetchResidenceList,
    getChangeableFields,
    height,
    is_from_external,
    is_switching,
    is_virtual,
    onStateChange,
    refreshNotifications,
    citizen_data,
    jurisdiction_selected_shortcode,
    updateAccountStatus,
}) => {
    const [api_error, setAPIError] = React.useState();
    const [residence_list, setResidenceList] = React.useState();
    const [is_status_loading, setStatusLoading] = React.useState(true);

    React.useEffect(() => {
        // only re-mount logic when switching is done
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response_account_status => {
                if (response_account_status.error) {
                    setAPIError(response_account_status.error);
                    setStatusLoading(false);
                    return;
                }
                fetchResidenceList().then(response_residence_list => {
                    if (response_residence_list.error) {
                        setAPIError(response_residence_list.error);
                    } else {
                        setResidenceList(response_residence_list.residence_list);
                    }
                    setStatusLoading(false);
                });
            });
        }
    }, [fetchResidenceList, is_switching]);

    if (is_status_loading || is_switching) {
        return <Loading is_fullscreen={false} />;
    } else if (is_virtual) {
        return (
            <IconWithMessage
                icon='IcPoaVerified'
                message={localize('Switch to your real account to submit your documents')}
                has_button
            />
        );
    } else if (api_error) {
        return <ErrorMessage error_message={api_error?.message || api_error} />;
    }

    const verification_status = populateVerificationStatus(account_status);
    const { idv, has_attempted_idv, identity_last_attempt, is_idv_disallowed, manual, needs_poa, onfido } =
        verification_status;

    const poi_resubmission_cases = ['rejected', 'suspected', 'expired'];

    const has_idv_error =
        identity_last_attempt?.service && service_code.idv && poi_resubmission_cases.includes(idv.status);

    return (
        <POISubmissionForMT5
            account_settings={account_settings}
            has_attempted_idv={has_attempted_idv}
            height={height ?? null}
            identity_last_attempt={identity_last_attempt}
            idv={idv}
            is_from_external={!!is_from_external}
            is_idv_disallowed={is_idv_disallowed}
            manual={manual}
            needs_poa={needs_poa}
            onfido={onfido}
            onStateChange={onStateChange}
            refreshNotifications={refreshNotifications}
            residence_list={residence_list}
            citizen_data={citizen_data}
            has_idv_error={has_idv_error}
            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            getChangeableFields={getChangeableFields}
            updateAccountStatus={updateAccountStatus}
        />
    );
};

export default ProofOfIdentityContainerForMt5;
