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

const mockUnorderedTransferAccounts = [
    { account_type: 'dxtrade', currency: 'USD', loginid: 'CR3' },
    { account_type: 'binary', currency: 'ETH', loginid: 'CR6' },
    { account_type: 'mt5', currency: 'USD', loginid: 'CR1' },
    { account_type: 'binary', currency: 'USD', loginid: 'CR4' },
    { account_type: 'ctrader', currency: 'USD', loginid: 'CR2' },
    { account_type: 'binary', currency: 'BTC', loginid: 'CR5' },
] as THooks.TransferAccounts;

const getCurrencyType = (currency: string) => {
    let is_fiat = false,
        is_crypto = false;
    switch (currency) {
        case 'USD':
            is_fiat = true;
            break;
        case 'BTC':
            is_crypto = true;
            break;
        case 'ETH':
            is_crypto = true;
            break;
    }
    return { is_crypto, is_fiat };
};

describe('useExtendedTransferBetweenAccounts', () => {
    beforeEach(() => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: { account_type: 'binary', currency: 'USD', loginid: 'CR4' },
            isLoading: false,
        });

        mockUseCurrencyConfig.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getConfig: jest.fn(currency => ({
                config: `currencyConfig-${currency}`,
                ...getCurrencyType(currency),
            })),
            isLoading: false,
        });
    });
    afterEach(cleanup);

    it('should return the all the accounts in the correct order', async () => {
        const { result } = await renderHook(() => useExtendedTransferBetweenAccounts(mockUnorderedTransferAccounts));
        const order = ['CR1', 'CR2', 'CR3', 'CR4', 'CR5', 'CR6'];
        console.log('=>', result.current.accounts);
        expect(result.current.accounts.map(account => account.loginid)).toEqual(order);
    });

    it('should check if all the accounts contain the correct currency config data', async () => {
        const { result } = await renderHook(() => useExtendedTransferBetweenAccounts(mockUnorderedTransferAccounts));
        const mockExpectedTransferAccounts = [
            {
                account_type: 'mt5',
                currency: 'USD',
                loginid: 'CR1',
                currencyConfig: {
                    config: `currencyConfig-USD`,
                    is_fiat: true,
                    is_crypto: false,
                },
            },
            {
                account_type: 'ctrader',
                currency: 'USD',
                loginid: 'CR2',
                currencyConfig: {
                    config: `currencyConfig-USD`,
                    is_fiat: true,
                    is_crypto: false,
                },
            },
            {
                account_type: 'dxtrade',
                currency: 'USD',
                loginid: 'CR3',
                currencyConfig: {
                    config: `currencyConfig-USD`,
                    is_fiat: true,
                    is_crypto: false,
                },
            },
            {
                account_type: 'binary',
                currency: 'USD',
                loginid: 'CR4',
                currencyConfig: {
                    config: `currencyConfig-USD`,
                    is_fiat: true,
                    is_crypto: false,
                },
            },
            {
                account_type: 'binary',
                currency: 'BTC',
                loginid: 'CR5',
                currencyConfig: {
                    config: `currencyConfig-BTC`,
                    is_fiat: false,
                    is_crypto: true,
                },
            },
            {
                account_type: 'binary',
                currency: 'ETH',
                loginid: 'CR6',
                currencyConfig: {
                    config: `currencyConfig-ETH`,
                    is_fiat: false,
                    is_crypto: true,
                },
            },
        ];
        console.log('=>', result.current.accounts);
        expect(result.current.accounts).toEqual(mockExpectedTransferAccounts);
    });
});
