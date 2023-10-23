import React, { FC, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import useDevice from '../../../hooks/useDevice';
import CloseIcon from '../../../public/images/close-icon.svg';
import { useModal } from '../../ModalProvider';
import { WalletText } from '../WalletText';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter?: () => ReactNode;
    shouldFixedFooter?: boolean;
    title: ReactNode;
};

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({
    children,
    renderFooter,
    shouldFixedFooter = true,
    title,
}) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--fixed': shouldFixedFooter,
            })}
        >
            {typeof title === 'string' ? (
                <div className='wallets-modal-step-wrapper__header'>
                    <WalletText size={isMobile ? 'sm' : 'md'} weight='bold'>
                        {title}
                    </WalletText>
                    <CloseIcon className='wallets-modal-step-wrapper__header-close-icon' onClick={hide} />
                </div>
            ) : (
                title
            )}
            <div className='wallets-modal-step-wrapper__body'>
                {children}
                {!shouldFixedFooter && renderFooter && (
                    <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>
                )}
            </div>
            {shouldFixedFooter && renderFooter && (
                <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>
            )}
        </div>
    );
};

export default ModalStepWrapper;
