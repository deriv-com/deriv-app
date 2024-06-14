import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks, TSubscribedBalance } from '../../types';
import { WalletDropdown, WalletText } from '../Base';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import './WalletListCardDropdown.scss';

type WalletList = ComponentProps<typeof WalletDropdown>['list'] | undefined;

const WalletListCardDropdown: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const { t } = useTranslation();
    const { data: balanceData } = balance;

    const [inputWidth, setInputWidth] = useState('auto');
    const loginId = activeWallet?.loginid;

    const generateTitleText = useCallback(
        (wallet: THooks.WalletAccountsList) => {
            return t(`${wallet?.currency} Wallet`);
        },
        [t]
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
                            <WalletText size='2xs'>
                                <Trans defaults={`${wallet.currency} Wallet`} />
                            </WalletText>
                            <WalletText size='sm' weight='bold'>
                                <Trans
                                    defaults={displayMoney?.(
                                        balanceData?.accounts?.[wallet.loginid]?.balance ?? 0,
                                        wallet?.currency || '',
                                        {
                                            fractional_digits: wallet?.currency_config?.fractional_digits,
                                        }
                                    )}
                                />
                            </WalletText>
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
                        <WalletText size='sm' weight='bold'>
                            <Trans defaults='Select Wallet' />
                        </WalletText>
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
