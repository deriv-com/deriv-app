import React from 'react';
import { WalletSuccessDialog, WalletAppCard } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { getAccountName } from 'Constants/utils';
import { getWalletSuccessText } from 'Constants/wallet-success-text';

const AddWalletTradingAccountModal = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { is_new_wallet_modal_open, setNewWalletModalOpen, setWalletModalActiveWalletID, setWalletModalActiveTab } =
        traders_hub;

    const active_wallet = useActiveWallet();

    const account_title = `${getAccountName({
        account_type: 'trading',
    })} (${active_wallet?.landing_company_name?.toUpperCase()})`;

    const currency_title = getAccountName({
        account_type: 'wallet',
        display_currency_code: active_wallet?.currency_config?.display_code,
    });

    const toggleWalletCreateNewAccountModal = () => {
        setNewWalletModalOpen(!is_new_wallet_modal_open);
    };

    const card_label = active_wallet?.is_demo ? (
        <Localize i18n_default_text='Demo' />
    ) : (
        <Localize i18n_default_text='Real' />
    );

    const wallet_details = {
        account_title,
        balance: active_wallet?.display_balance,
        currency_title,
        gradient_card_class: active_wallet?.gradient_card_class,
        icon: active_wallet?.icon,
        is_demo: active_wallet?.is_demo,
        label: card_label,
    };

    const wallet_success_text = getWalletSuccessText('add-trading', account_title, currency_title);

    return (
        <WalletSuccessDialog
            title={wallet_success_text?.title}
            description={wallet_success_text?.description}
            text_submit={wallet_success_text?.text_submit}
            text_cancel={wallet_success_text?.text_cancel}
            onSubmit={() => {
                setNewWalletModalOpen(false);
                setWalletModalActiveTab('Transfer');
                setIsWalletModalVisible(true);
                setWalletModalActiveWalletID(active_wallet?.loginid);
            }}
            onCancel={() => setNewWalletModalOpen(false)}
            is_open={is_new_wallet_modal_open}
            toggleModal={toggleWalletCreateNewAccountModal}
            wallet_card={<WalletAppCard wallet={wallet_details} />}
        />
    );
});

export default AddWalletTradingAccountModal;
