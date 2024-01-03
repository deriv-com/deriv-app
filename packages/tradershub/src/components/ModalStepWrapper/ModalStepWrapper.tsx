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
            className={classNames('modal-step-wrapper', {
                'modal-step-wrapper--fixed-footer': fixedFooter && !shouldHideHeader,
                'modal-step-wrapper--hide-deriv-app-header': shouldHideDerivAppHeader,
                'modal-step-wrapper--no-header': shouldHideHeader && !fixedFooter,
                'modal-step-wrapper--no-header--fixed-footer': shouldHideHeader && fixedFooter,
            })}
        >
            {!shouldHideHeader && (
                <div className='modal-step-wrapper__header'>
                    <Text bold>{title}</Text>
                    <CloseIcon className='modal-step-wrapper__header-close-icon' onClick={hide} />
                </div>
            )}
            <div className='modal-step-wrapper__body'>
                {children}
                {!shouldFixedFooter && hasRenderFooter && (
                    <div className='modal-step-wrapper__footer'>{renderFooter()}</div>
                )}
            </div>
            {shouldFixedFooter && hasRenderFooter && <div className='modal-step-wrapper__footer'>{renderFooter()}</div>}
        </div>
    );
};

export default ModalStepWrapper;
