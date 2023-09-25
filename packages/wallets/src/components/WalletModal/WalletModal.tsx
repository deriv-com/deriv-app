import React from 'react';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';
import './WalletModal.scss';

type TProps = {
    hideCloseButton?: boolean;
    className?: string;
};

const WalletModal = ({ children, hideCloseButton = false }: React.PropsWithChildren<TProps>) => {
    const { hide } = useModal();

    return (
        <div className='wallets-modal'>
            {!hideCloseButton && <CloseIcon className='wallets-modal-close-icon' onClick={hide} />}
            {children}
        </div>
    );
};

export default WalletModal;
