import React from 'react';
import { getWalletHeaderButtons } from 'Constants/utils';
import WalletButton from 'Components/wallet-button';

type TWalletHeaderButtons = {
    is_disabled: boolean;
    is_open: boolean;
    buttons: ReturnType<typeof getWalletHeaderButtons>;
};

const WalletHeaderButtons = ({ is_disabled, is_open, buttons }: TWalletHeaderButtons) => {
    return (
        <div className='wallet-header__description-buttons'>
            {buttons.map(button => (
                <WalletButton
                    key={button.name}
                    button={button}
                    is_open={is_open}
                    is_disabled={is_disabled}
                    is_desktop_wallet={true}
                />
            ))}
        </div>
    );
};
WalletHeaderButtons.displayName = 'WalletHeaderButtons';
export default WalletHeaderButtons;
