import React from 'react';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import './CancelTransactionModal.scss';

type TCancelTransactionModal = {
    onCancel: VoidFunction;
};

const CancelTransactionModal = ({ onCancel }: TCancelTransactionModal) => {
    const { hide } = useModal();

    return (
        <div className='crypto-transactions-cancel-modal'>
            <WalletText lineHeight='md' size='sm' weight='bold'>
                Cancel transaction
            </WalletText>
            <WalletText lineHeight='sm' size='xs'>
                Are you sure you want to cancel this transaction?
            </WalletText>
            <div className='crypto-transactions-cancel-modal-buttons-container'>
                <WalletButton color='white' onClick={hide} size='lg'>
                    No, don&apos;t cancel
                </WalletButton>
                <WalletButton color='primary' onClick={onCancel} size='lg'>
                    Yes, cancel
                </WalletButton>
            </div>
        </div>
    );
};

export default CancelTransactionModal;
