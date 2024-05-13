import React, { FC } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import useDevice from '../../../hooks/useDevice';
import CloseIcon from '../../../public/images/ic-close-dark.svg';
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
    const { isMobile } = useDevice();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    const onClickOverlay = () => {
        isMobile && hide();
    };

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === 'Enter' || ev.key === 'Space') {
            ev.preventDefault();
            onClickOverlay();
        }
    };

    return (
        <>
            <div className='wallets-modal-overlay' />
            <div
                className={classNames('wallets-modal-wrapper', {
                    'wallets-modal-wrapper--fullscreen': isFullscreen,
                })}
                onClick={onClickOverlay}
                onKeyDown={handleKeyDown}
            >
                <div
                    className='wallets-modal-body'
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => e.stopPropagation()}
                >
                    {!hideCloseButton && <CloseIcon className='wallets-modal-wrapper__close-icon' onClick={hide} />}
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalWrapper;
