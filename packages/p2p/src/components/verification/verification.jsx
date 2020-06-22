import React from 'react';
import { Icon, Checklist } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { Localize, localize } from 'Components/i18next';
import './verification.scss';

const Verification = () => {
    const { nickname, toggleNicknamePopup, is_advertiser, poi_status } = React.useContext(Dp2pContext);

    const items = [
        {
            content: nickname ? <p>{nickname}</p> : <Localize i18n_default_text='Choose your nickname' />,
            status: nickname ? 'done' : 'action',
            onClick: nickname ? () => {} : toggleNicknamePopup,
        },
        {
            content: (
                <Localize
                    i18n_default_text='We’ll need you to upload your documents to verify 
            your identity'
                />
            ),
            status: poi_status === 'verified' ? 'done' : 'action',
            onClick: () => (window.location.href = '/account/proof-of-identity'),
            is_disabled: !nickname,
        },
    ];

    if (!is_advertiser && poi_status === 'verified' && nickname) {
        return <div>{localize('Your P2P cashier has been blocked. Please contact customer support')}</div>;
    }

    return (
        <div className='p2p-verification'>
            <Icon icon='IcCashierSendEmail' className='p2p-verification__icon' size={102} />
            <div className='p2p-verification__text'>
                <div className='p2p-verification__text-title'>
                    <Localize i18n_default_text='Would you like to post P2P ads?' />
                </div>
                <div className='p2p-verification__text-description'>
                    <p>
                        <Localize i18n_default_text='To use DP2P, you need to choose a display name (a nickname) and verify your identity.' />
                    </p>
                </div>
            </div>
            <Checklist items={items} />
        </div>
    );
};

export default Verification;
