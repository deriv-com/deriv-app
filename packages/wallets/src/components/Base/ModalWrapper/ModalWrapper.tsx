import React, { FC } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { useModal } from '../../ModalProvider';
import './ModalWrapper.scss';

type TProps = {
    hideCloseButton?: boolean;
    isFullscreen?: boolean;
    shouldPreventCloseOnEscape?: boolean;
};

const ModalWrapper: FC<React.PropsWithChildren<TProps>> = ({
    children,
    hideCloseButton = false,
    isFullscreen = false,
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
                'wallets-modal-wrapper--fullscreen': isFullscreen,
            })}
        >
            {!hideCloseButton && (
                <LegacyClose2pxIcon className='wallets-modal-wrapper__close-icon' iconSize='xs' onClick={hide} />
            )}
            {children}
        </div>
    );
};

export default ModalWrapper;
