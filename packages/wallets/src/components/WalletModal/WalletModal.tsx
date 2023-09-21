import React, { ComponentPropsWithoutRef, PropsWithChildren, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import { useModal } from '../ModalProvider';

type TWalletModalProps = {
    should_show_close_icon?: boolean;
    should_close_on_click_outside?: boolean;
    onClickCloseIcon?: () => void;
};

const WalletModal = ({
    children,
    onClickCloseIcon,
    should_show_close_icon,
    should_close_on_click_outside = true,
    className: propsClassName,
    ...rest
}: ComponentPropsWithoutRef<'div'> & PropsWithChildren<TWalletModalProps>) => {
    const { hide } = useModal();
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, should_close_on_click_outside ? hide : () => undefined);

    return (
        <div ref={modalRef} {...rest} className={`wallets-modal ${propsClassName}`}>
            {should_show_close_icon && <CloseIcon className='wallets-modal-close-icon' onClick={onClickCloseIcon} />}
            {children}
        </div>
    );
};

export default WalletModal;
