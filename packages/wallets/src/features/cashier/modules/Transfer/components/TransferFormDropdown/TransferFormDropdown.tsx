import React, { RefObject, useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { WalletListCardBadge, WalletText } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import IcDropdown from '../../../../../../public/images/ic-dropdown.svg';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import { TransferFormAccountCard } from '../TransferFormAccountCard';
import { TransferFormAccountSelection } from '../TransferFormAccountSelection';
import './TransferFormDropdown.scss';

type TProps = {
    fieldName: keyof TInitialTransferFormValues;
    label: 'Transfer from' | 'Transfer to';
    mobileAccountsListRef: RefObject<HTMLElement>;
};

const TransferFormDropdown: React.FC<TProps> = ({ fieldName, label, mobileAccountsListRef }) => {
    const { setFieldValue, values } = useFormikContext<TInitialTransferFormValues>();
    const { accounts, activeWallet } = useTransfer();
    const { fromAccount, toAccount } = values;
    const { isMobile } = useDevice();
    const modal = useModal();

    const toAccountList = useMemo(() => {
        if (!activeWallet) return { tradingAccounts: [], walletAccounts: [] };
        if (fromAccount?.loginid === activeWallet.loginid) {
            return {
                tradingAccounts: accounts?.tradingAccounts,
                walletAccounts: accounts?.walletAccounts.filter(account => account.loginid !== activeWallet?.loginid),
            };
        }
        return { tradingAccounts: [], walletAccounts: [activeWallet] };
    }, [accounts?.tradingAccounts, accounts?.walletAccounts, activeWallet, fromAccount?.loginid]);

    const selectedAccount = fieldName === 'fromAccount' ? fromAccount : toAccount;
    const accountsList = fieldName === 'fromAccount' ? accounts : toAccountList;

    const handleSelect = useCallback(
        (account: TInitialTransferFormValues['fromAccount']) => {
            if (account?.loginid === selectedAccount?.loginid) return;
            if (fieldName === 'fromAccount') {
                account?.loginid !== activeWallet?.loginid
                    ? setFieldValue('toAccount', activeWallet)
                    : setFieldValue('toAccount', undefined);
            }
            setFieldValue(fieldName, account);
        },
        [activeWallet, fieldName, selectedAccount?.loginid, setFieldValue]
    );

    return (
        <button
            className='wallets-transfer-form-dropdown'
            onClick={() => {
                modal.show(
                    <TransferFormAccountSelection
                        accountsList={accountsList}
                        activeWallet={activeWallet}
                        fromAccount={fromAccount}
                        label={label}
                        onSelect={handleSelect}
                        selectedAccount={selectedAccount}
                        toAccount={toAccount}
                    />,
                    {
                        rootRef: isMobile ? mobileAccountsListRef : undefined,
                    }
                );
            }}
            type='button'
        >
            <div className='wallets-transfer-form-dropdown__content'>
                <div className='wallets-transfer-form-dropdown__header'>
                    <WalletText size='sm'>{label}</WalletText>

                    {isMobile && <IcDropdown />}
                </div>

                {selectedAccount ? (
                    <TransferFormAccountCard account={selectedAccount} activeWallet={activeWallet} type='input' />
                ) : (
                    <WalletText size='sm' weight='bold'>
                        Select a trading account or a Wallet
                    </WalletText>
                )}
            </div>

            {!isMobile && (
                <>
                    {selectedAccount && (
                        <div className='wallets-transfer-form-dropdown__badge'>
                            <WalletListCardBadge
                                isDemo={Boolean(selectedAccount?.demo_account)}
                                label={selectedAccount?.landingCompanyName}
                            />
                        </div>
                    )}
                    <IcDropdown className='wallets-transfer-form-dropdown__icon-dropdown' />
                </>
            )}
        </button>
    );
};

export default TransferFormDropdown;
