import React from 'react';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import classNames from 'classnames';

const ShareMyAdsIcons = () => {
    // TODO: replace with proper url and message when available
    const advert_url = window.location.href;
    const custom_message = 'This is my advert!';

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
            icon: 'IcStockTwitter',
            messagePropName: 'quote',
            size: 28,
            small_icon: true,
            text: 'Twitter',
        },
        {
            ShareButton: 'a',
            href: `https://mail.google.com/mail/?view=cm&fs=1&body=${advert_url}`,
            icon: 'IcStockGoogle',
            rel: 'noreferrer',
            size: 28,
            small_icon: true,
            target: '_blank',
            text: 'Gmail',
        },
    ];

    return (
        <div className='share-my-ads-icons'>
            {share_buttons.map(({ ShareButton, href, icon, messagePropName, rel, size, small_icon, target, text }) => (
                <ShareButton
                    key={text}
                    url={advert_url}
                    {...(messagePropName && { [messagePropName]: custom_message })}
                    {...(href && { href })}
                    {...(target && { target: '_blank' })}
                    {...(rel && { rel: 'noreferrer' })}
                >
                    <div className='share-my-ads-icons__circle'>
                        <Icon
                            className={classNames('share-my-ads-icons__circle-icon', {
                                'share-my-ads-icons__circle-icon--small': small_icon,
                            })}
                            icon={icon}
                            size={size}
                        />
                    </div>
                    <Text size='xxxs'>
                        <Localize i18n_default_text={text} />
                    </Text>
                </ShareButton>
            ))}
        </div>
    );
};

export default ShareMyAdsIcons;
