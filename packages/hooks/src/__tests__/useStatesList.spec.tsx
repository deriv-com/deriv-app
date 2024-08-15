import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider, useQuery } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import useStatesList from '../useStatesList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'states_list'>>;

describe('useStatesList', () => {
    const mock = mockStore({});

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mock}>{children}</StoreProvider>
        </APIProvider>
    );

    it('should return an empty array when the store is not ready', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [],
            },
        });
        const { result } = renderHook(() => useStatesList('in'), { wrapper });

        expect(result.current.data).toHaveLength(0);
    });

    it('should return data fetched along with correct status', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [
                    { text: 'state 1', value: 's1' },
                    { text: 'state 2', value: 's2' },
                ],
            },
            isFetched: true,
        });
        const { result } = renderHook(() => useStatesList('in'), { wrapper });
        expect(result.current.isFetched).toBeTruthy();
    });
});
