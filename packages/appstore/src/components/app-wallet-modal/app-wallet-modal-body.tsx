import React, { ReactElement } from 'react';
import { Dialog as DialogPrimitive } from '@deriv/ui';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import WalletIcon from 'Assets/svgs/wallet';
import { wallets } from './wallets';

interface DialogContentProps {
    children: ReactElement;
}

const message_icon_types: {
    [key: string]: string;
} = {
    information: 'IcAppstoreInformation',
    warning: 'IcAppstoreWarning',
    success: 'IcAppstoreSuccess',
    error: 'IcAppstoreError',
};

const DialogContent = ({ children, ...props }: DialogContentProps) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay />
        <DialogPrimitive.Content {...props}>{children}</DialogPrimitive.Content>
    </DialogPrimitive.Portal>
);

const DialogClose = DialogPrimitive.Close;

export interface AppWalletModalBodyProps {
    balance?: string;
    children?: ReactElement | ReactElement[];
    currency?: string;
    dark?: boolean;
    message?: string;
    message_type?: 'information' | 'warning' | 'success' | 'error';
    wallet_name?: string;
}

const AppWalletModalBody = ({
    children,
    balance,
    currency,
    dark,
    message,
    message_type,
    wallet_name,
}: AppWalletModalBodyProps) => {
    // const wallet_icon_name = dark ? `${wallets[`${wallet_name}`].icon}Dark` : `${wallets[`${wallet_name}`].icon}Light`;
    return (
        <DialogContent>
            <div className={classNames('modal-dialog-content', dark && 'modal-dialog-content-dark')}>
                <div className='modal-dialog-header'>
                    <div>
                        <Text size='s' as='p' color='header'>
                            {wallet_name} {currency} wallet
                        </Text>
                        <Text as='p' size='m' weight='bold' color='colored-background'>
                            {balance} {currency}
                        </Text>
                    </div>
                    <div className='modal-dialog-header__image-wrapper'>
                        {/* {wallet_name && wallets[`${wallet_name}`] && ( */}
                        <WalletIcon icon='DemoLight' className='modal-dialog-header__logo' />
                        {/* )} */}
                        <DialogClose asChild>
                            <Icon
                                className={'modal-dialog-header__logo-close'}
                                icon={dark ? 'IcAppstoreCloseDark' : 'IcAppstoreCloseLight'}
                            />
                        </DialogClose>
                    </div>
                </div>
                <div className='modal-dialog-body'>{children}</div>
                <div className='modal-dialog-footer'>
                    {message && (
                        <div
                            className={classNames(
                                'modal-dialog-footer__message',
                                `modal-dialog-footer__message--${message_type}`
                            )}
                        >
                            <Icon className='icon' icon={message_icon_types[`${message_type}`]} />
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
};

export default AppWalletModalBody;
