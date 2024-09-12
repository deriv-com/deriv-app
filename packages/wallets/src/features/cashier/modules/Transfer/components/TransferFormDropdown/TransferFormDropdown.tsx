import React, { RefObject, useCallback, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { LegacyChevronDown2pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletListCardBadge } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { TRADING_PLATFORM_STATUS } from '../../../../../cfd/constants';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues, TToAccount } from '../../types';
import { TransferFormAccountCard } from '../TransferFormAccountCard';
import { TransferFormAccountSelection } from '../TransferFormAccountSelection';
import './TransferFormDropdown.scss';

type TProps = {
    fieldName: keyof TInitialTransferFormValues;
    mobileAccountsListRef: RefObject<HTMLElement>;
};

const TransferFormDropdown: React.FC<TProps> = ({ fieldName, mobileAccountsListRef }) => {
    const { setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { accounts, activeWallet } = useTransfer();
    const { localize } = useTranslations();
    const { fromAccount, toAccount } = values;
    const { isDesktop } = useDevice();
    const modal = useModal();
    const { getPlatformStatus } = useTradingPlatformStatus();

    const isFromAccountDropdown = fieldName === 'fromAccount';

    const fromAccountList = useMemo(() => {
        if (!activeWallet) return { tradingAccounts: [], walletAccounts: [] };
        return {
            ...accounts,
            walletAccounts: [activeWallet],
        };
    }, [accounts, activeWallet]);

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

    const selectedAccount = isFromAccountDropdown ? fromAccount : toAccount;
    const accountsList = isFromAccountDropdown ? fromAccountList : toAccountList;
    const label = isFromAccountDropdown ? localize('Transfer from') : localize('Transfer to');
    const { location } = useHistory();
    const toAccountLoginId =
        location.pathname === '/wallet/account-transfer' ? location.state?.toAccountLoginId : undefined;
    const shouldDefaultUSDWallet =
        location.pathname === '/wallet/account-transfer' ? location.state?.shouldSelectDefaultWallet : false;

    const platformStatus = getPlatformStatus(selectedAccount?.account_type ?? '');

    const hasPlatformStatus =
        selectedAccount?.status === TRADING_PLATFORM_STATUS.UNAVAILABLE ||
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    const toDefaultAccount = useMemo(
        () => toAccountList.walletAccounts.find(wallet => wallet.currency === 'USD'),
        [toAccountList.walletAccounts]
    );
    // This sets a 'To transfer' to USD Wallet account to be selected by default when user transfers from a crypto wallet
    if (!toAccount && toDefaultAccount && shouldDefaultUSDWallet) {
        setValues(prev => ({
            ...prev,
            toAccount: toDefaultAccount,
        }));
    }

    useEffect(() => {
        const toAccount: TToAccount = Object.values(accounts)
            .flatMap(account => account)
            .find(account => account.loginid === toAccountLoginId);

        if (toAccountLoginId && toAccount) {
            setValues(prev => ({
                ...prev,
                toAccount,
            }));
        }
    }, [accounts, toAccountLoginId, setValues]);

    const handleSelect = useCallback(
        (account: TInitialTransferFormValues['fromAccount']) => {
            if (account?.loginid === selectedAccount?.loginid) return;

            if (isFromAccountDropdown) {
                setValues(prev => {
                    const toAccount = account?.loginid !== activeWallet?.loginid ? activeWallet : undefined;

                    return {
                        ...prev,
                        activeAmountFieldName: undefined,
                        fromAccount: account,
                        fromAmount: 0,
                        toAccount,
                        toAmount: 0,
                    };
                });
            } else {
                setValues(prev => ({
                    ...prev,
                    activeAmountFieldName: 'fromAmount',
                    toAccount: account,
                    toAmount: 0,
                }));
            }
        },
        [activeWallet, isFromAccountDropdown, selectedAccount?.loginid, setValues]
    );

    return (
        <button
            className='wallets-transfer-form-dropdown'
            data-testid='dt_wallets_transfer_form_dropdown'
            onClick={() => {
                modal.show(
                    <TransferFormAccountSelection
                        accountsList={accountsList}
                        activeWallet={activeWallet}
                        fromAccount={fromAccount}
                        isFromAccountDropdown={isFromAccountDropdown}
                        label={label}
                        onSelect={handleSelect}
                        selectedAccount={selectedAccount}
                        toAccount={toAccount}
                    />,
                    {
                        rootRef: !isDesktop ? mobileAccountsListRef : undefined,
                    }
                );
            }}
            type='button'
        >
            <div className='wallets-transfer-form-dropdown__content'>
                <div className='wallets-transfer-form-dropdown__header'>
                    <Text size='sm'>{label}</Text>

                    {!isDesktop && <LegacyChevronDown2pxIcon iconSize='xs' />}
                </div>

                {selectedAccount ? (
                    <TransferFormAccountCard account={selectedAccount} type='input' />
                ) : (
                    <div className='wallets-transfer-form-dropdown__select-account-cta'>
                        <Text size='sm' weight='bold'>
                            {activeWallet?.demo_account === 0 ? (
                                <Localize i18n_default_text='Select a trading account or a Wallet' />
                            ) : (
                                <Localize i18n_default_text='Select a trading account' />
                            )}
                        </Text>
                    </div>
                )}
            </div>

            {isDesktop && (
                <>
                    {selectedAccount?.demo_account ? (
                        <div className='wallets-transfer-form-dropdown__badge'>
                            <WalletListCardBadge />
                        </div>
                    ) : null}
                    {!hasPlatformStatus && (
                        <LegacyChevronDown2pxIcon
                            className='wallets-transfer-form-dropdown__icon-dropdown'
                            iconSize='xs'
                        />
                    )}
                </>
            )}
        </button>
    );
};

export default TransferFormDropdown;
