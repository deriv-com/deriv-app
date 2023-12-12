import { renderHook } from '@testing-library/react-hooks';
import useSyncLocalStorageClientAccounts from '../useSyncLocalStorageClientAccounts';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveAccount: jest.fn(() => ({
        data: 'test',
    })),
    useSettings: jest.fn(() => ({
        data: {
            citizen: 'id',
            email: 'wallet+01@deriv.com',
            residence: 'id',
        },
    })),
}));

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
            token: 'a1-r5rvR6I7eT4G3HpwV4ecW0Le8fBW1',
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
                // {
                //     loginid: 'CTR1000664',
                //     platform: 'ctrader',
                // },
                // {
                //     loginid: 'MTR80002253',
                //     platform: 'mt5',
                // },
            ],
            residence: 'id',
            session_start: 1702362095,
            token: 'a1-testQkDRQMz3oNEuwSIjNdQY8JCU',
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
            token: 'a1-testQkDRQMz3oNEuwSIjNdQY8JCU',
        },
    };

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('client.accounts', JSON.stringify(defaultValue));
    });

    it('should correctly put data in localStorage for new trading account', () => {
        const { result } = renderHook(() => useSyncLocalStorageClientAccounts());
        expect(result.current.addTradingAccountToLocalStorage).toBeDefined();
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
