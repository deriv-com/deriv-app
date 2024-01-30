import { useActiveWalletAccount, usePOI } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useTransferMessages from '../useTransferMessages';

jest.mock('@deriv/api', () => ({
    useActiveWalletAccount: jest.fn(() => ({ data: { mockWallets } })),
    useAuthorize: jest.fn(() => ({ data: { preferred_language: 'en' } })),
    usePOI: jest.fn(() => ({ data: { is_verified: true } })),
    useWalletAccountsList: jest.fn(() => ({ data: [{ mockWallets }, { mockTrading }] })),
}));

const mockWallets = {
    account_category: 'wallet' as const,
    account_type: 'doughflow' as const,
    accountName: 'USD Wallet',
    balance: '10000.00',
    currency: 'USD',
    currencyConfig: {
        code: 'USD',
        display_code: 'USD',
        fractional_digits: 1,
        is_AUD: false,
        is_BTC: false,
        is_BUSD: false,
        is_crypto: false,
        is_DAI: false,
        is_deposit_suspended: 0 as const,
        is_ETH: false,
        is_EUR: false,
        is_EURS: false,
        is_eUSDT: false,
        is_fiat: true,
        is_GBP: false,
        is_IDK: false,
        is_LTC: false,
        is_PAX: false,
        is_suspended: 0 as const,
        is_TUSD: false,
        is_tUSDT: false,
        is_USB: false,
        is_USD: true,
        is_USDC: false,
        is_USDK: false,
        is_USDT: false,
        is_withdrawal_suspended: 0 as const,
        name: 'US Dollar',
        stake_default: 0.1,
        transfer_between_accounts: {
            fees: {},
            limits: { max: 0.1, min: 0.1 },
            limits_ctrader: { max: 0.1, min: 0.1 },
            limits_derivez: { max: 0.1, min: 0.1 },
            limits_dxtrade: { max: 0.1, min: 0.1 },
            limits_mt5: { max: 0.1, min: 0.1 },
        },
        type: 'fiat' as const,
    },
    demo_account: 0 as const,
    displayBalance: '10000.00 USD',
    landingCompanyName: 'svg' as const,
    loginid: '',
    transfer: 'all',
};

const mockTrading = {
    account_category: 'trading' as const,
    account_type: 'ctrader' as const,
    accountName: 'Deriv cTrader',
    balance: '0.00',
    currency: 'USD',
    currencyConfig: {
        code: 'USD',
        display_code: 'USD',
        fractional_digits: 1,
        is_AUD: false,
        is_BTC: false,
        is_BUSD: false,
        is_crypto: false,
        is_DAI: false,
        is_deposit_suspended: 0 as const,
        is_ETH: false,
        is_EUR: false,
        is_EURS: false,
        is_eUSDT: false,
        is_fiat: true,
        is_GBP: false,
        is_IDK: false,
        is_LTC: false,
        is_PAX: false,
        is_suspended: 0 as const,
        is_TUSD: false,
        is_tUSDT: false,
        is_USB: false,
        is_USD: true,
        is_USDC: false,
        is_USDK: false,
        is_USDT: false,
        is_withdrawal_suspended: 0 as const,
        name: 'US Dollar',
        stake_default: 0.1,
        transfer_between_accounts: {
            fees: {},
            limits: { max: 0.1, min: 0.1 },
            limits_ctrader: { max: 0.1, min: 0.1 },
            limits_derivez: { max: 0.1, min: 0.1 },
            limits_dxtrade: { max: 0.1, min: 0.1 },
            limits_mt5: { max: 0.1, min: 0.1 },
        },
        type: 'fiat' as const,
    },
    demo_account: 0 as const,
    displayBalance: '0.00 USD',
    landingCompanyName: 'svg' as const,
    loginid: '',
    transfer: 'all',
};

const mockWalletsTransfer = {
    accountLimits: {},
    activeWalletExchangeRates: {},
    formData: { fromAmount: 100, toAmount: 200 },
    fromAccount: mockWallets,
    toAccount: mockWallets,
    USDExchangeRates: {},
};

describe('useTransferMessages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render default message and type correctly for verified account', () => {
        const { result } = renderHook(() => useTransferMessages(mockWalletsTransfer));

        expect(result.current).toEqual([
            {
                message: {
                    text: 'Fee: {{feeMessageText}} ({{feePercentage}}% transfer fee or {{minimumFeeText}}, whichever is higher, applies for fund transfers between your {{fiatAccountName}}{{conjunction}} cryptocurrency Wallets)',
                    values: {
                        conjunction: ' Wallet and ',
                        feeMessageText: '0.1 USD',
                        feePercentage: undefined,
                        fiatAccountName: undefined,
                        minimumFeeText: '0.1 USD',
                    },
                },
                type: 'info',
            },
        ]);
    });

    test('should render default message and type correctly for unverified account', () => {
        (usePOI as jest.Mock).mockReturnValueOnce({ data: { is_verified: false } });

        const { result } = renderHook(() => useTransferMessages(mockWalletsTransfer));

        expect(result.current).toEqual([
            {
                message: {
                    text: 'Fee: {{feeMessageText}} ({{feePercentage}}% transfer fee or {{minimumFeeText}}, whichever is higher, applies for fund transfers between your {{fiatAccountName}}{{conjunction}} cryptocurrency Wallets)',
                    values: {
                        conjunction: ' Wallet and ',
                        feeMessageText: '0.1 USD',
                        feePercentage: undefined,
                        fiatAccountName: undefined,
                        minimumFeeText: '0.1 USD',
                    },
                },
                type: 'info',
            },
        ]);
    });

    test('should return correct error message and type when existing error in current transfer', () => {
        const mockFailingTransfer = {
            accountLimits: {},
            activeWalletExchangeRates: {},
            formData: { fromAmount: 100, toAmount: 200 },
            fromAccount: mockTrading,
            toAccount: mockWallets,
            USDExchangeRates: {},
        };

        const { result } = renderHook(() => useTransferMessages(mockFailingTransfer));

        expect(result.current).toEqual([
            {
                message: {
                    text: 'Your {{sourceAccountName}} has insufficient balance.',
                    values: { sourceAccountName: 'Deriv cTrader' },
                },
                type: 'error',
            },
        ]);
    });

    test('should not render transfer messages when active wallet is null', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: null });

        const { result } = renderHook(() => useTransferMessages(mockWalletsTransfer));

        expect(result.current).toEqual([]);
    });
});
