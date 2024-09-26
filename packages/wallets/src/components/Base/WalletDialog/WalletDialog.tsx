import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Dialog } from '@deriv-com/ui';
import WalletDialogContent from './WalletDialogContent';
import WalletDialogFooter from './WalletDialogFooter';
import WalletDialogHeader from './WalletDialogHeader';
import './WalletDialog.scss';

type TProps = {
    className?: string;
    isVisible: boolean;
    onClose: VoidFunction;
    shouldCloseOnOverlayClick?: boolean;
};

const WalletDialog = ({
    children,
    className,
    isVisible = false,
    onClose,
    shouldCloseOnOverlayClick = false,
}: PropsWithChildren<TProps>) => {
    return (
        <Dialog
            className={classNames('wallets-dialog', className)}
            isOpen={isVisible}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
            {children}
        </Dialog>
    );
};

WalletDialog.Header = WalletDialogHeader;
WalletDialog.Content = WalletDialogContent;
WalletDialog.Footer = WalletDialogFooter;

export default WalletDialog;
