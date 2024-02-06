import React, { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import CloseIcon from '../../../public/images/close-icon.svg';
import { useModal } from '../../ModalProvider';
import { WalletText } from '../WalletText';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter?: () => ReactNode;
    shouldFixedFooter?: boolean;
    shouldHideDerivAppHeader?: boolean;
    shouldHideFooter?: boolean;
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
    const { hide, setModalOptions } = useModal();
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

    const Footer = () =>
        hasRenderFooter ? (
            <div className='wallets-modal-step-wrapper__footer' data-testid='dt_modal_step_wrapper_footer'>
                {renderFooter()}
            </div>
        ) : null;

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--fixed-footer': fixedFooter && !shouldHideHeader,
                'wallets-modal-step-wrapper--hide-deriv-app-header': shouldHideDerivAppHeader,
                'wallets-modal-step-wrapper--no-header': shouldHideHeader && !fixedFooter,
                'wallets-modal-step-wrapper--no-header--fixed-footer': shouldHideHeader && fixedFooter,
            })}
            data-testid='dt_modal_step_wrapper'
        >
            {!shouldHideHeader && (
                <div className='wallets-modal-step-wrapper__header' data-testid='dt_modal_step_wrapper_header'>
                    <WalletText weight='bold'>{title}</WalletText>
                    <CloseIcon
                        className='wallets-modal-step-wrapper__header-close-icon'
                        data-testid='dt_modal_step_wrapper_header_icon'
                        onClick={hide}
                    />
                </div>
            )}
            <div className='wallets-modal-step-wrapper__body' data-testid='dt_modal_step_wrapper_body'>
                {children}
                {!shouldFixedFooter && <Footer />}
            </div>
            {shouldFixedFooter && <Footer />}
        </div>
    );
};

export default ModalStepWrapper;
