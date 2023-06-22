import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import { AccountStatusResponse } from '@deriv/api-types';
import PoincUnverified from 'Components/poinc/status/unverified';
import PoincReceived from 'Components/poinc/status/received';
import PoincLimited from 'Components/poinc/status/limited';
import PoincVerified from 'Components/poinc/status/verified';
import PoincNotRequired from 'Components/poinc/status/not-required';
import { populateVerificationStatus } from '../Helpers/verification';
import ProofOfIncomeForm from './proof-of-income-form.jsx';
import { income_status_codes } from './proof-of-income-utils';

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
        income_status: income_status_codes.NONE,
        is_age_verified: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then((response: DeepRequired<AccountStatusResponse>) => {
                const { get_account_status } = response;
                const { allow_document_upload, allow_poinc_resubmission, income_status, needs_poinc, is_age_verified } =
                    populateVerificationStatus(get_account_status);

                setAuthenticationStatus({
                    ...authentication_status,
                    ...{
                        allow_document_upload,
                        allow_poinc_resubmission,
                        needs_poinc,
                        income_status,
                        is_age_verified,
                    },
                });
                setIsLoading(false);
                refreshNotifications();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const handleSubmit = (status: typeof income_status_codes[keyof typeof income_status_codes]) => {
        setAuthenticationStatus({ ...authentication_status, ...{ income_status: status } });
    };

    const { allow_document_upload, allow_poinc_resubmission, income_status, needs_poinc, is_age_verified } =
        authentication_status;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (
        allow_document_upload &&
        needs_poinc &&
        is_age_verified &&
        ((allow_poinc_resubmission && income_status === income_status_codes.LOCKED) ||
            income_status === income_status_codes.NONE)
    ) {
        return <ProofOfIncomeForm onSubmit={handleSubmit} />;
    }
    if (!allow_document_upload || !needs_poinc || (!is_age_verified && income_status === income_status_codes.NONE)) {
        return <PoincNotRequired />;
    }
    if (income_status === income_status_codes.PENDING) return <PoincReceived />;
    if (income_status === income_status_codes.VERIFIED) return <PoincVerified />;
    if (income_status === income_status_codes.REJECTED) return <PoincUnverified onReSubmit={handleSubmit} />;
    if (income_status === income_status_codes.LOCKED) return <PoincLimited />;

    return null;
};

export default ProofOfIncomeContainer;
