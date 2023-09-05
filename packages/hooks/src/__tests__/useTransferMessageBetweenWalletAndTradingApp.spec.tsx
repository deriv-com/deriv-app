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
    loginid: 'CRW1040',
    active_wallet_icon: 'IcWalletCurrencyUsd',
    display_currency_code: 'USD',
    is_demo: false,
    shortcode: 'svg',
    type: 'fiat',
    icon: 'IcWalletCurrencyUsd',
    gradient_class: 'wallet-card__usd-bg',
} as ReturnType<typeof useWalletTransfer>['from_account'];

const mock_to_account = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    demo_account: 0,
    loginid: 'CR90000190',
    active_wallet_icon: 'IcWalletCurrencyUsd',
    display_currency_code: 'USD',
    is_demo: false,
    shortcode: 'svg',
    type: 'fiat',
    gradient_class: 'wallet-card__usd-bg',
    icon: 'IcWalletOptionsLight',
} as ReturnType<typeof useWalletTransfer>['to_account'];

const mock_get_limits_response = {
    daily_transfers: {
        dtrade: {
            allowed: '10000.00',
            available: '9000.00',
            minimum: '0.01',
        },
        // ctrader: {
        //     allowed: '50000.00',
        //     available: '49500.00',
        //     minimum: '0.01',
        // },
        // mt5: {
        //     allowed: '10000.00',
        //     available: '10000.00',
        //     minimum: '0.01',
        // },
        // derivez: {
        //     allowed: '200.00',
        //     available: '200.00',
        //     minimum: '0.01',
        // },
        // dxtrade: {
        //     allowed: '2000.00',
        //     available: '1900.00',
        //     minimum: '0.01',
        // },
        // virtual: {
        //     allowed: '10000.00',
        //     available: '700.00',
        //     minimum: '0.01',
        // },
    },
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

describe('useTransferMessageBetweenWalletAndTradingApp', () => {
    it('should check whether the hook returns the correctly calculated data for a real wallet', () => {
        const { result } = renderHook(
            () =>
                useTransferMessageBetweenWalletAndTradingApp(
                    mock_from_account,
                    mock_to_account,
                    mock_get_limits_response
                ),
            { wrapper }
        );
        expect(result.current).toStrictEqual([
            {
                code: 'WalletToTradingAppDailyLimit',
                is_first_transfer: false,
                limit: parseFloat(mock_get_limits_response.daily_transfers.dtrade.available),
                currency: mock_from_account?.currency,
                type: 'success',
            },
        ]);
    });
});
