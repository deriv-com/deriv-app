import React from 'react';
import classNames from 'classnames';
import { Dialog } from '@deriv-com/ui';

type TProps = {
    children: React.ReactNode;
    className?: string;
};

const WalletDialogContent = ({ children, className }: TProps) => {
    return <Dialog.Body className={classNames('wallets-dialog__content', className)}>{children}</Dialog.Body>;
};

export default WalletDialogContent;
