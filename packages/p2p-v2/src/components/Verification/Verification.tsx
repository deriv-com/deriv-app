import React from 'react';
import { useHistory } from 'react-router-dom';
import { Checklist } from '@/components';
import { useDevice, usePoiPoaStatus } from '@/hooks';
import { DerivLightIcCashierSendEmailIcon } from '@deriv/quill-icons';
import { Loader, Text } from '@deriv-com/ui';
import './Verification.scss';

const getPoiAction = (status: string | undefined) => {
    switch (status) {
        case 'pending':
            return 'Identity verification in progress.';
        case 'rejected':
            return 'Identity verification failed. Please try again.';
        case 'verified':
            return 'Identity verification complete.';
        default:
            return 'Upload documents to verify your identity.';
    }
};

const getPoaAction = (status: string | undefined) => {
    switch (status) {
        case 'pending':
            return 'Address verification in progress.';
        case 'rejected':
            return 'Address verification failed. Please try again.';
        case 'verified':
            return 'Address verification complete.';
        default:
            return 'Upload documents to verify your address.';
    }
};

const Verification = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data, isLoading } = usePoiPoaStatus();
    const { isP2PPoaRequired, isPoaPending, isPoaVerified, isPoiPending, isPoiVerified, poaStatus, poiStatus } =
        data || {};

    const redirectToVerification = (route: string) => {
        const search = window.location.search;
        let updatedUrl = `${route}?ext_platform_url=/cashier/p2p`;

        if (search) {
            const urlParams = new URLSearchParams(search);
            const updatedUrlParams = new URLSearchParams(updatedUrl);
            urlParams.forEach((value, key) => updatedUrlParams.append(key, value));
            updatedUrl = `${updatedUrl}&${urlParams.toString()}`;
        }
        history.push(updatedUrl);
    };

    const checklistItems = [
        {
            isDisabled: isPoiPending,
            onClick: () => {
                if (!isPoiVerified) redirectToVerification('/account/proof-of-identity');
            },
            status: isPoiVerified ? 'done' : 'action',
            testId: 'dt_p2p_v2_verification_poi_arrow_button',
            text: getPoiAction(poiStatus),
        },
        ...(isP2PPoaRequired
            ? [
                  {
                      isDisabled: isPoaPending,
                      onClick: () => {
                          if (!isPoaVerified) redirectToVerification('/account/proof-of-address');
                      },
                      status: isPoaVerified ? 'done' : 'action',
                      testId: 'dt_p2p_v2_verification_poa_arrow_button',
                      text: getPoaAction(poaStatus),
                  },
              ]
            : []),
    ];

    if (isLoading) return <Loader />;

    return (
        <div className='p2p-v2-verification'>
            <DerivLightIcCashierSendEmailIcon className='p2p-v2-verification__icon' height={128} width={128} />
            <Text className='p2p-v2-verification__text' size={isMobile ? 'lg' : 'md'} weight='bold'>
                Verify your P2P account
            </Text>
            <Text align='center' className='p2p-v2-verification__text' size={isMobile ? 'lg' : 'md'}>
                Verify your identity and address to use Deriv P2P.
            </Text>
            <Checklist items={checklistItems} />
        </div>
    );
};

export default Verification;
