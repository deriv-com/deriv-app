import React from 'react';
import WalletsBannerImage, { WalletsBanners } from 'Assets/svgs/wallets';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

const WalletsBannerUpgrade = () => {
    const banner: keyof typeof WalletsBanners = isMobile() ? 'UpgradeMobile' : 'UpgradeDesktop';
    const size: string = isMobile() ? 'xs' : 'm';
    const large = !isMobile();

    return (
        <div className='wallets-banner__container wallets-banner__upgrade-banner'>
            <div className='wallets-banner__upgrade-banner--description'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> - the best way to organise your funds</1>'
                        components={[<Text key={0} weight='bold' size={size} />, <Text key={1} size={size} />]}
                    />
                </div>
                <Button
                    className={'wallets-banner__upgrade-banner--button'}
                    has_effect
                    text={localize('Upgrade now')}
                    // onClick={() => {}}
                    primary
                    large={large}
                />
            </div>
            <WalletsBannerImage banner={banner} className={'wallets-banner__image'} />
        </div>
    );
};

export default WalletsBannerUpgrade;
