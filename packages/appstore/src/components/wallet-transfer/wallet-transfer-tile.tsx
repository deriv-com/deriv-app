import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { AmountInput, TransferAccountSelector } from '@deriv/components';
import type { TAmountInput, TTransferAccountSelector } from './types';

type TWalletTransferTile = {
    amount_input_props: TAmountInput;
    transfer_account_selector_props: TTransferAccountSelector;
};

const Divider = () => <div className='wallet-transfer__divider' />;

const WalletTransferTile = observer(({ amount_input_props, transfer_account_selector_props }: TWalletTransferTile) => {
    const { ui } = useStore();

    const { is_mobile } = ui;

    const list_height_with_offset = 'calc(100vh - 12.2rem)';

    return (
        <div className='wallet-transfer__tile'>
            <AmountInput {...amount_input_props} />
            <Divider />
            <TransferAccountSelector
                {...transfer_account_selector_props}
                mobile_list_min_height={list_height_with_offset}
                portal_id={is_mobile ? 'mobile_list_modal_root' : 'modal_root'}
                is_mobile={is_mobile}
            />
        </div>
    );
});

export default WalletTransferTile;
