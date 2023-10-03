import React, { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import CloseIcon from '../../public/images/close-icon.svg';
import { useModal } from '../ModalProvider';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter: () => React.ReactNode;
    shouldFixedFooter?: boolean;
    title: string;
};

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({
    children,
    renderFooter,
    shouldFixedFooter = true,
    title,
}) => {
    const { hide } = useModal();

    return (
        <div
            className={classNames('wallets-modal-step-wrapper', {
                'wallets-modal-step-wrapper--fixed': shouldFixedFooter,
            })}
        >
            <div className='wallets-modal-step-wrapper__header'>
                {title}
                <CloseIcon className='wallets-modal-step-wrapper__header-close-icon' onClick={hide} />
            </div>
            <div className='wallets-modal-step-wrapper__body'>
                {children}
                {!shouldFixedFooter && <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>}
            </div>
            {shouldFixedFooter && <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>}
        </div>
    );
};

export default ModalStepWrapper;
