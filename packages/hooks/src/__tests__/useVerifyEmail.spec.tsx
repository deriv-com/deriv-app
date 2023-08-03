import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { act, renderHook } from '@testing-library/react-hooks';
import useVerifyEmail from '../useVerifyEmail';
import type { TStores } from '@deriv/stores/types';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

const createWrapper = (mock: TStores) => {
    const Wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mock}>{children}</StoreProvider>
        </APIProvider>
    );
    return Wrapper;
};

describe('useVerifyEmail', () => {
    test("should not send the request if client does't have email", () => {
        const mock = mockStore({});

        const wrapper = createWrapper(mock);

        const { result } = renderHook(() => useVerifyEmail('reset_password'), { wrapper });

        act(() => result.current.send());

        expect(result.current.has_been_sent).toBe(false);
    });

    test('should send the request if client have email', () => {
        const mock = mockStore({ client: { email: 'john@company.com' } });

        const wrapper = createWrapper(mock);

        const { result } = renderHook(() => useVerifyEmail('reset_password'), { wrapper });

        act(() => result.current.send());

        expect(result.current.has_been_sent).toBe(true);
    });

    test('should not send the request if the counter is still running', () => {
        const mock = mockStore({ client: { email: 'john@company.com' } });

        const wrapper = createWrapper(mock);

        const { result } = renderHook(() => useVerifyEmail('reset_password'), { wrapper });

        act(() => result.current.send());
        act(() => result.current.send());

        expect(result.current.is_counter_running).toBe(true);
        expect(result.current.sent_count).toBe(1);
    });
});
