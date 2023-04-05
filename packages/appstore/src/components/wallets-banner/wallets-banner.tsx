// import { BarsSvg } from 'Assets/svgs/wallets';
import React from 'react';
// import './wallets-banner.scss';
import BarsSvg from 'Assets/svgs/wallets/bars.svg';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
// import BarsPng from 'Assets/svgs/wallets/wallets-upgrade.png';

type TWalletsMigrationStatus = 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';
type TWalletsBannerProps = {
    migration_status: TWalletsMigrationStatus;
};

const WalletsBanner = ({ migration_status }: TWalletsBannerProps) => {
    // the user can't upgrade to the wallets
    // if (migration_status === 'ineligible') return null;

    // the user can upgrade to the wallets
    if (migration_status === 'eligible')
        return (
            <div className='wallets-banner-container eligible'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <Text size='m' weight='bold'>
                            {localize('Wallets')}
                        </Text>
                        <Text size='m'>{localize(' - the best way to organise your funds')}</Text>
                    </div>
                    <Button
                        // className='dc-dialog__button'
                        // has_effect
                        text={localize('Upgrade now')}
                        // onClick={() => {}}
                        primary
                        large
                    />
                </div>
                {/* <img src={''} /> */}
                <BarsSvg style={{ 'border-bottom-right-radius': '16px' }} />
            </div>
        );

    // wallets upgrading is in progress
    if (migration_status === 'in_progress')
        return (
            <div className='wallets-banner-container'>
                <h1>In progress</h1>
            </div>
        );

    // wallets migrated
    if (migration_status === 'migrated')
        return (
            <div className='wallets-banner-container'>
                <h1>Migrated</h1>
            </div>
        );

    // wallets migrated
    if (migration_status === 'failed')
        return (
            <div className='wallets-banner-container'>
                <h1>Failed</h1>
            </div>
        );

    // the user can't upgrade to the wallets (migration_status === 'ineligible')
    return null;
};

export default WalletsBanner;
