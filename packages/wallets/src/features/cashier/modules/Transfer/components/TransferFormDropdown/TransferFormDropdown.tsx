import React, { RefObject } from 'react';
import { useFormikContext } from 'formik';
import { WalletListCardBadge, WalletText } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import IcDropdown from '../../../../../../public/images/ic-dropdown.svg';
import { TInitialTransferFormValues } from '../../types';
import TransferFormAccountCard from '../TransferFormAccountCard/TransferFormAccountCard';
import TransferFormAccountSelection from '../TransferFormAccountSelection/TransferFormAccountSelection';
import './TransferFormDropdown.scss';

type TProps = {
    fieldName: keyof TInitialTransferFormValues;
    label: 'Transfer from' | 'Transfer to';
    mobileAccountsListRef: RefObject<HTMLElement>;
};

const TransferFormDropdown: React.FC<TProps> = ({ fieldName, label, mobileAccountsListRef }) => {
    const { setFieldValue, values } = useFormikContext<TInitialTransferFormValues>();
    const { fromAccount, toAccount } = values;
    const { isMobile } = useDevice();
    const modal = useModal();

    const selectedAccount = label === 'Transfer from' ? fromAccount : toAccount;

    const handleSelect = (value: TInitialTransferFormValues['fromAccount']) => {
        setFieldValue(fieldName, value);
    };

    return (
        <button
            className='wallets-transfer-form-dropdown'
            onClick={() => {
                modal.show(
                    <TransferFormAccountSelection
                        fromAccount={fromAccount}
                        label={label}
                        onSelect={handleSelect}
                        selectedAccount={selectedAccount}
                    />,
                    {
                        rootRef: isMobile ? mobileAccountsListRef : undefined,
                    }
                );
            }}
        >
            <div className='wallets-transfer-form-dropdown__content'>
                <div className='wallets-transfer-form-dropdown__header'>
                    <WalletText size='sm'>{label}</WalletText>

                    {isMobile && <IcDropdown />}
                </div>

                {selectedAccount ? (
                    <TransferFormAccountCard account={selectedAccount} type='input' />
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
                                isDemo={Boolean(selectedAccount?.isVirtual)}
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
