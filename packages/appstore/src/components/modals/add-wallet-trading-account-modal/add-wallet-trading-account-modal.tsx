import React from 'react';
import { useHistory } from 'react-router';
import { WalletSuccessDialog } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import WalletAppCard from 'Components/wallet-app-card';
import { getAccountName } from 'Constants/utils';
import { useActiveWallet } from '@deriv/hooks';
import { useActiveWalletAccount } from '@deriv/api';
import { getWalletSuccessText } from 'Constants/wallet-success-text';

const AddWalletTradingAccountModal = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_create_new_account_modal, setWalletCreateNewAccountModal } = traders_hub;

    const active_wallet = useActiveWallet();
    const { data: active_wallet_account } = useActiveWalletAccount();

    const account_title = `${getAccountName({
        account_type: 'trading',
    })} (${active_wallet?.landing_company_name?.toUpperCase()})`;

    const currency_title = getAccountName({
        account_type: 'wallet',
        display_currency_code: active_wallet?.currency_config?.display_code,
    });

    const toggleWalletCreateNewAccountModal = () => {
        setWalletCreateNewAccountModal(!is_wallet_create_new_account_modal);
    };

    const wallet_details = {
        account_title,
        balance: active_wallet_account?.display_balance,
        currency_title,
        gradient_card_class: active_wallet?.gradient_card_class,
        icon: active_wallet?.icon,
        is_demo: active_wallet?.is_demo,
    };

    const history = useHistory();

    const wallet_success_text = getWalletSuccessText('add-trading', account_title, currency_title);

    return (
        <WalletSuccessDialog
            type='add-trading'
            title={wallet_success_text?.title}
            description={wallet_success_text?.description}
            text_submit={wallet_success_text?.text_submit}
            text_cancel={wallet_success_text?.text_cancel}
            onSubmit={() => {
                setWalletCreateNewAccountModal(false);
                history.push(routes.cashier_deposit);
            }}
            onCancel={() => setWalletCreateNewAccountModal(false)}
            is_open={is_wallet_create_new_account_modal}
            toggleModal={toggleWalletCreateNewAccountModal}
            wallet_card={<WalletAppCard wallet={wallet_details} />}
        />
    );
});

export default AddWalletTradingAccountModal;
