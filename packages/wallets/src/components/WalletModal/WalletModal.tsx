import React, { ComponentPropsWithoutRef, PropsWithChildren, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';
import './WalletModal.scss';

type TWalletModalProps = {
    has_close_icon?: boolean;
    should_close_on_backdrop_click?: boolean;
    onClickCloseIcon?: () => void;
};

const WalletModal = ({
    children,
    onClickCloseIcon,
    has_close_icon,
    should_close_on_backdrop_click = true,
    className: propsClassName,
    ...rest
}: ComponentPropsWithoutRef<'div'> & PropsWithChildren<TWalletModalProps>) => {
    const { hide } = useModal();
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, should_close_on_backdrop_click ? hide : () => undefined);

    return (
        <div ref={modalRef} {...rest} className={`wallets-modal ${propsClassName}`}>
            {has_close_icon && <CloseIcon className='wallets-modal-close-icon' onClick={onClickCloseIcon} />}
            {children}
        </div>
    );
};

export default WalletModal;
