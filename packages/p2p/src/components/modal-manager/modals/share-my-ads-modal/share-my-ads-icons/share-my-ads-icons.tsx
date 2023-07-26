import React from 'react';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const ShareMyAdsIcons = () => {
    const advert_url = window.location.href;

    return (
        <div className='share-my-ads-icons'>
            <WhatsappShareButton url={advert_url}>
                <div className='share-my-ads-icons__circle'>
                    <Icon className='share-my-ads-icons__circle-icon' icon='IcWhatsappFilled' size={34} />
                </div>
                <Text size='xxxs'>
                    <Localize i18n_default_text='WhatsApp' />
                </Text>
            </WhatsappShareButton>
            <FacebookShareButton url={advert_url}>
                <div className='share-my-ads-icons__circle'>
                    <Icon className='share-my-ads-icons__circle-icon' icon='IcFacebook' size={34} />
                </div>
                <Text size='xxxs'>
                    <Localize i18n_default_text='Facebook' />
                </Text>
            </FacebookShareButton>
            <TwitterShareButton url={advert_url}>
                <div className='share-my-ads-icons__circle'>
                    <Icon className='share-my-ads-icons__circle-icon--small' icon='IcStockTwitter' size={28} />
                </div>
                <Text size='xxxs'>
                    <Localize i18n_default_text='Twitter' />
                </Text>
            </TwitterShareButton>
            <TelegramShareButton url={advert_url}>
                <div className='share-my-ads-icons__circle'>
                    <Icon className='share-my-ads-icons__circle-icon' icon='IcTelegram' size={34} />
                </div>
                <Text size='xxxs'>
                    <Localize i18n_default_text='Telegram' />
                </Text>
            </TelegramShareButton>
            <div className='share-my-ads-icons__container'>
                <a
                    className='share-my-ads-icons__container-link'
                    href={`https://mail.google.com/mail/?view=cm&fs=1&body=${advert_url}`}
                    target='_blank'
                    rel='noreferrer'
                >
                    <div className='share-my-ads-icons__circle'>
                        <Icon className='share-my-ads-icons__circle-icon--small' icon='IcStockGoogle' size={28} />
                    </div>
                </a>
                <Text size='xxxs'>
                    <Localize i18n_default_text='Gmail' />
                </Text>
            </div>
        </div>
    );
};

export default ShareMyAdsIcons;
