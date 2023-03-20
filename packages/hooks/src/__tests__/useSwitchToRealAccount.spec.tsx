import * as React from 'react';
import { mockStore, StoreProvider, useStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useSwitchToRealAccount from '../useSwitchToRealAccount';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

jest.setTimeout(30000);

const TestComponent = () => {
    const switchToReal = useSwitchToRealAccount();

    React.useEffect(() => {
        switchToReal();
    }, [switchToReal]);

    return <></>;
};

describe('useSwitchToRealAccount', () => {
    test('should not switch if is_pre_appstore is false', async () => {
        const mock = mockStore({
            client: {
                is_pre_appstore: false,
                is_virtual: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <TestComponent />
                {children}
            </StoreProvider>
        );

        const { result } = renderHook(() => useStore(), { wrapper });

        expect(result.current.client.is_virtual).toBe(true);

        result.current.client.switchAccount('real');

        expect(result.current.client.is_virtual).toBe(true);
    });

    test('should not switch if is already real account', async () => {
        const mock = mockStore({
            client: {
                is_pre_appstore: true,
                is_virtual: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <TestComponent />
                {children}
            </StoreProvider>
        );

        const { result } = renderHook(() => useStore(), { wrapper });

        expect(result.current.client.is_virtual).toBe(false);

        result.current.client.switchAccount('real');

        expect(result.current.client.is_virtual).toBe(false);
    });

    test('should not switch if doesnt have real account', () => {
        const history = createMemoryHistory();
        const mock = mockStore({
            client: {
                is_pre_appstore: true,
                is_virtual: true,
                has_active_real_account: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <Router history={history}>
                    <TestComponent />
                </Router>
                {children}
            </StoreProvider>
        );

        const { result } = renderHook(() => useStore(), { wrapper });

        expect(result.current.client.is_virtual).toBe(true);

        result.current.client.switchAccount('real');

        expect(history.location.pathname).toBe('/appstore/traders-hub');
        expect(result.current.client.is_virtual).toBe(true);
    });
});
