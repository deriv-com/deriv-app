import React from 'react';
import { AccountStatusResponse, GetAccountStatus } from '@deriv/api-types';
import { Loading } from '@deriv/components';
import { WS, getPlatformRedirect, platforms, AUTH_STATUS_CODES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import ProofOfAddressForm from './proof-of-address-form';
import { populateVerificationStatus } from '../Helpers/verification.js';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import { getPOAStatusMessages } from './proof-of-address-configs';

type TProofOfAddressContainer = {
    onSubmit: () => void;
};

type TAuthenticationStatus = Record<
    | 'allow_document_upload'
    | 'allow_poi_resubmission'
    | 'allow_poa_resubmission'
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
        document_status: AUTH_STATUS_CODES.NONE,
        poa_address_mismatch: false,
    });

    const { client, notifications, common, ui } = useStore();
    const { app_routing_history } = common;
    const { has_restricted_mt5_account, is_switching } = client;
    const { refreshNotifications } = notifications;
    const { is_mobile, is_verification_modal_visible } = ui;

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

    const onClickRedirect = () => {
        const url = platforms[from_platform.ref as keyof typeof platforms]?.url;
        if (url) {
            window.location.href = url;
            window.sessionStorage.removeItem('config.platform');
        }
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
        poa_address_mismatch,
    } = authentication_status;

    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref ?? '');

    const is_submitted = has_submitted_poa && !poa_address_mismatch;

    const status_content = getPOAStatusMessages(document_status, { needs_poi, is_submitted }, should_show_redirect_btn);

    const is_resubmission_required =
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account &&
            document_status &&
            [AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.EXPIRED].some(
                status => status === document_status
            )) ||
        poa_address_mismatch;

    const should_show_poa_form =
        allow_document_upload && (document_status === AUTH_STATUS_CODES.NONE || is_resubmission_required);

    const buttonOnclick = () => {
        if (
            [AUTH_STATUS_CODES.SUSPECTED, AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.EXPIRED].some(
                status => status === document_status
            )
        ) {
            return handleResubmit;
        }
        if (should_show_redirect_btn) {
            return onClickRedirect;
        }
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (should_show_poa_form) {
        return <ProofOfAddressForm is_resubmit={is_resubmission_required} onSubmit={onSubmitDocument} />;
    }

    return (
        <VerificationStatus
            icon={status_content.icon}
            is_mobile={is_mobile}
            status_description={status_content.description}
            status_title={status_content.title}
        >
            {status_content.action_button?.({ onClick: buttonOnclick(), platform_name: from_platform.name })}
        </VerificationStatus>
    );
});

export default ProofOfAddressContainer;
