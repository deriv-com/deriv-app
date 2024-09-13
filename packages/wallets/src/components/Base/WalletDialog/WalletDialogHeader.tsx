import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Dialog } from '@deriv-com/ui';

type TProps =
    | {
          className?: string;
          hideCloseIcon: true;
      }
    | {
          className?: string;
          hideCloseIcon?: false;
          onClose: VoidFunction;
      };

const WalletDialogHeader = (props: PropsWithChildren<TProps>) => {
    const { children, className, hideCloseIcon = false } = props;
    const onClose = 'onClose' in props ? props.onClose : undefined;

    return (
        <Dialog.Header
            className={classNames('wallets-dialog__header', className)}
            hideCloseIcon={hideCloseIcon}
            onRequestClose={!hideCloseIcon ? onClose : undefined}
        >
            {children}
        </Dialog.Header>
    );
};

export default WalletDialogHeader;
