import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { THooks } from '../../types';
import { WalletDropdown, WalletText } from '../Base';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { WalletCardIcon } from '../WalletCardIcon';
import './WalletListCardDropdown.scss';

type TProps = {
    loginid: THooks.WalletAccountsList['loginid'];
    onAccountSelect: (loginid: string) => void;
};

const WalletListCardDropdown: React.FC<TProps> = ({ loginid, onAccountSelect }) => {
    const { data: wallets } = useWalletAccountsList();
    const { switchAccount } = useAuthorize();
    const [dropdownWidth, setDropdownWidth] = useState('auto');

    useEffect(() => {
        const selectedWallet = wallets?.find(wallet => wallet.loginid === loginid);
        if (selectedWallet) {
            const selectedTextWidth = `${selectedWallet.currency} ${
                selectedWallet.wallet_currency_type === 'Demo' ? 'Demo ' : ''
            }Wallet`.length;
            setDropdownWidth(`${selectedTextWidth - 2}rem`);
        }
    }, [wallets, loginid]);

    return (
        <div className='wallets-list-card-dropdown'>
            {wallets && (
                <WalletDropdown
                    dropdownWidth={dropdownWidth}
                    list={wallets?.map(wallet => ({
                        listItem: (
                            <div className='wallets-list-card-dropdown__item'>
                                <WalletCardIcon
                                    device='desktop'
                                    size='md'
                                    type={wallet.wallet_currency_type}
                                    variant='circular'
                                />
                                <div className='wallets-list-card-dropdown__item-content'>
                                    <WalletText size='2xs'>
                                        <Trans
                                            defaults={`${wallet.currency} ${
                                                wallet.wallet_currency_type === 'Demo' ? 'Demo ' : ''
                                            }Wallet`}
                                        />
                                    </WalletText>
                                    <WalletText size='sm' weight='bold'>
                                        <Trans defaults={wallet.display_balance} />
                                    </WalletText>
                                </div>
                            </div>
                        ),
                        text: `${wallet.currency} ${wallet.wallet_currency_type === 'Demo' ? 'Demo ' : ''}Wallet`,
                        value: wallet.loginid,
                    }))}
                    listHeader={
                        <WalletText size='sm' weight='bold'>
                            <Trans defaults='Select Wallet' />
                        </WalletText>
                    }
                    name='wallets-list-card-dropdown'
                    onSelect={selectedItem => {
                        switchAccount(selectedItem);
                        onAccountSelect(selectedItem);
                    }}
                    showListHeader
                    showMessageContainer={false}
                    value={loginid}
                />
            )}
        </div>
    );
};

export default WalletListCardDropdown;
