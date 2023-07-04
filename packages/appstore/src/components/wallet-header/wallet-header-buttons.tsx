import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import WalletButton from 'Components/wallet-button';

type TWalletButton = {
    name: Parameters<ReturnType<typeof useStore>['traders_hub']['setWalletModalActiveTab']>[0];
    text: string;
    icon: string;
    action: () => void;
};

type TWalletHeaderButtons = {
    is_disabled: boolean;
    is_open: boolean;
    buttons: TWalletButton[];
    wallet_account: TWalletAccount;
};

const WalletHeaderButtons = observer(({ is_disabled, is_open, buttons, wallet_account }: TWalletHeaderButtons) => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;

    return (
        <div className='wallet-header__description-buttons'>
            {buttons.map(button => {
                button.action = async () => {
                    setWalletModalActiveTab(button.name);
                    setIsWalletModalVisible(true);
                    setWalletModalActiveWalletID(wallet_account.loginid);
                };

                return (
                    <WalletButton
                        key={button.name}
                        button={button}
                        is_open={is_open}
                        is_disabled={is_disabled}
                        is_desktop_wallet={true}
                    />
                );
            })}
        </div>
    );
});
export default WalletHeaderButtons;
