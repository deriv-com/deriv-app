import { renderHook } from '@testing-library/react-hooks';
import useTransferMessageListBetweenWalletAndTradingApp from '../useTransferMessageListBetweenWalletAndTradingApp';
import useWalletTransfer from '../useWalletTransfer';

const mock_wallet_account: Partial<ReturnType<typeof useWalletTransfer>['from_account']> = {
    account_type: 'wallet',
    balance: 0,
    currency: 'USD',
    demo_account: 0,
    loginid: 'CRW123',
    active_wallet_icon: 'IcWalletCurrencyUsd',
    display_currency_code: 'USD',
    is_demo: false,
    shortcode: 'svg',
    type: 'fiat',
};

const mock_trading_account: Partial<ReturnType<typeof useWalletTransfer>['to_account']> = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    demo_account: 0,
    loginid: 'CR123',
    display_currency_code: 'USD',
    is_demo: false,
    shortcode: 'svg',
    type: 'fiat',
};

const mock_get_limits_response = {
    daily_transfers: {
        dtrade: {
            allowed: '10000.00',
            available: '9000.00',
            minimum: '0.01',
        },
        virtual: {
            allowed: '10000.00',
            available: '9000.00',
            minimum: '0.01',
        },
    },
};

jest.mock('../useExchangeRate', () =>
    jest.fn(() => ({
        getRate: () => 0.1,
        last_update: 123,
        base_currency: 'USD',
    }))
);

describe('useTransferMessageBetweenWalletAndTradingApp', () => {
    it('should check whether the hook returns the correct data for transfer between fiat wallet and its linked trading account', () => {
        const { result, rerender } = renderHook(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                mock_wallet_account,
                mock_trading_account,
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('WalletAndTradingAppDailyLimit');
        rerender(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                mock_trading_account,
                mock_wallet_account,
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('WalletAndTradingAppDailyLimit');
    });

    it('should check whether the it returns the correct message data for transfer between demo wallet and its linked trading account', () => {
        const { result, rerender } = renderHook(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                { ...mock_wallet_account, demo_account: 1, is_demo: true, type: 'demo' },
                {
                    ...mock_trading_account,
                    demo_account: 1,
                    is_demo: true,
                    type: 'demo',
                },
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('DemoWalletAndTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(Number(mock_get_limits_response.daily_transfers.virtual.available));

        rerender(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                {
                    ...mock_trading_account,
                    demo_account: 1,
                    is_demo: true,
                    type: 'demo',
                },
                { ...mock_wallet_account, demo_account: 1, is_demo: true, type: 'demo' },
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('DemoWalletAndTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(Number(mock_get_limits_response.daily_transfers.virtual.available));
    });

    it('should check whether the hook returns the correct data for transfer between crypto wallet and its linked trading account', () => {
        const { result, rerender } = renderHook(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                { ...mock_wallet_account, currency: 'BTC', display_currency_code: 'BTC' },
                {
                    ...mock_trading_account,
                    currency: 'BTC',
                    display_currency_code: 'BTC',
                },
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('WalletAndTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(900);

        rerender(() =>
            useTransferMessageListBetweenWalletAndTradingApp(
                {
                    ...mock_trading_account,
                    currency: 'BTC',
                    display_currency_code: 'BTC',
                },
                { ...mock_wallet_account, currency: 'BTC', display_currency_code: 'BTC' },
                mock_get_limits_response
            )
        );
        expect(result.current[0].code).toBe('WalletAndTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(900);
    });
});
