import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TWalletsImagesListKeys } from 'Assets/svgs/wallets/image-types';
import { useStore } from '@deriv/stores';

const WalletsBannerUpgrade = () => {
    const image: TWalletsImagesListKeys = isMobile() ? 'upgrade_mobile' : 'upgrade_desktop';
    const size: string = isMobile() ? 'xs' : 'm';
    const { traders_hub } = useStore();
    const { toggleWalletsUpgrade } = traders_hub;

    return (
        <div className='wallets-banner__container wallets-banner__upgrade-banner'>
            <div className='wallets-banner__upgrade-banner-description'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — the best way to organise your funds</1>'
                        components={[<Text key={0} weight='bold' size={size} />, <Text key={1} size={size} />]}
                    />
                </div>
                <Button
                    className='wallets-banner__upgrade-banner-button'
                    has_effect
                    text={localize('Upgrade now')}
                    primary
                    large={!isMobile()}
                    onClick={() => toggleWalletsUpgrade(true)}
                />
            </div>
            <WalletsImage image={image} className='wallets-banner__image' />
        </div>
    );
};

export default WalletsBannerUpgrade;
