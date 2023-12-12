import * as React from 'react';
import { APIProvider, useRequest } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useDepositCryptoAddress from '../useDepositCryptoAddress';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'cashier'>>;

describe('useDepositCryptoAddress', () => {
    test('should return undefined if the response is not ready yet', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useDepositCryptoAddress(), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    test('should return the crypto deposit address', () => {
        const address = 'bc1q5wklqjz05jhcdkajlwsl673g97z3te5cktf7xg';
        mockUseRequest.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: { cashier: { deposit: { address } } },
            mutate: jest.fn(),
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useDepositCryptoAddress(), { wrapper });

        expect(result.current.data).toBe(address);
    });
});
