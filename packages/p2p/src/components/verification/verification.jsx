import React from 'react';
import { Icon, Checklist, Loading } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { Localize, localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import './verification.scss';

const Verification = ({ poi_status }) => {
    const { nickname, toggleNicknamePopup, setIsAdvertiser, is_advertiser, poi_url } = React.useContext(Dp2pContext);
    const [is_loading, setIsLoading] = React.useState(false);

    const checkVerified = () => {
        setIsLoading(true);

        requestWS({ p2p_advertiser_info: 1 }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;

                if (!p2p_advertiser_info.is_approved) {
                    window.location.href = poi_url;
                } else {
                    setIsAdvertiser(p2p_advertiser_info.is_approved);
                    setIsLoading(false);
                }
            }
        });
    };

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
            content:
                poi_status === 'pending' ? (
                    <Localize i18n_default_text='Check your verification status' />
                ) : (
                    <Localize
                        i18n_default_text='We’ll need you to upload your documents to verify 
            your identity'
                    />
                ),
            status: poi_status === 'verified' ? 'done' : 'action',
            onClick: poi_status === 'verified' ? () => {} : checkVerified,
            is_disabled: poi_status !== 'verified' && !nickname,
        },
    ];

    if (!is_advertiser && poi_status === 'verified' && this.context.nickname) {
        return <div>{localize('Your P2P cashier has been blocked. Please contact customer support')}</div>;
    }

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
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
            <Checklist className='p2p-verification__checklist' items={items} />
        </div>
    );
};

export default Verification;
