import { getTransferAccountName } from '../utils';

describe('getTransferAccountName', () => {
    it('should return the currency as the account name for deriv accounts', () => {
        const result = getTransferAccountName({
            account_type: 'binary',
            currency: 'LTC',
        });

        expect(result).toEqual('LTC');
    });

    it('should return the correct name for Deriv X account', () => {
        const result = getTransferAccountName({
            account_type: 'dxtrade',
            currency: 'USD',
        });

        expect(result).toEqual('Deriv X');
    });

    it('should return the correct name for cTrader account', () => {
        const result = getTransferAccountName({
            account_type: 'ctrader',
            currency: 'USD',
        });

        expect(result).toEqual('Deriv cTrader');
    });

    it('should return the correct name for MT5 Derived account', () => {
        let result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\synthetic\\svg_std-hr_usd',
        });

        expect(result).toEqual('Derived SVG');

        result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\synthetic\\bvi_std-hr_usd',
        });

        expect(result).toEqual('Derived BVI');

        result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\synthetic\\vanuatu_std-hr_usd',
        });

        expect(result).toEqual('Derived Vanuatu');
    });

    it('should return the correct name for MT5 Financial account', () => {
        let result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
        });

        expect(result).toEqual('Financial SVG');

        result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\financial\\bvi_std-hr_usd',
        });

        expect(result).toEqual('Financial BVI');

        result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\financial\\vanuatu_std-hr_usd',
        });

        expect(result).toEqual('Financial Vanuatu');

        result = getTransferAccountName({
            account_type: 'mt5',
            currency: 'USD',
            mt5_group: 'real\\p01_ts01\\financial\\labuan_std-hr_usd',
        });

        expect(result).toEqual('Financial Labuan');
    });
});
