import { renderHook, cleanup } from '@testing-library/react-hooks';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import useExtendedTransferBetweenAccounts from '../useExtendedTransferAccounts';
import { THooks } from '../../../../hooks/types';
import { getMarketType } from '../../../../helpers';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

const mockUseActiveAccount = useActiveAccount as jest.MockedFunction<typeof useActiveAccount>;
const mockUseCurrencyConfig = useCurrencyConfig as jest.MockedFunction<typeof useCurrencyConfig>;
const mockUnorderedMT5Accounts = [
    { account_type: 'mt5', currency: 'USD', loginid: 'CR2', mt5_group: 'real\\p01_ts01\\financial\\svg_std-hr_usd' },
    { account_type: 'mt5', currency: 'USD', loginid: 'CR3', mt5_group: 'real\\p01_ts01\\all\\svg_std-hr_usd' },
    { account_type: 'mt5', currency: 'USD', loginid: 'CR1', mt5_group: 'real\\p01_ts01\\synthetic\\svg_std-hr_usd' },
] as THooks.TransferAccounts;

const mockUnorderedTransferAccounts = [
    { account_type: 'dxtrade', currency: 'USD', loginid: 'CR5' },
    { account_type: 'binary', currency: 'ETH', loginid: 'CR8' },
    { account_type: 'binary', currency: 'USD', loginid: 'CR6' },
    { account_type: 'ctrader', currency: 'USD', loginid: 'CR4' },
    { account_type: 'binary', currency: 'BTC', loginid: 'CR7' },
    ...mockUnorderedMT5Accounts,
] as THooks.TransferAccounts;

describe('useExtendedTransferBetweenAccounts', () => {
    beforeEach(() => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: { currency: 'ETH', loginid: 'CR8' },
            isLoading: false,
        });

        mockUseCurrencyConfig.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getConfig: jest.fn(currency => `currencyConfig-${currency}`),
            isLoading: false,
        });
    });
    afterEach(cleanup);

    it('should return the all the modified MT5 accounts in the correct order', async () => {
        const { result } = await renderHook(() => useExtendedTransferBetweenAccounts(mockUnorderedMT5Accounts));
        const order = ['CR1', 'CR2', 'CR3'];
        expect(result.current.accounts.map(account => account.loginid)).toEqual(order);
    });

    fit('should return all the modified accounts in the correct order', async () => {
        const { result } = await renderHook(() => useExtendedTransferBetweenAccounts(mockUnorderedTransferAccounts));
        const order = ['CR1', 'CR2', 'CR3', 'CR4', 'CR5', 'CR6', 'CR7', 'CR8'];
        expect(result.current.accounts.map(account => account.loginid)).toEqual(order);
    });

    it('should return the hooks data after appending currencyConfig data for each of the accounts', async () => {
        const { result } = await renderHook(() => useExtendedTransferBetweenAccounts(mockUnorderedTransferAccounts));
        result.current.accounts.forEach(account => {
            expect(account.currencyConfig).toEqual(`currencyConfig-${account.currency}`);
        });
    });
});
