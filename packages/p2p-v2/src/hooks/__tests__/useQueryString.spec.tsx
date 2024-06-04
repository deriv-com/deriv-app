import React from 'react';
import { createMemoryHistory } from 'history';
import { useQueryParams } from 'use-query-params';
import { renderHook } from '@testing-library/react-hooks';
import useQueryString from '../useQueryString';

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([
        {},
        jest.fn(), // setQuery
    ]),
}));
const mockUseQueryParams = useQueryParams as jest.MockedFunction<typeof useQueryParams>;
describe('useQueryString', () => {
    it('returns correct query string', () => {
        const history = createMemoryHistory({ initialEntries: ['?x=3'] });
        history.push('/');
        const { result } = renderHook(() => useQueryString());
        expect(result.current.queryString).toEqual({});
    });

    it('should add and replace query strings', () => {
        mockUseQueryParams.mockReturnValueOnce([
            {
                modal: 'NicknameModal',
                tab: 'Stats',
            },
            jest.fn(),
        ]);
        const { result } = renderHook(() => useQueryString());
        const { queryString, setQueryString } = result.current;

        setQueryString({ tab: 'Stats' });
        expect(queryString.tab).toEqual('Stats');

        setQueryString({ modal: 'NicknameModal' });

        expect(queryString.tab).toEqual('Stats');
        expect(queryString.modal).toEqual('NicknameModal');
    });

    it('calls deleteQueryString with correct key', () => {
        mockUseQueryParams.mockReturnValueOnce([{}, jest.fn()]);
        const { result } = renderHook(() => useQueryString());
        const { deleteQueryString } = result.current;

        deleteQueryString('tab');
        expect(result.current.queryString.tab).toBe(undefined);
    });
});
