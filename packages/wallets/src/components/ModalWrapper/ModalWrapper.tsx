import React, { FC } from 'react';

import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';

import './ModalWrapper.scss';

type TProps = {
    hideCloseButton?: boolean;
};

const ModalWrapper: FC<React.PropsWithChildren<TProps>> = ({ children, hideCloseButton = false }) => {
    const { hide } = useModal();

    return (
        <div className='wallets-modal-wrapper'>
            {!hideCloseButton && <CloseIcon className='wallets-modal-wrapper__close-icon' onClick={hide} />}
            {children}
        </div>
    );
};

export default ModalWrapper;
