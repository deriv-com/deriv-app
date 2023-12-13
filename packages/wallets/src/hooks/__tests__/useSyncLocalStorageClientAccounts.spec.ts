import { renderHook } from '@testing-library/react-hooks';
// import { renderHook } from '@testing-library/react';
import useSyncLocalStorageClientAccounts from '../useSyncLocalStorageClientAccounts';

jest.mock('usehooks-ts', () => ({
    ...jest.requireActual('usehooks-ts'),
    // useLocalStorage: jest.fn((key: string) => {
    //     return [global.localStorage.getItem(key), global.localStorage.setItem];
    // }),
    // useReadLocalStorage: jest.fn((key: string) => global.localStorage.getItem(key)),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
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
    useSettings: jest.fn(() => ({
        data: {
            citizen: 'id',
            email: 'wallet+01@deriv.com',
            residence: 'id',
        },
    })),
}));

/*

const addWalletAccountToLocalStorage = useCallback(
        (newAccount: TNewWalletAccount) => {
            if (newAccount && data) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: data.account_category,
                    account_type: data.account_type,
                    balance: 0,
                    created_at: data.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: data.excluded_until,
                    is_disabled: data.is_disabled,
                    is_virtual: data.is_virtual,
                    landing_company_name: data.landing_company_name,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: data.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = { ...clientAccounts, [newAccount.client_id]: dataToStore };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [data, setLocalStorageClientAccounts, settingsData]
    );

    const addTradingAccountToLocalStorage = useCallback(
        (newAccount: TNewTradingAccount) => {
            if (newAccount && data) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: 'trading',
                    account_type: 'standard',
                    balance: 0,
                    created_at: data.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: data.excluded_until,
                    is_disabled: data.is_disabled,
                    is_virtual: data.is_virtual,
                    landing_company_name: newAccount.landing_company_shortcode,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: [{ loginid: data.loginid, platform: 'dwallet' }],
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = {
                    ...clientAccounts,
                    [newAccount.client_id]: dataToStore,
                    [data.loginid]: {
                        ...clientAccounts[data.loginid],
                        linked_to: [{ loginid: newAccount.client_id, platform: 'dtrade' }],
                    },
                };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [data, setLocalStorageClientAccounts, settingsData]
    );

*/

describe('useSyncLocalStorageClientAccounts', () => {
    // addTradingAccountToLocalStorage, addWalletAccountToLocalStorage

    const defaultValue = {
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
            linked_to: [
                {
                    loginid: 'CRW1001',
                    platform: 'dwallet',
                },
            ],
            residence: 'id',
            session_start: 1702372503,
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
            session_start: 1702362095,
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
            session_start: 1702362095,
            token: 'a1-testQY723',
        },
    };

    beforeEach(() => {
        global.localStorage.clear();
        global.localStorage.setItem('client.accounts', JSON.stringify(defaultValue));
    });

    it('should correctly put data in localStorage for new trading account', () => {
        const { result } = renderHook(() => useSyncLocalStorageClientAccounts());
        expect(result.current.addTradingAccountToLocalStorage).toBeDefined();

        result.current.addTradingAccountToLocalStorage({
            client_id: 'CR1002',
            currency: 'BTC',
            landing_company: 'svg',
            oauth_token: 'a1-testTRALALA',
        });

        expect(result.current.addTradingAccountToLocalStorage).toBeCalled();

        expect(JSON.parse(global.localStorage.getItem('client.accounts') ?? '{}')).toMatchObject({
            ...defaultValue,
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
                session_start: 1702362095,
                token: 'a1-testTRALALA',
            },
        });

        // expect(result.current.isMobile).toBe(false);
        // expect(result.current.isTablet).toBe(false);
    });

    // it('should correctly identify a mobile device', () => {
    //     mockWindowSize.mockReturnValue({ width: 767 });
    //     const { result } = renderHook(() => useDevice());
    //     expect(result.current.isMobile).toBe(true);
    //     expect(result.current.isDesktop).toBe(false);
    //     expect(result.current.isTablet).toBe(false);
    // });

    // it('should correctly identify a tablet device', () => {
    //     mockWindowSize.mockReturnValue({ width: 768 });
    //     const { result } = renderHook(() => useDevice());
    //     expect(result.current.isTablet).toBe(true);
    //     expect(result.current.isDesktop).toBe(false);
    //     expect(result.current.isMobile).toBe(false);
    // });
});
