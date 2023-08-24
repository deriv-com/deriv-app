import React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useActiveSymbols from '../useActiveSymbols';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'active_symbols'>>;

describe('useActiveSymbols', () => {
    test("should return undefined if there's no data returned from server", () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useActiveSymbols(), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    test('should return icon with proper symbol name', () => {
        mockUseFetch.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { active_symbols: [{ symbol: 'test_symbol' }] },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useActiveSymbols(), { wrapper });

        expect(result.current.data?.[0].icon).toBe('IcUnderlyingtest_symbol');
    });
});
