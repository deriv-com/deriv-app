import React, { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import CloseIcon from '../../../public/images/close-icon.svg';
import { useModal } from '../../ModalProvider';
import { WalletText } from '../WalletText';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter?: () => React.ReactNode;
    shouldFixedFooter?: boolean;
    shouldHideHeader?: boolean;
    title?: string;
};

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({
    children,
    renderFooter,
    shouldFixedFooter = true,
    shouldHideHeader = false,
    title,
}) => {
    const { hide } = useModal();
    const hasRenderFooter = typeof renderFooter === 'function';

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--fixed': shouldFixedFooter,
            })}
        >
            {!shouldHideHeader && (
                <div className='wallets-modal-step-wrapper__header'>
                    {title && <WalletText weight='bold'>{title}</WalletText>}
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
