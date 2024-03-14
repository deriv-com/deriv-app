import { updateAmountChanges } from '../duration-utils';

type TUpdateAmountChanges = Parameters<typeof updateAmountChanges>;

describe('updateAmountChanges', () => {
    let obj: TUpdateAmountChanges[0],
        stake_value: TUpdateAmountChanges[1],
        payout_value: TUpdateAmountChanges[2],
        basis: TUpdateAmountChanges[3],
        trade_basis: TUpdateAmountChanges[4],
        trade_amount: TUpdateAmountChanges[5];
    beforeEach(() => {
        obj = {
            basis: '',
            amount: 123,
        };
        stake_value = 2;
        payout_value = 1;
        basis = '';
        trade_basis = '';
        trade_amount = 0;
    });
    it('should update basis to "stake" and amount to stake_value when basis is "stake" and stake_value is different from trade_amount', () => {
        stake_value = 20;
        trade_amount = 40;
        basis = 'stake';
        updateAmountChanges(obj, stake_value, payout_value, basis, trade_basis, trade_amount);

        expect(obj.basis).toBe('stake');
        expect(obj.amount).toBe(stake_value);
    });
    it('should update basis to "payout" and amount to payout_value when basis is "payout" and payout_value is different from trade_amount', () => {
        basis = 'payout';
        payout_value = 20;
        trade_amount = 40;
        updateAmountChanges(obj, stake_value, payout_value, basis, trade_basis, trade_amount);

        expect(obj.basis).toBe('payout');
        expect(obj.amount).toBe(payout_value);
    });
    it('should update basis to trade_basis and amount to trade_amount when basis is different from trade_basis', () => {
        trade_basis = 'payout';
        basis = 'stake';
        stake_value = 20;
        trade_amount = 20;
        updateAmountChanges(obj, stake_value, payout_value, basis, trade_basis, trade_amount);
        expect(obj.basis).toBe(basis);
        expect(obj.amount).toBe(trade_amount);
    });
});
