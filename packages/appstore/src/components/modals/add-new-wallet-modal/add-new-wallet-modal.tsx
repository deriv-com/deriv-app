import React from 'react';
import { WalletCard, WalletSuccessDialog } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { getAccountName } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';
import { getWalletSuccessText } from 'Constants/wallet-success-text';

const AddNewWalletModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setWalletModalActiveTab, setWalletModalActiveWalletID } = traders_hub;
    const {
        is_wallet_creation_success_modal_open,
        toggleIsWalletCreationSuccessModalOpen,
        setIsWalletModalVisible,
        is_mobile,
    } = ui;
    const active_wallet = useActiveWallet();
    const currency = active_wallet?.currency_config?.display_code;

    const wallet_details = {
        currency,
        icon: active_wallet?.icon,
        icon_type: active_wallet?.currency_config?.type,
        name: getAccountName({
            account_type: 'wallet',
            display_currency_code: currency,
        }),
        balance: formatMoney(active_wallet?.currency, active_wallet?.balance, true),
        jurisdiction_title: active_wallet?.landing_company_name,
        gradient_class: active_wallet?.gradient_card_class,
    };

    const wallet_success_text = currency ? getWalletSuccessText('add-wallet', currency) : undefined;

    return (
        <WalletSuccessDialog
            type='add-wallet'
            title={wallet_success_text?.title}
            description={wallet_success_text?.description}
            text_submit={wallet_success_text?.text_submit}
            text_cancel={wallet_success_text?.text_cancel}
            onSubmit={() => {
                toggleIsWalletCreationSuccessModalOpen(false);
                setWalletModalActiveTab('Deposit');
                setIsWalletModalVisible(true);
                setWalletModalActiveWalletID(active_wallet?.loginid);
            }}
            onCancel={() => toggleIsWalletCreationSuccessModalOpen(false)}
            is_open={is_wallet_creation_success_modal_open}
            toggleModal={toggleIsWalletCreationSuccessModalOpen}
            wallet_card={<WalletCard wallet={wallet_details} size={is_mobile ? 'large' : 'medium'} />}
        />
    );
});

export default AddNewWalletModal;
