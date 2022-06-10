import PropTypes from 'prop-types';
import React from 'react';
import { income_status_codes, poinc_documents_list } from './proof-of-income-utils';
import { Loading, useStateCallback } from '@deriv/components';
import { WS } from '@deriv/shared';
import PoincUnverified from 'Components/poinc-unverified';
import PoincReceived from 'Components/poinc-received';
import PoincLimited from 'Components/poinc-limited';
import PoincVerified from 'Components/poinc-verified';
import PoincNotRequired from 'Components/poinc-not-required';
import ProofOfIncomeForm from './proof-of-income-form.jsx';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIncomeContainer = ({ is_switching, refreshNotifications }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_document_upload: false,
        needs_poinc: false,
        income_status: null,
        is_age_verified: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                const { get_account_status } = response;
                const { allow_document_upload, income_status, needs_poinc, is_age_verified } =
                    populateVerificationStatus(get_account_status);

                setAuthenticationStatus(
                    {
                        ...authentication_status,
                        ...{
                            allow_document_upload,
                            needs_poinc,
                            income_status,
                            is_age_verified,
                        },
                    },
                    () => {
                        setIsLoading(false);
                        refreshNotifications();
                    }
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const onSubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ income_status: 'pending' } });
    };
    const onReSubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ income_status: 'none' } });
    };

    const { allow_document_upload, income_status, needs_poinc, is_age_verified } = authentication_status;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!allow_document_upload || !needs_poinc || (!is_age_verified && income_status === 'none'))
        return <PoincNotRequired />;

    switch (income_status) {
        case income_status_codes.none:
            return <ProofOfIncomeForm onSubmit={onSubmit} poinc_documents_list={poinc_documents_list} />;
        case income_status_codes.pending:
            return <PoincReceived />;
        case income_status_codes.verified:
            return <PoincVerified />;
        case income_status_codes.rejected:
            return <PoincUnverified onReSubmit={onReSubmit} />;
        case income_status_codes.suspected:
            return <PoincLimited />;
        default:
            return null;
    }
};

ProofOfIncomeContainer.propTypes = {
    is_switching: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default ProofOfIncomeContainer;
