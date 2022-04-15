import React from 'react';
import { AppModal } from '@deriv/ui';

export interface AppWalletModalProps {
    balance?: string;
    modal_trigger_children?: JSX.Element;
    modal_body_children?: JSX.Element;
    currency?: string;
    dark?: boolean;
    logo?: string;
    message?: string;
    message_type?: string;
    wallet_name?: string;
}

const AppstoreAppWalletModal = ({
    balance,
    modal_trigger_children,
    modal_body_children,
    currency,
    dark,
    logo,
    message,
    message_type,
    wallet_name,
}: AppWalletModalProps) => {
    return (
        <div>
            <AppModal>
                <AppModal.Trigger>{modal_trigger_children}</AppModal.Trigger>
                <AppModal.Body
                    logo={logo}
                    balance={balance}
                    currency={currency}
                    dark={dark}
                    message={message}
                    message_type={message_type}
                    wallet_name={wallet_name}
                >
                    {modal_body_children}
                </AppModal.Body>
            </AppModal>
        </div>
    );
};

export default AppstoreAppWalletModal;
