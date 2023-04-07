import React from 'react';
import WalletsImage, { WalletsImagesList } from 'Assets/svgs/wallets';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

const WalletsBannerUpgrading = () => {
    const banner: keyof typeof WalletsImagesList = isMobile() ? 'UpgradingMobile' : 'UpgradingDesktop';
    const size: string = isMobile() ? 'xs' : 'm';

    return (
        <div className='wallets-banner__container wallets-banner__upgrading-banner'>
            <div className='wallets-banner__upgrading-banner-description'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> - the best way to organise your funds</1>'
                        components={[<Text key={0} weight='bold' size={size} />, <Text key={1} size={size} />]}
                    />
                </div>
                <Button
                    className={'wallets-banner__upgrading-banner-button'}
                    has_effect
                    text={localize('Upgrade now')}
                    primary
                    large={!isMobile()}
                />
            </div>
            <WalletsImage banner={banner} className={'wallets-banner__image'} />
        </div>
    );
};

export default WalletsBannerUpgrading;
