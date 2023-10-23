import React from 'react';
import { useAccountsList } from '@deriv/api';
import { Loader } from '../../../../../../../../../components/Loader';
import { useModal } from '../../../../../../../../../components/ModalProvider';
import CloseIcon from '../../../../../public/images/close-icon.svg';
import TransferFromAccountCard from '../TransferFormAccountCard/TransferFormAccountCard';
import './TransferFormAccountSelection.scss';

type TProps = {
    label: string;
    onSelect: (value: NonNullable<ReturnType<typeof useAccountsList>['data']>[number]) => void;
};

const TransferFormAccountSelection: React.FC<TProps> = ({ label, onSelect }) => {
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
                        <TransferFromAccountCard account={account} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransferFormAccountSelection;
