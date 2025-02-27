import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import WalletsAuthProvider from '../../AuthProvider';
import { mockLocalStorageBeforeEachTest, restoreLocalStorageAfterEachTest } from '../../utils/tests';
import useWalletAccountSwitcher from '../useWalletAccountSwitcher';

const mockSwitchAccount = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAuthorize: () => ({
        data: {
            email: 'test@gmail.com',
            is_virtual: 0,
            loginid: 'CRW12345',
        },
        switchAccount: mockSwitchAccount,
    }),
    useWalletAccountsList: () => ({
        data: [
            {
                account_category: 'real',
                account_type: 'financial',
                currency: 'USD',
                display_login: 'CRW12345',
                is_active: true,
                is_disabled: false,
                is_linked_account_active: false,
                is_mf: false,
                is_trading: true,
                is_virtual: 0,
                is_wallet: true,
                loginid: 'CRW12345',
            },
            {
                account_category: 'real',
                account_type: 'financial',
                currency: 'USD',
                display_login: 'CRW34567',
                is_active: true,
                is_disabled: false,
                is_linked_account_active: false,
                is_mf: false,
                is_trading: true,
                is_virtual: 0,
                is_wallet: true,
                loginid: 'CRW34567',
            },
            {
                account_category: 'real',
                account_type: 'financial',
                currency: 'USD',
                display_login: 'CRW34569',
                is_active: true,
                is_disabled: false,
                is_linked_account_active: false,
                is_mf: false,
                is_trading: true,
                is_virtual: 0,
                is_wallet: true,
                linked_to: [
                    {
                        loginid: 'CR34567',
                        platform: 'dtrade',
                    },
                ],
                loginid: 'CRW34569',
            },
        ],
    }),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('useWalletAccountSwitcher', () => {
    beforeEach(() => {
        mockLocalStorageBeforeEachTest();
    });

    afterEach(() => {
        restoreLocalStorageAfterEachTest();
    });

    it('should be able to switch to another wallet account', async () => {
        const { result } = renderHook(() => useWalletAccountSwitcher(), { wrapper });
        const switchWalletAccount = result.current;

        await switchWalletAccount('CRW34567');
        expect(mockSwitchAccount).toBeCalledWith('CRW34567');
    });

    it('should not set active_loginid if wallet does not have linked dtrade account', async () => {
        const { result } = renderHook(() => useWalletAccountSwitcher(), { wrapper });
        const switchWalletAccount = result.current;

        await switchWalletAccount('CRW34567');
        expect(global.localStorage.getItem('active_loginid')).toBe(undefined);
    });

    it('should set active_loginid if wallet has linked dtrade account', async () => {
        const { result } = renderHook(() => useWalletAccountSwitcher(), { wrapper });
        const switchWalletAccount = result.current;

        await switchWalletAccount('CRW34569');
        expect(global.sessionStorage.getItem('active_loginid')).toBe('CR34567');
    });
});
