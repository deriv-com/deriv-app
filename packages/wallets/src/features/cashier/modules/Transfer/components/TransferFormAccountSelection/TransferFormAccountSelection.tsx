import React, { useMemo } from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import CloseIcon from '../../../../../../public/images/close-icon.svg';
import { useWalletTransfer } from '../../hooks';
import TransferFormAccountCard from '../TransferFormAccountCard/TransferFormAccountCard';
import './TransferFormAccountSelection.scss';

type TProps = {
    fromAccount?: ReturnType<typeof useWalletTransfer>['activeWallet'];
    label: 'Transfer from' | 'Transfer to';
    onSelect: (value?: ReturnType<typeof useWalletTransfer>['activeWallet']) => void;
    selectedAccount?: ReturnType<typeof useWalletTransfer>['activeWallet'];
};

const TitleLine = () => <div className='wallets-transfer-form-account-selection__title-line' />;

const TransferFormAccountSelection: React.FC<TProps> = ({ fromAccount, label, onSelect, selectedAccount }) => {
    const { isMobile } = useDevice();
    const modal = useModal();
    const { activeWallet, fromAccountList, toAccountList } = useWalletTransfer(fromAccount?.loginid);

    const transferAccountsList = label === 'Transfer from' ? fromAccountList : toAccountList;

    const isSingleAccountsGroup = useMemo(
        () =>
            (Object.keys(transferAccountsList) as (keyof typeof transferAccountsList)[]).filter(
                key => transferAccountsList[key].length > 0
            ).length === 1,
        [transferAccountsList]
    );

    return (
        <div className='wallets-transfer-form-account-selection'>
            <div className='wallets-transfer-form-account-selection__header'>
                <WalletText size='md' weight='bold'>
                    {label}
                </WalletText>
                <button className='wallets-transfer-form-account-selection__close-button' onClick={() => modal.hide()}>
                    <CloseIcon />
                </button>
            </div>
            <div className='wallets-transfer-form-account-selection__accounts'>
                {(Object.keys(transferAccountsList) as (keyof typeof transferAccountsList)[]).map((key, index) => {
                    if (transferAccountsList[key].length === 0) return null;

                    const groupTitle =
                        key === 'tradingAccounts'
                            ? `Trading accounts linked with ${activeWallet?.currencyConfig?.display_code} Wallet`
                            : 'Wallets';
                    const isLastAccountsGroup = index === Object.keys(transferAccountsList).length - 1;
                    const shouldShowDivider = !isMobile && !isSingleAccountsGroup && !isLastAccountsGroup;

                    return (
                        <div
                            className={classNames('wallets-transfer-form-account-selection__accounts-group', {
                                'wallets-transfer-form-account-selection__accounts-group--divider': shouldShowDivider,
                            })}
                            key={key}
                        >
                            <div className='wallets-transfer-form-account-selection__accounts-group-title'>
                                <WalletText size='sm' weight='bold'>
                                    {groupTitle}
                                </WalletText>
                                {isMobile && <TitleLine />}
                            </div>
                            <div className='wallets-transfer-form-account-selection__accounts-group-list'>
                                {Object.values(transferAccountsList[key]).map(account => (
                                    <div
                                        className={classNames('wallets-transfer-form-account-selection__account', {
                                            'wallets-transfer-form-account-selection__account--selected':
                                                account?.loginid === selectedAccount?.loginid,
                                        })}
                                        key={`account-selection-${account?.loginid}`}
                                        onClick={() => {
                                            onSelect(account);
                                            modal.hide();
                                        }}
                                    >
                                        <TransferFormAccountCard account={account} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TransferFormAccountSelection;
