import React from 'react';
import { GetAccountStatus } from '@deriv/api-types';
import { AUTH_STATUS_CODES, isMobile, formatIDVError, getPlatformRedirect, platforms } from '@deriv/shared';
import { TStores } from '@deriv/stores/types';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import { getIDVStatusMessages } from './proof-of-identity-configs';

type TIdv = {
    handleRequireSubmission: () => void;
    idv: DeepRequired<GetAccountStatus>['authentication']['identity']['services']['idv'];
    is_from_external: boolean;
    needs_poa: boolean;
    redirect_button: boolean | React.ReactElement;
    routeBackTo: (route: string) => void;
    app_routing_history: TStores['common']['app_routing_history'];
    is_already_attempted: TStores['client']['is_already_attempted'];
};

const Idv = ({
    handleRequireSubmission,
    idv,
    is_from_external,
    needs_poa,
    redirect_button,
    routeBackTo,
    app_routing_history,
    is_already_attempted,
}: TIdv) => {
    const { status, submissions_left, last_rejected } = idv;
    const from_platform = getPlatformRedirect(app_routing_history);

    const status_content = getIDVStatusMessages(
        status,
        { needs_poa, is_already_attempted, mismatch_status: formatIDVError(last_rejected, status) },
        !!redirect_button,
        is_from_external
    );

    const onClickRedirectButton = () => {
        const platform = platforms[from_platform.ref as keyof typeof platforms];
        const { is_hard_redirect = false, url = '' } = platform ?? {};
        if (is_hard_redirect) {
            window.location.href = url;
            window.sessionStorage.removeItem('config.platform');
        } else {
            routeBackTo(from_platform.route);
        }
    };

    const onClick = AUTH_STATUS_CODES.VERIFIED ? handleRequireSubmission : onClickRedirectButton;

    if (
        [AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.EXPIRED].some(
            item => item === status
        ) &&
        Number(submissions_left) >= 1
    ) {
        return null;
    }

    return (
        <VerificationStatus
            icon={status_content.icon}
            is_mobile={isMobile()}
            status_description={status_content.description}
            status_title={status_content.title}
        >
            {status_content.action_button?.({ onClick, platform_name: from_platform.name })}
        </VerificationStatus>
    );
};

export default Idv;
