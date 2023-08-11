import React from 'react';
import { Button, Modal, Text, WalletCard } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useActiveWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { formatMoney } from '@deriv/shared';
import { getAccountName } from 'Constants/utils';
import './wallet-success-dialog.scss';

const WalletSuccessDialog = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setWalletModalActiveTab, setWalletModalActiveWalletID } = traders_hub;
    const { is_wallet_creation_success_modal_open, toggleIsWalletCreationSuccessModalOpen, setIsWalletModalVisible } =
        ui;
    const active_wallet = useActiveWallet();

    const wallet_details = {
        currency: active_wallet?.currency_config?.display_code,
        icon: active_wallet?.icon,
        icon_type: active_wallet?.currency_config?.type,
        name: getAccountName({
            account_type: 'wallet',
            display_currency_code: active_wallet?.currency_config?.display_code,
        }),
        balance: formatMoney(active_wallet?.currency, active_wallet?.balance, true),
        jurisdiction_title: active_wallet?.landing_company_name,
        gradient_class: active_wallet?.gradient_card_class,
    };

    return (
        <Modal
            className='wallet-success-dialog'
            is_open={is_wallet_creation_success_modal_open}
            toggleModal={toggleIsWalletCreationSuccessModalOpen}
            has_close_icon={false}
            small
            shouldCloseOnEscape={false}
        >
            <Modal.Body>
                <div className='wallet-success-dialog__icon'>
                    <WalletCard wallet={wallet_details} size='medium' />
                </div>
                <Text as='h2' weight='bold' className='wallet-success-dialog__title'>
                    <Localize
                        i18n_default_text='Your {{currency}} Wallet is ready'
                        values={{ currency: active_wallet?.currency_config?.display_code }}
                    />
                </Text>
                <Text as='p' size='xs' line_height='s' align='center' className='wallet-success-dialog__description'>
                    {localize('Make a deposit into your new Wallet.')}
                </Text>
            </Modal.Body>
            <Modal.Footer className='wallet-success-dialog__footer'>
                <Button.Group>
                    <Button secondary onClick={() => toggleIsWalletCreationSuccessModalOpen(false)}>
                        {localize('Maybe later')}
                    </Button>
                    <Button
                        primary
                        onClick={() => {
                            toggleIsWalletCreationSuccessModalOpen(false);
                            setWalletModalActiveTab('Deposit');
                            setIsWalletModalVisible(true);
                            setWalletModalActiveWalletID(active_wallet?.loginid);
                        }}
                    >
                        {localize('Deposit')}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
});

export default WalletSuccessDialog;
