import React from 'react';
import { useAccountsList } from '@deriv/api';
import CloseIcon from '../../public/images/close-icon.svg';
import { Loader } from '../Loader';
import { useModal } from '../ModalProvider';
import WalletTransferFromAccountCard from '../WalletTransferFormAccountCard/WalletTransferFormAccountCard';
import './WalletTransferFormAccountSelection.scss';

type TProps = {
    label: string;
    onSelect: (value: NonNullable<ReturnType<typeof useAccountsList>['data']>[number]) => void;
};

const WalletTransferFormAccountSelection: React.FC<TProps> = ({ label, onSelect }) => {
    const { data, isLoading } = useAccountsList();
    const modal = useModal();

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-transfer-form-account-selection'>
            <div className='wallets-transfer-form-account-selection__header'>
                <span className='wallets-transfer-form-account-selection__header__label'>{label}</span>
                <button
                    className='wallets-transfer-form-account-selection__header__close-button'
                    onClick={() => modal.hide()}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className='wallets-transfer-form-account-selection__accounts'>
                {data?.map(account => (
                    <button
                        className='wallets-transfer-form-account-selection__account'
                        key={`account-selection-${account?.loginid}`}
                        onClick={() => {
                            onSelect(account);
                            modal.hide();
                        }}
                    >
                        <WalletTransferFromAccountCard account={account} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WalletTransferFormAccountSelection;
