import React from 'react';
import { Icon, Checklist } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { Localize, localize } from 'Components/i18next';
import './verification.scss';

const Verification = ({ poi_status }) => {
    const { nickname, toggleNicknamePopup, is_advertiser } = React.useContext(Dp2pContext);

    const items = [
        {
            content: nickname ? (
                <Localize i18n_default_text='Nickname: {{nickname}}' values={{ nickname }} />
            ) : (
                <Localize i18n_default_text='Choose your nickname' />
            ),
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
                    <Localize i18n_default_text='Want to post ads?' />
                </div>
                <div className='p2p-verification__text-description'>
                    <p>
                        <Localize i18n_default_text='Register with us here' />
                    </p>
                    <p>
                        <Localize i18n_default_text='We’ll need you to upload your documents to verify your identity and address.' />
                    </p>
                </div>
            </div>
            <Checklist items={items} />
        </div>
    );
};

export default Verification;
