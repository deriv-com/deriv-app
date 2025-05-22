import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import WalletsAuthProvider from '../../AuthProvider';
import { mockLocalStorageBeforeEachTest, restoreLocalStorageAfterEachTest } from '../../utils/tests';
import useSyncLocalStorageClientAccounts from '../useSyncLocalStorageClientAccounts';

jest.mock('usehooks-ts', () => ({
    ...jest.requireActual('usehooks-ts'),
    useLocalStorage: jest.fn((key: string) => {
        return [
            global.localStorage.getItem(key),
            (data: unknown) => {
                const stringifiedData = JSON.stringify(data);
                global.localStorage.setItem(key, stringifiedData);
            },
        ];
    }),
    useReadLocalStorage: jest.fn((key: string) => global.localStorage.getItem(key)),
}));

const defaultClientAccountsValue = {
    CR2001: {
        accepted_bch: 0,
        account_category: 'trading',
        account_type: 'standard',
        balance: 250,
        created_at: 1701783482,
        currency: 'USD',
        email: 'wallet+01@deriv.com',
        excluded_until: '',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        landing_company_shortcode: 'svg',
        linked_to: [],
        residence: 'id',
        token: 'a1-testR123',
    },
    CRW1001: {
        accepted_bch: 0,
        account_category: 'wallet',
        account_type: 'doughflow',
        balance: 9500,
        created_at: 1701783482,
        currency: 'USD',
        email: 'wallet+01@deriv.com',
        excluded_until: '',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        landing_company_shortcode: 'svg',
        linked_to: [
            {
                loginid: 'CR2001',
                platform: 'dtrade',
            },
        ],
        residence: 'id',
        token: 'a1-testF432',
    },
    CRW1002: {
        accepted_bch: 0,
        account_category: 'wallet',
        account_type: 'crypto',
        balance: 6,
        created_at: 1701783482,
        currency: 'BTC',
        email: 'wallet+01@deriv.com',
        excluded_until: '',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        landing_company_shortcode: 'svg',
        linked_to: [],
        residence: 'id',
        token: 'a1-testQY723',
    },
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(() => ({
        data: {
            account_category: 'wallet',
            account_type: 'crypto',
            created_at: 1701783482,
            excluded_until: '',
            is_disabled: false,
            is_virtual: false,
            landing_company_name: 'svg',
            landing_company_shortcode: 'svg',
            linked_to: [],
            loginid: 'CRW1002',
        },
    })),
    useAuthorize: jest.fn(),
    useMutation: jest.fn(() => ({
        mutateAsync: jest.fn(() => ({
            account_list: [
                {
                    account_category: 'wallet',
                    account_type: 'crypto',
                    currency: 'ETH',
                    display_balance: '0.00000000 ETH',
                    excluded_until: '',
                    is_disabled: 0,
                    is_virtual: 0,
                    landing_company: 'Deriv (SVG)',
                    landing_company_name: 'svg',
                    landing_company_shortcode: 'svg',
                    linked_to: [],
                    loginid: 'CRW1003',
                    oauth_token: 'a1-testTROLOLO',
                },
                {
                    account_category: 'trading',
                    account_type: 'standard',
                    currency: 'BTC',
                    display_balance: '0.00000000 BTC',
                    excluded_until: '',
                    is_disabled: 0,
                    is_virtual: 0,
                    landing_company: 'Deriv (SVG)',
                    landing_company_name: 'svg',
                    landing_company_shortcode: 'svg',
                    linked_to: [
                        {
                            loginid: 'CRW1002',
                            platform: 'dwallet',
                        },
                    ],
                    loginid: 'CR1002',
                    oauth_token: 'a1-testTRALALA',
                },
            ],
        })),
    })),
    useSettings: jest.fn(() => ({
        data: {
            citizen: 'id',
            email: 'wallet+01@deriv.com',
            residence: 'id',
        },
    })),
}));

const localStorageKey = 'client.accounts';

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('useSyncLocalStorageClientAccounts', () => {
    beforeEach(() => {
        mockLocalStorageBeforeEachTest();
        global.localStorage.clear();
        global.localStorage.setItem(localStorageKey, JSON.stringify(defaultClientAccountsValue));
    });

    afterEach(() => {
        restoreLocalStorageAfterEachTest();
    });

    it('Should correctly put data in localStorage for new WALLET account', async () => {
        const { result } = renderHook(() => useSyncLocalStorageClientAccounts(), { wrapper });
        expect(result.current.addWalletAccountToLocalStorage).toBeDefined();

        await result.current.addWalletAccountToLocalStorage({
            client_id: 'CRW1003',
            currency: 'ETH',
            display_balance: '0.00000000 ETH',
            landing_company: 'Deriv (SVG)',
            landing_company_shortcode: 'svg',
            oauth_token: 'a1-testTROLOLO',
        });

        const localStorageContent = JSON.parse(global.localStorage.getItem(localStorageKey) ?? '{}');

        expect(localStorageContent).toMatchObject({
            ...defaultClientAccountsValue,
            CRW1003: {
                accepted_bch: 0,
                account_category: 'wallet',
                account_type: 'crypto',
                balance: 0,
                currency: 'ETH',
                email: 'wallet+01@deriv.com',
                excluded_until: '',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_name: 'svg',
                landing_company_shortcode: 'svg',
                linked_to: [],
                residence: 'id',
                token: 'a1-testTROLOLO',
            },
        });
    });

    it('Should correctly put data in localStorage for new TRADING account', async () => {
        const { result } = renderHook(() => useSyncLocalStorageClientAccounts(), { wrapper });
        expect(result.current.addTradingAccountToLocalStorage).toBeDefined();

        await result.current.addTradingAccountToLocalStorage(
            {
                client_id: 'CR1002',
                currency: 'BTC',
                landing_company: 'Deriv (SVG)',
                landing_company_shortcode: 'svg',
                oauth_token: 'a1-testTRALALA',
            },
            false
        );

        const localStorageData = JSON.parse(global.localStorage.getItem(localStorageKey) ?? '{}');

        expect(localStorageData).toMatchObject({
            ...defaultClientAccountsValue,
            CR1002: {
                accepted_bch: 0,
                account_category: 'trading',
                account_type: 'standard',
                balance: 0,
                currency: 'BTC',
                email: 'wallet+01@deriv.com',
                excluded_until: '',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_name: 'svg',
                landing_company_shortcode: 'svg',
                linked_to: [
                    {
                        loginid: 'CRW1002',
                        platform: 'dwallet',
                    },
                ],
                residence: 'id',
                token: 'a1-testTRALALA',
            },
            CRW1002: {
                ...defaultClientAccountsValue.CRW1002,
                linked_to: [
                    {
                        loginid: 'CR1002',
                        platform: 'dtrade',
                    },
                ],
            },
        });
    });
});
