import React from 'react';
import { Trans } from 'react-i18next';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { WalletText } from '../Base';
import './WalletListHeader.scss';

const WalletListHeader: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();

    const demoAccount = wallets?.find(wallet => wallet.is_virtual)?.loginid;
    const firstRealAccount = wallets?.find(wallet => !wallet.is_virtual)?.loginid;

    const handleToggle = () => {
        if (firstRealAccount && activeWallet?.loginid === demoAccount) {
            switchWalletAccount(firstRealAccount);
        } else if (demoAccount) {
            switchWalletAccount(demoAccount);
        }
    };

    return (
        <div className='wallets-list-header'>
            <WalletText size='xl' weight='bold'>
                Trader&apos;s Hub
            </WalletText>
            {!isMobile && (
                <div>
                    <div className='wallets-list-header__label'>
                        <WalletText size='sm'>
                            <Trans defaults='Demo' />
                        </WalletText>
                        <WalletText size='sm'>
                            <Trans defaults='Real' />
                        </WalletText>
                    </div>
                    <label className='wallets-list-header__switcher' htmlFor='wallets-list-header__switcher'>
                        <input
                            checked={activeWallet?.loginid !== demoAccount}
                            className='wallets-list-header__switcher-input'
                            name='wallets-list-header__switcher'
                            onChange={handleToggle}
                            type='checkbox'
                        />
                        <span className='wallets-list-header__slider' />
                    </label>
                </div>
            )}
        </div>
    );
};

export default WalletListHeader;
