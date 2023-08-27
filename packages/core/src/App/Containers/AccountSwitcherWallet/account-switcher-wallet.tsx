import React from 'react';
import { useHistory } from 'react-router';
import { Button, Text, useOnClickOutside } from '@deriv/components';
import { useWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import './account-switcher-wallet.scss';

type TAccountSwitcherWalletProps = {
    is_visible: boolean;
    toggle: (value: boolean) => void;
};

export const AccountSwitcherWallet = ({ is_visible, toggle }: TAccountSwitcherWalletProps) => {
    const { data: accounts } = useWalletAccountsList();
    const history = useHistory();

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) =>
        is_visible && !(event.target as HTMLElement).classList.contains('acc-info');

    const closeAccountsDialog = () => {
        toggle(false);
    };

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Deriv Apps accounts' />
                </Text>
            </div>
            <div className='account-switcher-wallet__list'>
                {accounts?.map(account => (
                    <AccountSwitcherWalletItem
                        key={`${account.created_at?.toISOString()}-${account.loginid}`}
                        closeAccountsDialog={closeAccountsDialog}
                        {...account}
                    />
                ))}
            </div>
            <Button
                className='account-switcher-wallet__button'
                has_effect
                text={localize('Looking for CFDs? Go to Trader’s hub')}
                onClick={() => {
                    /* redirect to trader's hub */
                    // implement account switch
                    closeAccountsDialog();
                    history.push(routes.traders_hub);
                    // setTogglePlatformType('cfd');
                }}
                secondary
                small
            />
        </div>
    );
};

export default AccountSwitcherWallet;
