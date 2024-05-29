import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks } from '../../types';
import { WalletDropdown, WalletText } from '../Base';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import './WalletListCardDropdown.scss';

const WalletListCardDropdown = () => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const { t } = useTranslation();

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

    return (
        <div className='wallets-list-card-dropdown'>
            {wallets && (
                <WalletDropdown
                    inputWidth={inputWidth}
                    list={wallets
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
                                            <Trans defaults={wallet.display_balance} />
                                        </WalletText>
                                    </div>
                                </div>
                            ),
                            text: generateTitleText(wallet),
                            value: wallet.loginid,
                        }))}
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
