import React from 'react';
import { AccountStatusResponse, GetAccountStatus } from '@deriv/api-types';
import { Button, Loading } from '@deriv/components';
import { WS, getPlatformRedirect, platforms, AUTH_STATUS_CODES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import NeedsReview from '../../../Components/poa/status/needs-review';
import ProofOfAddressForm from './proof-of-address-form';
import Submitted from '../../../Components/poa/status/submitted';
import Verified from '../../../Components/poa/status/verified';
import { populateVerificationStatus } from '../Helpers/verification.js';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import { getPOAStatusMessages } from 'Sections/Verification/ProofOfAddress/proof-of-address-utils';

type TProofOfAddressContainer = {
    onSubmit: () => void;
};

type TAuthenticationStatus = Record<
    | 'allow_document_upload'
    | 'allow_poi_resubmission'
    | 'allow_poa_resubmission'
    | 'is_age_verified'
    | 'has_poi'
    | 'has_submitted_poa'
    | 'needs_poa'
    | 'needs_poi'
    | 'poa_address_mismatch'
    | 'resubmit_poa',
    boolean
> & { document_status?: DeepRequired<GetAccountStatus>['authentication']['document']['status'] };

const ProofOfAddressContainer = observer(({ onSubmit }: TProofOfAddressContainer) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = React.useState<TAuthenticationStatus>({
        allow_document_upload: false,
        allow_poi_resubmission: false,
        allow_poa_resubmission: false,
        needs_poi: false,
        needs_poa: false,
        has_poi: false,
        resubmit_poa: false,
        has_submitted_poa: false,
        document_status: undefined,
        is_age_verified: false,
        poa_address_mismatch: false,
    });

    const { client, notifications, common, ui } = useStore();
    const { app_routing_history } = common;
    const { landing_company_shortcode, has_restricted_mt5_account, is_switching } = client;
    const { is_verification_modal_visible } = ui;
    const { refreshNotifications } = notifications;

    const is_mx_mlt = landing_company_shortcode === 'iom' || landing_company_shortcode === 'malta';

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
                const { get_account_status } = response;
                if (get_account_status) {
                    const {
                        allow_document_upload,
                        allow_poa_resubmission,
                        document_status,
                        has_submitted_poa,
                        is_age_verified,
                        needs_poa,
                        needs_poi,
                        poa_address_mismatch,
                    } = populateVerificationStatus(get_account_status);

                    setAuthenticationStatus(authentication_status => ({
                        ...authentication_status,
                        allow_document_upload,
                        allow_poa_resubmission,
                        document_status,
                        has_submitted_poa,
                        is_age_verified,
                        needs_poa,
                        needs_poi,
                        poa_address_mismatch,
                    }));
                    setIsLoading(false);
                    refreshNotifications();
                }
            });
        }
    }, [is_switching, refreshNotifications]);

    const handleResubmit = () => {
        setAuthenticationStatus(authentication_status => ({ ...authentication_status, ...{ resubmit_poa: true } }));
    };

    const onSubmitDocument = (needs_poi: boolean) => {
        setAuthenticationStatus(authentication_status => ({
            ...authentication_status,
            ...{ has_submitted_poa: true, needs_poi },
        }));
        if (is_verification_modal_visible) {
            onSubmit();
        }
    };

    const {
        allow_document_upload,
        allow_poa_resubmission,
        document_status,
        needs_poi,
        resubmit_poa,
        has_submitted_poa,
        is_age_verified,
        poa_address_mismatch,
    } = authentication_status;

    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref ?? '');

    const status_content = React.useMemo(
        () => getPOAStatusMessages(document_status, needs_poi, should_show_redirect_btn),
        [document_status, needs_poi]
    );

    const is_resubmission_required =
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account &&
            document_status &&
            [AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.EXPIRED].includes(
                document_status
            )) ||
        poa_address_mismatch;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (
        !allow_document_upload ||
        (!is_age_verified && !allow_poa_resubmission && document_status === AUTH_STATUS_CODES.NONE && is_mx_mlt)
    )
        return (
            <VerificationStatus
                status_title={status_content.title}
                status_description={status_content.description}
                icon={status_content.icon}
            />
        );
    // if (has_submitted_poa && !poa_address_mismatch)
    //     return <Submitted needs_poi={needs_poi} redirect_button={redirect_button} />;

    if (document_status === AUTH_STATUS_CODES.NONE || is_resubmission_required) {
        return <ProofOfAddressForm is_resubmit={is_resubmission_required} onSubmit={onSubmit} />;
    }

    const buttonOnclick = [AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.EXPIRED].includes(
        document_status
    )
        ? handleResubmit
        : undefined;

    return (
        <VerificationStatus
            status_title={status_content.title}
            status_description={status_content.description}
            icon={status_content.icon}
            action_button={status_content.action_button?.(buttonOnclick)}
        />
    );
});

export default ProofOfAddressContainer;
