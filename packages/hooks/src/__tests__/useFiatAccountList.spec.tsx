import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useFiatAccountList from '../useFiatAccountList';

describe('useFiatAccountList', () => {
    test('should return an empty list if client has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([]);
    });

    test('should return an empty list if client has no fiat account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC', is_virtual: false, loginid: 'CR123' }],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([]);
    });

    test('should return list of fiat accounts if client any fiat account', async () => {
        const mock = mockStore({
            client: {
                account_list: [
                    { title: 'BTC', is_virtual: false, loginid: 'CR123' },
                    { title: 'USD', is_virtual: false, loginid: 'CR123' },
                ],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([{ title: 'USD', is_virtual: false, loginid: 'CR123' }]);
    });
    test('should return list of fiat accounts if client has 1 CR fiat and 1 MF fiat account', async () => {
        const mock = mockStore({
            client: {
                account_list: [
                    { title: 'BTC', is_virtual: false, loginid: 'CR123' },
                    { title: 'USD', is_virtual: false, loginid: 'CR123' },
                    { title: 'USD', is_virtual: false, loginid: 'MF123' },
                ],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([
            { title: 'USD', is_virtual: false, loginid: 'CR123' },
            { title: 'USD', is_virtual: false, loginid: 'MF123' },
        ]);
    });
});
