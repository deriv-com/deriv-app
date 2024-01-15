import React from 'react';
import { usePoiPoaStatus } from '../../hooks';
import SendEmailIcon from '../../public/ic-send-email.svg';
import { Checklist } from '../Checklist';
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
    const { data } = usePoiPoaStatus();
    const { isP2PPoaRequired, poaStatus, poiStatus } = data || {};

    const redirectToVerification = (route: string) => {
        const search = window.location.search;
        let updatedUrl = `${route}?ext_platform_url=/cashier/p2p`;

        if (search) {
            const urlParams = new URLSearchParams(search);
            const updatedUrlParams = new URLSearchParams(updatedUrl);
            urlParams.forEach((value, key) => updatedUrlParams.append(key, value));
            updatedUrl = `${updatedUrl}&${urlParams.toString()}`;
        }
        window.location.href = updatedUrl;
    };

    const checklistItems = [
        {
            is_disabled: poiStatus === 'pending',
            onClick: () => {
                if (poiStatus !== 'verified') redirectToVerification('/account/proof-of-identity');
            },
            status: poiStatus === 'verified' ? 'done' : 'action',
            text: getPoiAction(poiStatus),
        },
        ...(isP2PPoaRequired
            ? [
                  {
                      is_disabled: poaStatus === 'pending',
                      onClick: () => {
                          if (poaStatus !== 'verified') redirectToVerification('/account/proof-of-address');
                      },
                      status: poiStatus === 'verified' ? 'done' : 'action',
                      text: getPoaAction(poaStatus),
                  },
              ]
            : []),
    ];

    return (
        <div className='p2p-v2-verification'>
            <SendEmailIcon className='p2p-v2-verification__icon' />
            <span className='p2p-v2-verification__text'>
                <strong>Verify your P2P account</strong>
            </span>
            <span className='p2p-v2-verification__text'>Verify your identity and address to use Deriv P2P.</span>
            <Checklist items={checklistItems} />
        </div>
    );
};

export default Verification;
