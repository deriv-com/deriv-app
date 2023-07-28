import { Button, Loading, useStateCallback } from '@deriv/components';
import { WS, getPlatformRedirect, platforms } from '@deriv/shared';

import Expired from 'Components/poa/status/expired';
import { Localize } from '@deriv/translations';
import NeedsReview from 'Components/poa/status/needs-review';
import NotRequired from 'Components/poa/status/not-required';
import PoaStatusCodes from 'Components/poa/status/status-codes';
import ProofOfAddressForm from './proof-of-address-form.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Submitted from 'Components/poa/status/submitted';
import Unverified from 'Components/poa/status/unverified';
import Verified from 'Components/poa/status/verified';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfAddressContainer = ({
    is_mx_mlt,
    is_switching,
    has_restricted_mt5_account,
    refreshNotifications,
    app_routing_history,
    ...props
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_document_upload: false,
        allow_poi_resubmission: false,
        needs_poi: false,
        needs_poa: false,
        has_poi: false,
        resubmit_poa: false,
        has_submitted_poa: false,
        document_status: null,
        is_age_verified: false,
        poa_address_mismatch: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                const { get_account_status } = response;
                const {
                    allow_document_upload,
                    allow_poa_resubmission,
                    needs_poi,
                    needs_poa,
                    document_status,
                    is_age_verified,
                    poa_address_mismatch,
                } = populateVerificationStatus(get_account_status);
                const has_submitted_poa = document_status === PoaStatusCodes.pending && !allow_poa_resubmission;

                setAuthenticationStatus(
                    {
                        ...authentication_status,
                        ...{
                            allow_document_upload,
                            allow_poa_resubmission,
                            needs_poi,
                            needs_poa,
                            document_status,
                            has_submitted_poa,
                            is_age_verified,
                            poa_address_mismatch,
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

    const handleResubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ resubmit_poa: true } });
    };

    const onSubmitValues = ({ needs_poi }) => {
        setAuthenticationStatus({ ...authentication_status, ...{ has_submitted_poa: true, needs_poi } });
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

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref);

    const redirect_button = should_show_redirect_btn ? (
        <Button
            primary
            className='proof-of-identity__redirect'
            onClick={() => {
                const url = platforms[from_platform.ref]?.url;
                window.location.href = url;
                window.sessionStorage.removeItem('config.platform');
            }}
        >
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    ) : null;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (
        !allow_document_upload ||
        (!is_age_verified && !allow_poa_resubmission && document_status === 'none' && is_mx_mlt)
    )
        return <NotRequired />;
    if (has_submitted_poa && !poa_address_mismatch)
        return <Submitted needs_poi={needs_poi} redirect_button={redirect_button} />;
    if (
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account && ['expired', 'rejected', 'suspected'].includes(document_status)) ||
        poa_address_mismatch
    ) {
        return <ProofOfAddressForm is_resubmit onSubmitting={() => onSubmitValues({ needs_poi })} {...props} />;
    }

    switch (document_status) {
        case PoaStatusCodes.none:
            return <ProofOfAddressForm onSubmitting={() => onSubmitValues({ needs_poi })} {...props} />;
        case PoaStatusCodes.pending:
            return <NeedsReview needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.verified:
            return <Verified needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.expired:
            return <Expired onClick={handleResubmit} />;
        case PoaStatusCodes.rejected:
        case PoaStatusCodes.suspected:
            return <Unverified onClick={handleResubmit} />;
        default:
            return null;
    }
};

ProofOfAddressContainer.propTypes = {
    is_mx_mlt: PropTypes.bool,
    has_restricted_mt5_account: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_verification_modal_visible: PropTypes.bool,
    index: PropTypes.number,
    onSubmit: PropTypes.func,
    refreshNotifications: PropTypes.func,
    app_routing_history: PropTypes.array,
    account_settings: PropTypes.object,
    addNotificationMessageByKey: PropTypes.func,
    is_eu: PropTypes.bool,
    fetchResidenceList: PropTypes.func,
    fetchStatesList: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    states_list: PropTypes.array,
};

export default ProofOfAddressContainer;
