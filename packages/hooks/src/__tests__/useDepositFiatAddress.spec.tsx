import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider } from '@deriv/api';
import useDepositFiatAddress from '../useDepositFiatAddress';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ data: { cashier: 'https://example.com' }, mutate: jest.fn })),
}));

describe('useDepositFiatAddress', () => {
    it('should get the iframe url when cashier API is called', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useDepositFiatAddress(), { wrapper });

        result.current.resend();

        expect(result.current.data).toMatch('https://example.com');
    });

    it('should get the iframe url for light mode', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useDepositFiatAddress(), { wrapper });

        result.current.resend();

        expect(result.current.data).toBe('https://example.com&DarkMode=off');
    });
});
