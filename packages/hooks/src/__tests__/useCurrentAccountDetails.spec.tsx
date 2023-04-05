import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCurrentAccountDetails from '../useCurrentAccountDetails';

describe('useCurrentAccountDetails', () => {
    test('should return the account info of the current loginid', async () => {
        const mockRootStore = mockStore({
            client: {
                account_list: [
                    {
                        account: {
                            balance: 10000,
                            currency: 'USD',
                            disabled: false,
                            is_crypto: false,
                        },
                        icon: 'icon',
                        is_dark_mode_on: false,
                        loginid: 'loginid',
                        title: 'title',
                    },
                ],
                loginid: 'loginid',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCurrentAccountDetails(), { wrapper });

        expect(result.current).toStrictEqual(mockRootStore.client.account_list[0]);
    });
});
