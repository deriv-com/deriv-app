import React, { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import { Provider } from '@deriv/library';
import { Text } from '@deriv/quill-design';
import CloseIcon from '../../public/images/ic-close-dark.svg';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter?: () => ReactNode;
    shouldFixedFooter?: boolean;
    shouldHideDerivAppHeader?: boolean;
    shouldHideHeader?: boolean;
    shouldPreventCloseOnEscape?: boolean;
    title?: string;
};

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({
    children,
    renderFooter,
    shouldFixedFooter = true,
    shouldHideDerivAppHeader = false,
    shouldHideHeader = false,
    shouldPreventCloseOnEscape = false,
    title,
}) => {
    const { hide, setModalOptions } = Provider.useModal();
    const hasRenderFooter = typeof renderFooter === 'function';
    const fixedFooter = shouldFixedFooter && hasRenderFooter;

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    useEffect(() => {
        setModalOptions({
            shouldHideDerivAppHeader,
        });
    }, [shouldHideDerivAppHeader, setModalOptions]);

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--fixed-footer': fixedFooter && !shouldHideHeader,
                'wallets-modal-step-wrapper--hide-deriv-app-header': shouldHideDerivAppHeader,
                'wallets-modal-step-wrapper--no-header': shouldHideHeader && !fixedFooter,
                'wallets-modal-step-wrapper--no-header--fixed-footer': shouldHideHeader && fixedFooter,
            })}
        >
            {!shouldHideHeader && (
                <div className='wallets-modal-step-wrapper__header'>
                    <Text bold>{title}</Text>
                    <CloseIcon className='wallets-modal-step-wrapper__header-close-icon' onClick={hide} />
                </div>
            )}
            <div className='wallets-modal-step-wrapper__body'>
                {children}
                {!shouldFixedFooter && hasRenderFooter && (
                    <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>
                )}
            </div>
            {shouldFixedFooter && hasRenderFooter && (
                <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>
            )}
        </div>
    );
};

export default ModalStepWrapper;
