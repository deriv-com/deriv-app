import React, { ReactElement } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import AppWalletModalBody from './app-wallet-modal-body';
import AppWalletModalTrigger from './app-wallet-modal-trigger';

export const Dialog = DialogPrimitive.Root;

export interface ModalProps {
    children?: ReactElement[];
}

const WalletModal = ({ children }: ModalProps) => {
    return <Dialog>{children}</Dialog>;
};

WalletModal.Trigger = AppWalletModalTrigger;
WalletModal.Body = AppWalletModalBody;

export default WalletModal;
