import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import DerivApps from '../../public/images/deriv-apps.svg';
import { WalletButton, WalletText } from '../Base';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './DerivAppsSection.scss';

const DerivAppsSection = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    return (
        <div className='wallets-deriv-apps-section'>
            <DerivApps />
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <WalletText size='sm'>Deriv Apps</WalletText>
                    <WalletListCardBadge isDemo={activeWallet?.is_virtual} label={activeWallet?.landing_company_name} />
                </div>
                <WalletText size='sm' weight='bold'>
                    [Balance]
                </WalletText>
                <WalletText color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    [Account ID]
                </WalletText>
            </div>
            <WalletButton color='white' text='Transfer' variant='outlined' />
        </div>
    );
};

export default DerivAppsSection;
