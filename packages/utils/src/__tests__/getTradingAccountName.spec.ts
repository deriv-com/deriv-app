import getTradingAccountName from '../getTradingAccountName';

describe('getTradingAccountName', () => {
    it('should return correct account name for standard account', () => {
        expect(getTradingAccountName('standard', false, 'svg')).toEqual('Deriv Apps (SVG) account');
        expect(getTradingAccountName('standard', true, 'svg')).toEqual('Deriv Apps Demo account');
    });

    it('should return correct account name for mt5 account', () => {
        expect(getTradingAccountName('mt5', false, 'svg')).toEqual('MT5 (SVG) account');
        expect(getTradingAccountName('mt5', true, 'svg')).toEqual('MT5 Demo account');
    });

    it('should return correct account name for dxtrade account', () => {
        expect(getTradingAccountName('dxtrade', false, 'svg')).toEqual('Deriv X (SVG) account');
        expect(getTradingAccountName('dxtrade', true, 'svg')).toEqual('Deriv X Demo account');
    });

    it('should return correct account name for binary account', () => {
        expect(getTradingAccountName('binary', false, 'svg')).toEqual('Binary (SVG) account');
        expect(getTradingAccountName('binary', true, 'svg')).toEqual('Binary Demo account');
    });
});
