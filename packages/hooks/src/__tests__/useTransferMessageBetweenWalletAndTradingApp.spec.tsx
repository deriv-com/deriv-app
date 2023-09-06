import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useExchangeRate from '../useExchangeRate';
import useTransferMessageBetweenWalletAndTradingApp from '../useTransferMessageBetweenWalletAndTradingApp';
import useWalletTransfer from '../useWalletTransfer';

const mock_from_account = {
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
} as ReturnType<typeof useWalletTransfer>['from_account'];

const mock_to_account = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    demo_account: 0,
    loginid: 'CR123',
    display_currency_code: 'USD',
    is_demo: false,
    shortcode: 'svg',
    type: 'fiat',
} as ReturnType<typeof useWalletTransfer>['to_account'];

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

jest.mock('../useExchangeRate', () => ({
    ...jest.requireActual('../useExchangeRate'),
    __esModule: true,
    useExchangeRate: jest.fn(),
}));

const mockUseExchangeRate = useExchangeRate as jest.MockedFunction<typeof useExchangeRate>;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

describe('useTransferMessageBetweenWalletAndTradingApp', () => {
    it('should check whether the hook returns the correct data for transfer between fiat wallet and its linked trading account', () => {
        const { result } = renderHook(
            () =>
                useTransferMessageBetweenWalletAndTradingApp(
                    mock_from_account,
                    mock_to_account,
                    mock_get_limits_response
                ),
            { wrapper }
        );
        expect(result.current[0].code).toBe('WalletToTradingAppDailyLimit');
    });

    it('should check whether the it returns the correct message data for transfer between demo wallet and its linked trading account', () => {
        const { result } = renderHook(
            () =>
                useTransferMessageBetweenWalletAndTradingApp(
                    { ...mock_from_account, demo_account: 1, is_demo: true, type: 'demo' } as typeof mock_from_account,
                    { ...mock_to_account, demo_account: 1, is_demo: true, type: 'demo' } as typeof mock_to_account,
                    mock_get_limits_response
                ),
            { wrapper }
        );
        expect(result.current[0].code).toBe('DemoWalletToTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(Number(mock_get_limits_response.daily_transfers.virtual.available));
    });

    it('should check whether the hook returns the correct data for transfer between crypto wallet and its linked trading account', () => {
        mockUseExchangeRate.mockReturnValue(() => ({
            getRate: () => 0.1,
            last_update: 123,
            base_currency: 'USD',
        }));
        const { result } = renderHook(
            () =>
                useTransferMessageBetweenWalletAndTradingApp(
                    { ...mock_from_account, currency: 'BTC', display_currency_code: 'BTC' } as typeof mock_from_account,
                    { ...mock_to_account, currency: 'BTC', display_currency_code: 'BTC' } as typeof mock_to_account,
                    mock_get_limits_response
                ),
            { wrapper }
        );
        expect(result.current[0].code).toBe('WalletToTradingAppDailyLimit');
        expect(result.current[0].limit).toBe(900);
    });
});
