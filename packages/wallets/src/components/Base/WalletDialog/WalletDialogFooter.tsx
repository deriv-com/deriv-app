import React from 'react';
import classNames from 'classnames';
import { Dialog } from '@deriv-com/ui';

type TProps = {
    children: React.ReactNode;
    className?: string;
};

const WalletDialogFooter = ({ children, className }: TProps) => {
    return <Dialog.Footer className={classNames('wallets-dialog__footer', className)}>{children}</Dialog.Footer>;
};

export default WalletDialogFooter;
