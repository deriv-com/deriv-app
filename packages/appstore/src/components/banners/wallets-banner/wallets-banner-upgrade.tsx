import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_desktop, is_mobile } = ui;
    const { toggleWalletsUpgrade } = traders_hub;

    return (
        <div className='wallets-banner wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={is_desktop ? 'm' : 'xs'} />,
                            <Text key={1} size={is_desktop ? 'm' : 'xs'} />,
                        ]}
                    />
                </div>
                <Button
                    className='wallets-banner-upgrade__button'
                    text={localize("Let's go")}
                    primary
                    large
                    onClick={() => toggleWalletsUpgrade(true)}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${is_desktop ? 'Horizontal' : ''}`}
                width={is_desktop ? 448 : 220}
                height={is_desktop ? '100%' : 220}
                className='wallets-banner-upgrade__image'
                data_testid={`dt_wallets_upgrade_coins${is_mobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrade;
