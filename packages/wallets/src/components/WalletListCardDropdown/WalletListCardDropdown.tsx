import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedChevronDownLgFillIcon } from '@deriv/quill-icons';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks, TSubscribedBalance } from '../../types';
import reactNodeToString from '../../utils/react-node-to-string';
import { WalletText, WalletTextField } from '../Base';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import './WalletListCardDropdown.scss';

type WalletList = {
    listItem: React.ReactNode;
    text: React.ReactNode;
    value: string;
}[];

const WalletListCardDropdown: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const { t } = useTranslation();

    const { data: balanceData } = balance;
    const loginId = activeWallet?.loginid;
    const [inputWidth, setInputWidth] = useState('auto');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const generateTitleText = useCallback(
        (wallet: THooks.WalletAccountsList) => {
            return t(`${wallet?.currency} Wallet`);
        },
        [t]
    );

    const walletList: WalletList = useMemo(() => {
        return (
            wallets
                ?.filter(wallet => !wallet.is_virtual)
                .map(wallet => ({
                    listItem: (
                        <div className='wallets-listcard-dropdown__list-item'>
                            <WalletCurrencyIcon currency={wallet.currency ?? 'USD'} rounded />
                            <div className='wallets-listcard-dropdown__list-content'>
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
                })) ?? []
        );
    }, [balanceData?.accounts, generateTitleText, wallets]);

    const handleInputClick = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }, []);

    const handleItemClick = (value: string, text: string) => {
        switchWalletAccount(value);
        setSelectedText(text);
        setIsOpen(false);
    };

    useEffect(() => {
        if (loginId && wallets) {
            const selectedWallet = wallets.find(wallet => wallet.loginid === loginId);
            if (selectedWallet) {
                const titleText = generateTitleText(selectedWallet);
                setSelectedText(titleText);
                setInputWidth(`${titleText.length * 10 - 20}px`);
            }
        }
    }, [generateTitleText, loginId, wallets]);

    return (
        <React.Fragment>
            {walletList.length > 0 && (
                <div className='wallets-listcard-dropdown'>
                    <WalletTextField
                        inputWidth={inputWidth}
                        name='wallets-list-card-dropdown'
                        onClickCapture={handleInputClick}
                        readOnly
                        renderRightIcon={() => (
                            <button
                                className={classNames('wallets-listcard-dropdown__button', {
                                    'wallets-listcard-dropdown__button--active': isOpen,
                                })}
                                onClick={handleInputClick}
                            >
                                <LabelPairedChevronDownLgFillIcon />
                            </button>
                        )}
                        showMessageContainer={false}
                        type='text'
                        typeVariant='listcard'
                        value={selectedText}
                    />
                    {isOpen && (
                        <ul className='wallets-listcard-dropdown__items'>
                            <div className='wallets-listcard-dropdown__items-header'>
                                <WalletText size='sm' weight='bold'>
                                    <Trans defaults='Select Wallet' />
                                </WalletText>
                            </div>
                            {walletList.map((wallet, index) => (
                                <li
                                    className={classNames('wallets-listcard-dropdown__item', {
                                        'wallets-listcard-dropdown__item--active': loginId === wallet.value,
                                    })}
                                    id={`wallets-listcard-dropdown__item-${index}`}
                                    key={wallet.value}
                                    onClick={() => handleItemClick(wallet.value, reactNodeToString(wallet.text))}
                                >
                                    {wallet.listItem}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default WalletListCardDropdown;
