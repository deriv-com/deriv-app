import { useTraderStore } from 'Stores/useTraderStores';

export const updateAmountChanges = (
    obj: Partial<ReturnType<typeof useTraderStore>>,
    stake_value: number,
    payout_value: number,
    basis: string,
    trade_basis: string,
    trade_amount: number
) => {
    // TODO: Move onChangeMultiple outside of duration and amount
    //  and unify all trade parameter components to use same onMultipleChange func onSubmit
    // Checks if Amount tab was changed to stake and stake value was updated
    if (basis === 'stake' && stake_value !== trade_amount) {
        obj.basis = 'stake';
        obj.amount = stake_value;
        // Checks if Amount tab was changed to payout and payout value was updated
    } else if (basis === 'payout' && payout_value !== trade_amount) {
        obj.basis = 'payout';
        obj.amount = payout_value;
        // Checks if Amount tab was changed but payout or stake value was not updated
    } else if (trade_basis !== basis) {
        obj.basis = basis;
        obj.amount = trade_amount;
    }
};
