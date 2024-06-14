import React from 'react';
import classNames from 'classnames';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Icon } from '@deriv/components';

type TShareMyAdsSocialsProps = {
    advert_url: string;
    custom_message: string;
};

const ShareMyAdsSocials = ({ advert_url, custom_message }: TShareMyAdsSocialsProps) => {
    const share_buttons = [
        {
            ShareButton: WhatsappShareButton,
            icon: 'IcWhatsappFilled',
            messagePropName: 'title',
            size: 34,
            text: 'WhatsApp',
        },
        { ShareButton: FacebookShareButton, icon: 'IcFacebook', messagePropName: 'quote', size: 34, text: 'Facebook' },
        { ShareButton: TelegramShareButton, icon: 'IcTelegram', messagePropName: 'title', size: 34, text: 'Telegram' },
        {
            ShareButton: TwitterShareButton,
            icon: 'IcX',
            messagePropName: 'title',
            size: 28,
            small_icon: true,
            text: 'X',
        },
        {
            ShareButton: 'a',
            href: `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(advert_url)}`,
            icon: 'IcStockGoogle',
            rel: 'noreferrer',
            size: 28,
            small_icon: true,
            target: '_blank',
            text: 'Gmail',
        },
    ];

    return (
        <div className='share-my-ads-socials'>
            {share_buttons.map(({ ShareButton, href, icon, messagePropName, rel, size, small_icon, target, text }) => (
                <ShareButton
                    key={text}
                    url={text === 'Facebook' ? advert_url : ' '}
                    {...(messagePropName && { [messagePropName]: custom_message })}
                    {...(href && { href })}
                    {...(target && { target: '_blank' })}
                    {...(rel && { rel: 'noreferrer' })}
                >
                    <div className='share-my-ads-socials__circle'>
                        <Icon
                            className={classNames('share-my-ads-socials__circle-icon', {
                                'share-my-ads-socials__circle-icon--small': small_icon,
                            })}
                            icon={icon}
                            size={size}
                        />
                    </div>
                </ShareButton>
            ))}
        </div>
    );
};

export default ShareMyAdsSocials;
