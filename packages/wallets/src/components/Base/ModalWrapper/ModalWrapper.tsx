import React, { FC } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import CloseIcon from '../../../public/images/ic-close-dark.svg';
import { useModal } from '../../ModalProvider';
import './ModalWrapper.scss';

type TProps = {
    hideCloseButton?: boolean;
    shouldFullscreen?: boolean;
    shouldPreventCloseOnEscape?: boolean;
};

const ModalWrapper: FC<React.PropsWithChildren<TProps>> = ({
    children,
    hideCloseButton = false,
    shouldFullscreen = false,
    shouldPreventCloseOnEscape = false,
}) => {
    const { hide } = useModal();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    return (
        <div
            className={classNames('wallets-modal-wrapper', {
                'wallets-modal-wrapper--fullscreen': shouldFullscreen,
            })}
        >
            {!hideCloseButton && <CloseIcon className='wallets-modal-wrapper__close-icon' onClick={hide} />}
            {children}
        </div>
    );
};

export default ModalWrapper;
