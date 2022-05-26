import PropTypes from 'prop-types';
import React from 'react';
import { Loading, useStateCallback } from '@deriv/components';
import { WS } from '@deriv/shared';
import Expired from 'Components/poinc-expired';
import Unverified from 'Components/poinc-unverified';
import NeedsReview from 'Components/poinc-needs-review';
import Submitted from 'Components/poinc-submitted';
import Verified from 'Components/poinc-verified';
import NotRequired from 'Components/poinc-not-required';
import { income_status_codes } from './proof-of-income-utils';
import ProofOfIncomeForm from './proof-of-income-form.jsx';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIncomeContainer = ({ is_switching, refreshNotifications }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_document_upload: false,
        // allow_poinc_resubmission: false, ask BE if it will be implemented
        needs_poinc: false,
        has_poinc: false,
        // resubmit_poinc: false,
        has_submitted_poinc: false,
        proof_of_income_status: null,
        is_age_verified: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                const { get_account_status } = response;
                const {
                    allow_document_upload,
                    /* allow_poinc_resubmission, */
                    proof_of_income_status,
                    is_age_verified,
                } = populateVerificationStatus(get_account_status);
                const has_submitted_poinc =
                    proof_of_income_status === income_status_codes.pending; /* && !allow_poinc_resubmission */

                setAuthenticationStatus(
                    {
                        ...authentication_status,
                        ...{
                            allow_document_upload,
                            // allow_poinc_resubmission,
                            proof_of_income_status,
                            has_submitted_poinc,
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

    // const handleResubmit = () => {
    //     setAuthenticationStatus({ ...authentication_status, ...{ resubmit_poinc: true } }); //check if it will be implemented on BE
    // };

    const onSubmit = ({ needs_poinc }) => {
        setAuthenticationStatus({ ...authentication_status, ...{ has_submitted_poinc: true, needs_poinc } });
    };

    const {
        allow_document_upload,
        // allow_poinc_resubmission,
        proof_of_income_status,
        needs_poinc,
        // resubmit_poinc,
        has_submitted_poinc,
        is_age_verified,
    } = authentication_status;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    // if (
    //     !allow_document_upload ||
    //     (!is_age_verified /* && !allow_poinc_resubmission */ && proof_of_income_status === 'none') should be uncommented after connecting to BE
    // )
    //     return <NotRequired />;

    if (has_submitted_poinc) return <Submitted />;

    // if (resubmit_poinc || allow_poinc_resubmission ) {
    //     return <ProofOfIncomeForm onSubmit={() => onSubmit({ needs_poinc })} />; need to clarify from BE if resubmission will be implemented
    // }

    switch (proof_of_income_status) {
        case income_status_codes.none:
            return <ProofOfIncomeForm onSubmit={() => onSubmit({ needs_poinc })} />;
        case income_status_codes.pending:
            return <NeedsReview />;
        case income_status_codes.verified:
            return <Verified />;
        // case income_status_codes.expired:
        //     return <Expired onClick={handleResubmit} />;
        case income_status_codes.rejected:
            return <Unverified />;
        // case income_status_codes.suspected:
        //     return <Unverified />;
        default:
            return null;
    }
};

ProofOfIncomeContainer.propTypes = {
    is_switching: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default ProofOfIncomeContainer;
