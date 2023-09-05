import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useWalletTransfer from '../useWalletTransfer';
import useTransferMessageBetweenWalletAndTradingApp from '../useTransferMessageBetweenWalletAndTradingApp';

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

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

describe('useTransferMessageBetweenWalletAndTradingApp', () => {
    it('should check whether the hook returns the correct data for transfer between real wallet and its linked trading account', () => {
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

    it('should check whether the hook returns the correct message_code for transfer between demo wallet and its linked trading account', () => {
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
    });
});
