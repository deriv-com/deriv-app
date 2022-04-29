import React, { ReactElement } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import classNames from 'classnames';
import { wallets } from './wallets';
import { Icon } from '@deriv/components';

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
    logo?: ReactElement;
    message?: string;
    message_type?: 'information' | 'warning' | 'success' | 'error';
    wallet_name?: string;
}

const AppWalletModalBody = ({
    children,
    balance,
    currency,
    dark,
    logo,
    message,
    message_type,
    wallet_name,
}: AppWalletModalBodyProps) => {
    console.log(logo);
    return (
        <DialogContent>
            <div className={classNames('modal-dialog-content', dark && 'modal-dialog-content-dark')}>
                <div className='modal-dialog-header'>
                    <div>
                        <div className='modal-dialog-header__title'>
                            {wallet_name} {currency} wallet
                        </div>
                        <div className='modal-dialog-header__subtitle'>
                            {balance} {currency}
                        </div>
                    </div>
                    <div className='modal-dialog-header__image-wrapper'>
                        {logo}
                        <DialogClose asChild>
                            <Icon
                                className={'modal-dialog-header__logo-close'}
                                icon={dark ? 'IcAppstoreCloseDark' : 'IcAppstoreCloseLight'}
                            />
                        </DialogClose>
                    </div>
                    <div className='modal-dialog-header__ellipse-wrapper'>
                        {wallets.map((wallet, idx) => {
                            if (wallet['name'] === wallet_name)
                                return (
                                    <div key={idx}>
                                        <Icon
                                            className='modal-dialog-header__ellipse'
                                            custom_color={dark ? '#0E0E0E' : wallet['color']}
                                            icon='IcAppstoreCircle'
                                            width={59}
                                            height={136}
                                        />
                                        <Icon
                                            className='modal-dialog-header__circle'
                                            custom_color={dark ? '#0E0E0E' : wallet['color']}
                                            icon='IcAppstoreEllipse'
                                            width={183}
                                            height={44}
                                        />
                                    </div>
                                );

                            return null;
                        })}
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
