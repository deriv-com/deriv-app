import React from 'react';
import { useWalletTransferReducer } from './reducer/wallet-transfer-reducer';
import WalletTransferTile from './wallet-transfer-tile';

const WalletTransfer = () => {
    const { wallet_transfer_state } = useWalletTransferReducer();

    const {
        from_amount_input_props,
        to_amount_input_props,
        from_transfer_account_selector_props,
        to_transfer_account_selector_props,
    } = wallet_transfer_state;

    return (
        <div className='wallet-transfer'>
            <WalletTransferTile
                amount_input_props={from_amount_input_props}
                transfer_account_selector_props={from_transfer_account_selector_props}
            />
            <WalletTransferTile
                amount_input_props={to_amount_input_props}
                transfer_account_selector_props={to_transfer_account_selector_props}
            />
        </div>
    );
};

export default WalletTransfer;
