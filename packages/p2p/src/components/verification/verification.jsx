import React from 'react';
import { Icon, Checklist } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { Localize } from 'Components/i18next';
import './verification.scss';

const Verification = () => {
    const { nickname, toggleNicknamePopup, is_advertiser, poi_status, poi_url } = React.useContext(Dp2pContext);

    const poiStatusText = status => {
        switch (status) {
            case 'pending':
            case 'rejected':
                return <Localize i18n_default_text='Check your verification status.' />;
            case 'none':
            default:
                return (
                    <Localize
                        i18n_default_text='We’ll need you to upload your documents to verify 
    your identity.'
                    />
                );
            case 'verified':
                return <Localize i18n_default_text='Your identity is verified.' />;
        }
    };

    const items = [
        {
            content: nickname ? (
                <Localize i18n_default_text='Nickname: {{nickname}}' values={{ nickname }} />
            ) : (
                <Localize i18n_default_text='Choose your nickname.' />
            ),
            status: nickname ? 'done' : 'action',
            onClick: nickname ? () => {} : toggleNicknamePopup,
        },
        {
            content: poiStatusText(poi_status),
            status: poi_status === 'verified' ? 'done' : 'action',
            onClick: poi_status === 'verified' ? () => {} : () => (window.location.href = poi_url),
            is_disabled: poi_status !== 'verified' && !nickname,
        },
    ];

    if (!is_advertiser && poi_status === 'verified' && nickname) {
        return (
            <div className='p2p-blocked-user'>
                <Localize i18n_default_text='Your P2P cashier has been blocked. Please contact customer support.' />
            </div>
        );
    }

    return (
        <div className='p2p-verification'>
            <Icon icon='IcCashierSendEmail' className='p2p-verification__icon' size={102} />
            <div className='p2p-verification__text'>
                <div className='p2p-verification__text-title'>
                    <Localize i18n_default_text='Want to post ads?' />
                </div>
                <div className='p2p-verification__text-description'>
                    <p>
                        <Localize i18n_default_text='Register with us here' />
                    </p>
                    <p>
                        <Localize i18n_default_text='To use DP2P, you need to choose a display name (a nickname) and verify your identity.' />
                    </p>
                </div>
            </div>
            <Checklist className='p2p-verification__checklist' items={items} />
        </div>
    );
};

export default Verification;
