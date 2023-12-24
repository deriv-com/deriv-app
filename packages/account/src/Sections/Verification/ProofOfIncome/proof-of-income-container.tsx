import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { AUTH_STATUS_CODES, routes, WS } from '@deriv/shared';
import { AccountStatusResponse } from '@deriv/api-types';
import ProofOfIncomeForm from './proof-of-income-form';
import { populateVerificationStatus } from '../Helpers/verification';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import { getPOOINCStatusMessages, TPoincStatus } from './proof-of-income-configs';
import { TAuthStatusCode } from '../../../Types/common.type';

type TProofOfIncomeContainer = {
    is_switching?: boolean;
    refreshNotifications: () => void;
};
const ProofOfIncomeContainer = ({ is_switching, refreshNotifications }: TProofOfIncomeContainer) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = React.useState<
        Partial<ReturnType<typeof populateVerificationStatus>>
    >({
        allow_document_upload: false,
        allow_poinc_resubmission: false,
        needs_poinc: false,
        income_status: AUTH_STATUS_CODES.NONE,
        is_age_verified: false,
        is_fully_authenticated: false,
    });
    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then((response: DeepRequired<AccountStatusResponse>) => {
                const { get_account_status } = response;
                const {
                    allow_document_upload,
                    allow_poinc_resubmission,
                    income_status,
                    needs_poinc,
                    is_age_verified,
                    is_fully_authenticated,
                } = populateVerificationStatus(get_account_status);
                setAuthenticationStatus({
                    ...authentication_status,
                    ...{
                        allow_document_upload,
                        allow_poinc_resubmission,
                        needs_poinc,
                        income_status,
                        is_age_verified,
                        is_fully_authenticated,
                    },
                });
                setIsLoading(false);
                refreshNotifications();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const handleSubmit = (status: TAuthStatusCode) => {
        setAuthenticationStatus({ ...authentication_status, ...{ income_status: status } });
    };

    const onTryAgain = () => {
        handleSubmit(AUTH_STATUS_CODES.NONE);
    };

    const {
        allow_document_upload,
        allow_poinc_resubmission,
        income_status,
        needs_poinc,
        is_age_verified,
        is_fully_authenticated,
    } = authentication_status;

    const status_content = getPOOINCStatusMessages(income_status as TPoincStatus);

    const should_show_poinc_form =
        allow_document_upload &&
        needs_poinc &&
        is_age_verified &&
        ((allow_poinc_resubmission && income_status === AUTH_STATUS_CODES.LOCKED) ||
            income_status === AUTH_STATUS_CODES.NONE);

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!needs_poinc || !is_fully_authenticated) return <Redirect to={routes.account} />;
    if (should_show_poinc_form) return <ProofOfIncomeForm onSubmit={handleSubmit} />;

    return (
        <VerificationStatus
            icon={status_content.icon}
            status_description={status_content.description}
            status_title={status_content.title}
        >
            {status_content.action_button?.({ onClick: onTryAgain })}
        </VerificationStatus>
    );
};

export default ProofOfIncomeContainer;
