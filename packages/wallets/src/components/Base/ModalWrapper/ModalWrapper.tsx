import React, { FC, useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';
import CloseIcon from '../../../public/images/ic-close-dark.svg';
import { useModal } from '../../ModalProvider';
import './ModalWrapper.scss';

type TProps = {
    closeOnEscape?: boolean;
    hideCloseButton?: boolean;
};

const ModalWrapper: FC<React.PropsWithChildren<TProps>> = ({
    children,
    closeOnEscape = false,
    hideCloseButton = false,
}) => {
    const { hide } = useModal();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    return (
        <div className='wallets-modal-wrapper'>
            {!hideCloseButton && <CloseIcon className='wallets-modal-wrapper__close-icon' onClick={hide} />}
            {children}
        </div>
    );
};

export default ModalWrapper;
