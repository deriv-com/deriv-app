import React from 'react';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import WalletsImage from 'Assets/svgs/wallets';

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_mobile } = ui;
    const { toggleWalletsUpgrade } = traders_hub;

    return (
        <div className='wallets-banner__container wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={is_mobile ? 'xs' : 'm'} />,
                            <Text key={1} size={is_mobile ? 'xs' : 'm'} />,
                        ]}
                    />
                </div>
                <Button
                    className='wallets-banner-upgrade__button'
                    text={localize('Enable now')}
                    primary
                    large
                    onClick={() => toggleWalletsUpgrade(true)}
                />
            </div>
            <WalletsImage
                image={`upgrade_${is_mobile ? 'mobile' : 'desktop'}`}
                className='wallets-banner-upgrade__image'
            />
        </div>
    );
});

export default WalletsBannerUpgrade;
