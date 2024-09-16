import React, { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { useModal } from '../../ModalProvider';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    disableAnimation?: boolean;
    disableScroll?: boolean;
    renderFooter?: () => ReactNode;
    shouldFixedFooter?: boolean;
    shouldHideDerivAppHeader?: boolean;
    shouldHideFooter?: boolean;
    shouldHideHeader?: boolean;
    shouldPreventCloseOnEscape?: boolean;
    title?: string;
};

type TFooterProps = {
    hasRenderFooter: boolean;
    renderFooter: TModalStepWrapperProps['renderFooter'];
};

const Footer: FC<TFooterProps> = ({ hasRenderFooter, renderFooter }) =>
    hasRenderFooter && renderFooter ? (
        <div className='wallets-modal-step-wrapper__footer' data-testid='dt_modal_step_wrapper_footer'>
            {renderFooter()}
        </div>
    ) : null;

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({
    children,
    disableAnimation = false,
    disableScroll = false,
    renderFooter,
    shouldFixedFooter = true,
    shouldHideDerivAppHeader = false,
    shouldHideFooter = false,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldHideDerivAppHeader]);

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--disable-animation': disableAnimation,
                'wallets-modal-step-wrapper--disable-scroll': disableScroll,
                'wallets-modal-step-wrapper--fixed-footer': fixedFooter && !shouldHideHeader,
                'wallets-modal-step-wrapper--hide-deriv-app-header': shouldHideDerivAppHeader,
                'wallets-modal-step-wrapper--no-footer': shouldHideFooter,
                'wallets-modal-step-wrapper--no-header': shouldHideHeader && !fixedFooter,
                'wallets-modal-step-wrapper--no-header--fixed-footer': shouldHideHeader && fixedFooter,
            })}
            data-testid='dt_modal_step_wrapper'
        >
            {!shouldHideHeader && (
                <div className='wallets-modal-step-wrapper__header' data-testid='dt_modal_step_wrapper_header'>
                    <Text weight='bold'>{title}</Text>
                    <LegacyClose2pxIcon
                        className='wallets-modal-step-wrapper__header-close-icon'
                        data-testid='dt_modal_step_wrapper_header_icon'
                        iconSize='xs'
                        onClick={hide}
                    />
                </div>
            )}
            <div className='wallets-modal-step-wrapper__body' data-testid='dt_modal_step_wrapper_body'>
                {children}
                {!shouldFixedFooter && <Footer hasRenderFooter={hasRenderFooter} renderFooter={renderFooter} />}
            </div>
            {shouldFixedFooter && <Footer hasRenderFooter={hasRenderFooter} renderFooter={renderFooter} />}
        </div>
    );
};

export default ModalStepWrapper;
