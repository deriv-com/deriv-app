import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TWalletsImagesListKey } from 'Assets/svgs/wallets/image-types';
import { observer, useStore } from '@deriv/stores';

// just for now for testing purpose, in the future 'is_eu' value will be taken from the store
type TWalletsBannerUpgrading = {
    is_eu?: boolean;
};

const WalletsBannerUpgrading = observer(({ is_eu }: TWalletsBannerUpgrading) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const image: TWalletsImagesListKey = is_mobile
        ? `upgrading_mobile${is_eu ? '_eu' : ''}`
        : `upgrading_desktop${is_eu ? '_eu' : ''}`;
    const title_size = is_mobile ? 'xs' : 'sm';
    const description_size = is_mobile ? 'xxxs' : 'xs';

    return (
        <div className='wallets-banner__container wallets-banner__upgrading-banner'>
            <div className='wallets-banner__upgrading-banner-description'>
                <div className='wallets-banner__upgrading-banner-loading' data-testid='dt_wallets-loading-dots'>
                    <span className='wallets-banner__upgrading-banner-dot' />
                    <span className='wallets-banner__upgrading-banner-dot' />
                    <span className='wallets-banner__upgrading-banner-dot' />
                </div>
                <Localize
                    i18n_default_text="<0>We're setting up your Wallets</0>"
                    components={[<Text key={0} weight='bold' size={title_size} />]}
                />
                <Localize
                    i18n_default_text="<0>This may take up to 2 minutes.  During this time, you won't be able to deposit, withdraw, transfer, and add new accounts.</0>"
                    components={[<Text key={0} size={description_size} />]}
                />
            </div>
            <WalletsImage image={image} className='wallets-banner__image wallets-banner__upgrading-banner-image' />
        </div>
    );
});

export default WalletsBannerUpgrading;
