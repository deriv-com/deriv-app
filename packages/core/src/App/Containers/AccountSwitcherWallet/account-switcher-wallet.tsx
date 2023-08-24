import React, { useMemo } from 'react';
import { useWalletAccountsList } from '@deriv/hooks';
import { Button, Text, useOnClickOutside } from '@deriv/components';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import { Localize, localize } from '@deriv/translations';
import './account-switcher-wallet.scss';

export const AccountSwitcherWallet = ({
    is_visible,
    toggle,
}: {
    is_visible: boolean;
    toggle: (value: boolean) => void;
}) => {
    const { data: wallets } = useWalletAccountsList();

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) =>
        is_visible && !(event.target as HTMLElement).classList.contains('acc-info');

    const closeAccountsDialog = () => {
        toggle(false);
    };

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const trading_accounts = useMemo(() => wallets.filter(account => account.is_trading), [wallets]);

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Deriv Apps accounts' />
                </Text>
            </div>
            <div className='account-switcher-wallet__list'>
                {trading_accounts.map(account => (
                    <AccountSwitcherWalletItem key={account.created_at?.toDateString()} {...account} />
                ))}
            </div>
            <Button
                className='account-switcher-wallet__button'
                has_effect
                text={localize('Looking for CFDs? Go to Trader’s hub')}
                onClick={() => {
                    /* redirect to trader's hub */
                }}
                secondary
                small
            />
        </div>
    );
};

export default AccountSwitcherWallet;
