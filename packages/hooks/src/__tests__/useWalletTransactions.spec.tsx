import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletTransactions from '../useWalletTransactions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize' | 'statement'>>;
describe('useWalletsList', () => {
    test('should return a list of transactions', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345' } },
                currency: 'USD',
                loginid: 'CRW909900',
            },
        });

        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            account_type: 'doughflow',
                            currency: 'USD',
                            is_virtual: 0,
                            loginid: 'CRW909900',
                        },
                    ],
                    loginid: 'CRW909900',
                },
                statement: {
                    transactions: [
                        {
                            action_type: 'deposit',
                            amount: 25,
                            balance_after: 25,
                            transaction_id: 17494415481,
                            transaction_time: 1685942136,
                        },
                        {
                            action_type: 'withdrawal',
                            amount: 750,
                            balance_after: 0,
                            transaction_id: 17494415480,
                            transaction_time: 1685942135,
                        },
                        {
                            action_type: 'transfer',
                            amount: 5,
                            from: {
                                loginid: 'CRW909900',
                            },
                            to: {
                                loginid: 'VRTCMOCK0001',
                            },
                            balance_after: 9995,
                            transaction_id: 17494415484,
                            transaction_time: 1685942139,
                        },
                        {
                            action_type: 'reset_balance',
                            amount: 350,
                            balance_after: 10000,
                            transaction_id: 13693003421,
                            transaction_time: 1685942138,
                        },
                        {
                            action_type: 'transfer',
                            amount: 200,
                            from: {
                                loginid: 'VRTCMOCK0001',
                            },
                            to: {
                                loginid: 'CRW909900',
                            },
                            balance_after: 9650,
                            transaction_id: 17494415483,
                            transaction_time: 1685855740,
                        },
                        {
                            action_type: 'deposit',
                            amount: 1000,
                            balance_after: 1000,
                            transaction_id: 17494117539,
                            transaction_time: 1685769338,
                        },
                    ],
                },
                website_status: {
                    currencies_config: {
                        USD: {
                            fractional_digits: 2,
                            is_deposit_suspended: 0,
                            is_suspended: 0,
                            is_withdrawal_suspended: 0,
                            name: 'US Dollar',
                            stake_default: 10,
                            type: 'fiat',
                        },
                    },
                },
            },
        } as unknown as ReturnType<typeof mockUseFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletTransactions('deposit'), { wrapper });

        expect(result.current.transactions).toEqual([
            {
                action_type: 'deposit',
                amount: 25,
                balance_after: 25,
                gradient_class: 'wallet-card__usd-bg',
                transaction_id: 17494415481,
                transaction_time: 1685942136,
                account_category: 'wallet',
                account_currency: 'USD',
                account_name: 'USD Wallet',
                account_type: 'doughflow',
                icon: 'IcWalletCurrencyUsd',
                icon_type: 'fiat',
            },
            {
                action_type: 'deposit',
                amount: 1000,
                balance_after: 1000,
                gradient_class: 'wallet-card__usd-bg',
                transaction_id: 17494117539,
                transaction_time: 1685769338,
                account_category: 'wallet',
                account_currency: 'USD',
                account_name: 'USD Wallet',
                account_type: 'doughflow',
                icon: 'IcWalletCurrencyUsd',
                icon_type: 'fiat',
            },
        ]);
    });
});
