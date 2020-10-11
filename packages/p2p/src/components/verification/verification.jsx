import React from 'react';
import { Icon, Checklist } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import './verification.scss';

const Verification = () => {
    const { general_store } = useStores();

    const poiStatusText = status => {
        switch (status) {
            case 'pending':
            case 'rejected':
                return <Localize i18n_default_text='Check your verification status.' />;
            case 'none':
            default:
                return (
                    <Localize i18n_default_text='We’ll need you to upload your documents to verify your identity.' />
                );
            case 'verified':
                return <Localize i18n_default_text='Identity verification is complete.' />;
        }
    };

    const items = () => [
        {
            content: general_store.nickname ? (
                <p>{general_store.nickname}</p>
            ) : (
                <Localize i18n_default_text='Choose your nickname' />
            ),
            status: general_store.nickname ? 'done' : 'action',
            onClick: general_store.nickname ? () => {} : general_store.toggleNicknamePopup,
        },
        {
            content: poiStatusText(general_store.poi_status),
            status: general_store.poi_status === 'verified' ? 'done' : 'action',
            onClick:
                general_store.poi_status === 'verified'
                    ? () => {}
                    : () =>
                          (window.location.href = `${general_store.props.poi_url}?ext_platform_url=${routes.cashier_p2p}`),
            is_disabled: general_store.poi_status !== 'verified' && !general_store.nickname,
        },
    ];

    if (!general_store.is_advertiser && general_store.poi_status === 'verified' && general_store.nickname) {
        return (
            <div className='p2p-blocked-user'>
                <Localize i18n_default_text='Your DP2P cashier has been blocked. Please contact customer support.' />
            </div>
        );
    }

    return (
        <div className='p2p-verification'>
            <Icon icon='IcCashierSendEmail' className='p2p-verification__icon' size={102} />
            <div className='p2p-verification__text'>
                <div className='p2p-verification__text-title'>
                    <Localize i18n_default_text='Please register with us!' />
                </div>
                <div className='p2p-verification__text-description'>
                    <p>
                        <Localize i18n_default_text='To use DP2P, you need to choose a display name (a nickname) and verify your identity.' />
                    </p>
                </div>
            </div>
            <Checklist className='p2p-verification__checklist' items={items()} />
        </div>
    );
};

export default Verification;
