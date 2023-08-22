import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { base64_images } from 'Constants/base64-images';
import { TAdvertProps } from 'Types';
import { ad_type } from 'Constants/floating-rate';

type TShareMyAdsCardProps = {
    advert: Partial<TAdvertProps>;
    advert_url: string;
    divRef: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
};

const ShareMyAdsCard = ({ advert, advert_url, divRef }: TShareMyAdsCardProps) => {
    const {
        account_currency,
        id,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        rate_display,
        rate_type,
        type,
    } = advert;

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
                        {rate_display}
                        {rate_type === ad_type.FIXED ? ` ${local_currency}` : '%'}
                    </Text>
                </div>
            </div>
            <div className='share-my-ads-card__qr'>
                <div className='share-my-ads-card__qr-container'>
                    <QRCodeSVG
                        value={advert_url}
                        size={isMobile() ? 120 : 140}
                        imageSettings={{
                            src: base64_images.dp2p_logo,
                            height: isMobile() ? 30 : 34,
                            width: isMobile() ? 30 : 34,
                            excavate: false,
                        }}
                    />
                </div>
                <Text className='share-my-ads-card__qr-text' color='less-prominent' size='xxs'>
                    <Localize i18n_default_text='Scan this code to order via Deriv P2P' />
                </Text>
            </div>
        </div>
    );
};

export default ShareMyAdsCard;
