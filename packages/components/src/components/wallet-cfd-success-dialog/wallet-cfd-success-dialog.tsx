import React from 'react';
import Button from '../button';
import Modal from '../modal';
import Text from '../text';
import WalletCFDCard from './wallet-cfd-card';
import { isMobile } from '@deriv/shared';
import './wallet-cfd-success-dialog.scss';

export type TWalletCFDCard = {
    account_title: string;
    app_icon: string;
    balance: string;
    currency_title: React.ReactNode;
    currency: string;
    gradient_header_class: string;
    icon: string;
    is_demo: boolean;
    wallet_label: string;
};

type TWalletCFDSuccessDialog = {
    header: string;
    is_demo?: boolean;
    is_open: boolean;
    message: React.ReactNode;
    onSubmit?: () => void;
    submit_button_text?: string;
    toggleModal?: () => void;
    wallet: TWalletCFDCard;
};

const WalletCFDSuccessDialog = ({
    header,
    is_open,
    message,
    onSubmit,
    submit_button_text = 'OK',
    toggleModal,
    wallet,
}: TWalletCFDSuccessDialog) => {
    return (
        <Modal className='wallet-cfd-dialog' has_close_icon={false} is_open={is_open} small toggleModal={toggleModal}>
            <Modal.Body>
                <div className='wallet-cfd-dialog__card'>
                    <WalletCFDCard wallet={wallet} />
                </div>
                <div className='wallet-cfd-dialog__wrapper-text'>
                    <Text as='h2' weight='bold' align='center' size={isMobile() ? 'xs' : 's'}>
                        {header}
                    </Text>
                    <Text as='p' size={isMobile() ? 'xxs' : 'xs'} line_height='s' align='center'>
                        {message}
                    </Text>
                </div>
            </Modal.Body>
            {/* TODO: add another button for real accounts */}
            <Modal.Footer>
                <Button className='wallet-cfd-dialog__btn' primary onClick={onSubmit} large>
                    {submit_button_text}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WalletCFDSuccessDialog;
