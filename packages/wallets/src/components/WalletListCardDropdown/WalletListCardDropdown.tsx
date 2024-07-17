import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks, TSubscribedBalance } from '../../types';
import { WalletDropdown } from '../Base';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import './WalletListCardDropdown.scss';

type WalletList = ComponentProps<typeof WalletDropdown>['list'] | undefined;

const WalletListCardDropdown: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const { localize } = useTranslations();
    const { data: balanceData } = balance;

    const [inputWidth, setInputWidth] = useState('auto');
    const loginId = activeWallet?.loginid;

    const generateTitleText = useCallback(
        (wallet: THooks.WalletAccountsList) => {
            return localize(`${wallet?.currency} Wallet`);
        },
        [localize]
    );

    useEffect(() => {
        const selectedWallet = wallets?.find(wallet => wallet.loginid === loginId);
        if (selectedWallet) {
            const selectedTextWidth = generateTitleText(selectedWallet).length;
            setInputWidth(`${selectedTextWidth * 10 - 20}px`);
        }
    }, [generateTitleText, wallets, loginId]);

    const walletList: WalletList = useMemo(() => {
        return wallets
            ?.filter(wallet => !wallet.is_virtual)
            ?.map(wallet => ({
                listItem: (
                    <div className='wallets-list-card-dropdown__item'>
                        <WalletCurrencyIcon currency={wallet.currency ?? 'USD'} rounded />
                        <div className='wallets-list-card-dropdown__item-content'>
                            <Text size='2xs'>{wallet.currency} Wallet</Text>
                            <Text size='sm' weight='bold'>
                                {displayMoney?.(
                                    balanceData?.accounts?.[wallet.loginid]?.balance ?? 0,
                                    wallet?.currency || '',
                                    {
                                        fractional_digits: wallet?.currency_config?.fractional_digits,
                                    }
                                )}
                            </Text>
                        </div>
                    </div>
                ),
                text: generateTitleText(wallet),
                value: wallet.loginid,
            }));
    }, [balanceData?.accounts, generateTitleText, wallets]);

    return (
        <div className='wallets-list-card-dropdown'>
            {wallets && (
                <WalletDropdown
                    inputWidth={inputWidth}
                    list={walletList ?? []}
                    listHeader={
                        <Text size='sm' weight='bold'>
                            <Localize i18n_default_text='Select Wallet' />
                        </Text>
                    }
                    name='wallets-list-card-dropdown'
                    onSelect={selectedItem => {
                        switchWalletAccount(selectedItem);
                    }}
                    showListHeader
                    showMessageContainer={false}
                    typeVariant='listcard'
                    value={loginId}
                />
            )}
        </div>
    );
};

export default WalletListCardDropdown;
