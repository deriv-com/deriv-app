import React from 'react';
import ErrorIcon from '../../public/images/error-icon.svg';
import { WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import './WalletError.scss';

type TProps = {
    errorMessage: string;
    title?: string;
};

const WalletError: React.FC<TProps> = ({ errorMessage, title }) => {
    const modal = useModal();

    return (
        <div className='wallets-error'>
            <ErrorIcon />
            {title && <WalletText weight='bold'>{title}</WalletText>}
            <WalletText align='center' size='sm'>
                {errorMessage}
            </WalletText>
            <WalletButton onClick={() => modal.hide()} text='Close' />
        </div>
    );
};

export default WalletError;
