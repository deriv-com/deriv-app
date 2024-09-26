import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import useGetPasskeysList from '../useGetPasskeysList';

describe('useGetPasskeysList', () => {
    const mockFetchPasskeysList = jest.fn();
    const mock_passkeys_list = [
        {
            id: 1,
            name: 'Test Passkey 1',
            last_used: 1633024800000,
            created_at: 1633024800000,
            stored_on: 'Test device 1',
            icon: 'Test Icon 1',
            passkey_id: 'mock-id-1',
        },
        {
            id: 2,
            name: 'Test Passkey 2',
            last_used: 1633124800000,
            created_at: 1634024800000,
            stored_on: 'Test device 2',
            icon: 'Test Icon 2',
            passkey_id: 'mock-id-2',
        },
    ];

    const mock = mockStore({
        client: {
            passkeys_list: mock_passkeys_list,
            fetchPasskeysList: mockFetchPasskeysList,
        },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should return the initial state correctly', () => {
        const { result } = renderHook(() => useGetPasskeysList(), {
            wrapper,
        });

        expect(result.current.passkeys_list).toEqual(mock_passkeys_list);
        expect(result.current.passkeys_list_error).toBeNull();
        expect(result.current.is_passkeys_list_loading).toBeFalsy();
    });

    it('should set loading state to true when refetching', async () => {
        mockFetchPasskeysList.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useGetPasskeysList(), {
            wrapper,
        });

        act(() => {
            result.current.refetchPasskeysList();
        });

        await waitFor(() => {
            expect(result.current.is_passkeys_list_loading).toBeTruthy();
        });
    });

    it('should handle successful fetch correctly', async () => {
        mockFetchPasskeysList.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useGetPasskeysList(), {
            wrapper,
        });

        await act(async () => {
            await result.current.refetchPasskeysList();
        });

        expect(result.current.is_passkeys_list_loading).toBeFalsy();
        expect(result.current.passkeys_list_error).toBeNull();
    });

    it('should handle fetch errors correctly', async () => {
        const mockError = { message: 'Fetch failed' };
        mockFetchPasskeysList.mockRejectedValueOnce(mockError);
        const { result } = renderHook(() => useGetPasskeysList(), {
            wrapper,
        });

        await act(async () => {
            await result.current.refetchPasskeysList();
        });

        expect(result.current.is_passkeys_list_loading).toBeFalsy();
        expect(result.current.passkeys_list_error).toEqual(mockError);
    });
});
