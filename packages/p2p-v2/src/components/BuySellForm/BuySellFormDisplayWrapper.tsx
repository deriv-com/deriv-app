import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Modal, useDevice } from '@deriv-com/ui';
import { FullPageMobileWrapper } from '../FullPageMobileWrapper';
import { BuySellFormFooter } from './BuySellFormFooter';
import { BuySellFormHeader } from './BuySellFormHeader';

type TBuySellFormDisplayWrapperProps = {
    accountCurrency: string;
    isBuy: boolean;
    isModalOpen: boolean;
    isValid: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
};
const BuySellFormDisplayWrapper = ({
    accountCurrency,
    children,
    isBuy,
    isModalOpen,
    isValid,
    onRequestClose,
    onSubmit,
}: PropsWithChildren<TBuySellFormDisplayWrapperProps>) => {
    const { isMobile } = useDevice();
    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-buy-sell-form__full-page-modal'
                onBack={onRequestClose}
                renderFooter={() => <BuySellFormFooter isDisabled={!isValid} onClickCancel={onRequestClose} />}
                renderHeader={() => <BuySellFormHeader currency={accountCurrency} isBuy={isBuy} />}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <Modal
            ariaHideApp={false}
            className={clsx('p2p-v2-buy-sell-form', { 'p2p-v2-buy-sell-form--is-buy': isBuy })}
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header onRequestClose={onRequestClose}>
                <BuySellFormHeader currency={accountCurrency} isBuy={isBuy} />
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <BuySellFormFooter isDisabled={!isValid} onClickCancel={onRequestClose} onSubmit={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default BuySellFormDisplayWrapper;
