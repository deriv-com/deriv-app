import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { base64_images } from 'Constants/base64-images';
import { TAdvertProps } from 'Types';

type TShareMyAdsCardProps = {
    advert: Partial<TAdvertProps>;
    advert_url: string;
    divRef: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
    setHasQrLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShareMyAdsCard = ({ advert, advert_url, divRef, setHasQrLoaded }: TShareMyAdsCardProps) => {
    const { account_currency, id, max_order_amount_limit_display, min_order_amount_limit_display, rate_display, type } =
        advert;

    const options = {
        enableCORS: true,
        size: isMobile() ? 120 : 150,
        removeQrCodeBehindLogo: true,
        logoPadding: 4,
        logoImage: base64_images.dp2p_logo,
        logoWidth: isMobile() ? 30 : 40,
        logoHeight: isMobile() ? 30 : 40,
    };

    return (
        <div className='share-my-ads-card' ref={divRef}>
            <img className='share-my-ads-card__icon' src={base64_images.deriv_p2p} />
            <Text className='share-my-ads-card__title' weight='bold' size='m'>
                <Localize i18n_default_text='{{type}} {{account_currency}}' values={{ type, account_currency }} />
            </Text>
            <div className='share-my-ads-card__numbers'>
                <div className='share-my-ads-card__numbers-text'>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='ID number' />
                    </Text>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='Limit' />
                    </Text>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='Rate' />
                    </Text>
                </div>
                <div className='share-my-ads-card__numbers-text'>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {id}
                    </Text>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {min_order_amount_limit_display} - {max_order_amount_limit_display} {account_currency}
                    </Text>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {rate_display}%
                    </Text>
                </div>
            </div>
            <div className='share-my-ads-card__qr'>
                <div className='share-my-ads-card__qr-container'>
                    <QRCode value={advert_url} {...options} logoOnLoad={() => setHasQrLoaded(true)} />
                </div>
                <Text className='share-my-ads-card__qr-text' color='less-prominent' size='xxs'>
                    <Localize i18n_default_text='Scan this code to order via Deriv P2P' />
                </Text>
            </div>
        </div>
    );
};

export default ShareMyAdsCard;
