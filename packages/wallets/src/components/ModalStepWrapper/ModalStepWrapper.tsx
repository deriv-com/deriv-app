import React, { FC, PropsWithChildren } from 'react';
import CloseIcon from '../../public/images/close-icon.svg';
import { useModal } from '../ModalProvider';
import './ModalStepWrapper.scss';

type TModalStepWrapperProps = {
    renderFooter: () => React.ReactNode;
    title: string;
};

const ModalStepWrapper: FC<PropsWithChildren<TModalStepWrapperProps>> = ({ children, renderFooter, title }) => {
    const { hide } = useModal();

    return (
        <div className='wallets-modal-step-wrapper'>
            <div className='wallets-modal-step-wrapper__header'>
                {title}
                <CloseIcon className='wallets-modal-step-wrapper__header-close-icon' onClick={hide} />
            </div>
            {children}
            <div className='wallets-modal-step-wrapper__footer'>{renderFooter()}</div>
        </div>
    );
};

export default ModalStepWrapper;
