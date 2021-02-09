import React from 'react';
import { Button, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStores } from 'Stores';

const WalletBanner: React.FC<TWalletBannerProps> = ({ getWalletClick }) => {
    const { config_store } = useStores();

    return (
        <div className='wallet-banner'>
            <img
                src={`${config_store.asset_path}/images/banner-get-wallets-${
                    isDesktop() ? 'desktop' : 'responsive'
                }.svg`}
            />
            <div className='wallet-banner--column'>
                <Text align='center' className='wallet-banner--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Activate your first wallet to start trading' />
                </Text>
                <Button
                    className='wallet-banner--button'
                    medium
                    onClick={getWalletClick}
                    text={localize('Get a Wallet')}
                />
            </div>
        </div>
    );
};

interface TWalletBannerProps {
    getWalletClick: Function;
}

export default WalletBanner;
