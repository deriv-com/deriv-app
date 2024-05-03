import getAccountListWithAuthToken from '../getAccountListWithAuthToken';
import { AuthorizeResponse } from '@deriv/api-types';

describe('getAccountListWithAuthToken', () => {
    let accounts: NonNullable<AuthorizeResponse['authorize']>['account_list'];

    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            'client.accounts',
            JSON.stringify({
                CRW1121: {
                    account_category: 'wallet',
                    account_type: 'doughflow',
                    broker: 'CRW',
                    created_at: 1714662434,
                    currency: 'USD',
                    currency_type: 'fiat',
                    is_disabled: 0,
                    is_virtual: 0,
                    landing_company_shortcode: 'svg',
                    linked_to: [],
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    email: 'ge4@binary.com',
                    session_start: 1714715763,
                    excluded_until: '',
                    landing_company_name: 'svg',
                    balance: 10000,
                    accepted_bch: 0,
                    residence: 'aq',
                },
                CRW1122: {
                    account_category: 'wallet',
                    account_type: 'crypto',
                    broker: 'CRW',
                    created_at: 1714662788,
                    currency: 'BTC',
                    currency_type: 'crypto',
                    is_disabled: 0,
                    is_virtual: 0,
                    landing_company_shortcode: 'svg',
                    linked_to: [],
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    excluded_until: '',
                    landing_company_name: 'svg',
                    balance: 0,
                },
                VRW1069: {
                    account_category: 'wallet',
                    account_type: 'virtual',
                    broker: 'VRW',
                    created_at: 1714662434,
                    currency: 'USD',
                    currency_type: 'fiat',
                    is_disabled: 0,
                    is_virtual: 1,
                    landing_company_shortcode: 'virtual',
                    linked_to: [],
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    excluded_until: '',
                    landing_company_name: 'virtual',
                    balance: 10000,
                },
            })
        );

        accounts = [
            {
                account_category: 'wallet',
                account_type: 'doughflow',
                broker: 'CRW',
                created_at: 1714662434,
                currency: 'USD',
                currency_type: 'fiat',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_name: 'svg',
                linked_to: [],
                loginid: 'CRW1121',
            },
            {
                account_category: 'wallet',
                account_type: 'crypto',
                broker: 'CRW',
                created_at: 1714662788,
                currency: 'BTC',
                currency_type: 'crypto',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_name: 'svg',
                linked_to: [],
                loginid: 'CRW1122',
            },
            {
                account_category: 'wallet',
                account_type: 'virtual',
                broker: 'VRW',
                created_at: 1714662434,
                currency: 'USD',
                currency_type: 'fiat',
                is_disabled: 0,
                is_virtual: 1,
                landing_company_name: 'virtual',
                linked_to: [],
                loginid: 'VRW1069',
            },
        ];
    });

    it('should return all accounts that have a token', () => {
        const accountsWithToken = getAccountListWithAuthToken(accounts);

        expect(accountsWithToken?.length).toBe(accounts?.length);
    });

    it('should return undefined if no accounts provided', () => {
        const accountsWithToken = getAccountListWithAuthToken();

        expect(accountsWithToken).toBe(undefined);
    });

    it('should return and empty array if it was provided as accounts', () => {
        const accountsWithToken = getAccountListWithAuthToken([]);

        expect(accountsWithToken).toBeInstanceOf(Array);
        expect(accountsWithToken?.length).toBe(0);
    });

    it('should return proper list of accounts with token when we are adding new account', () => {
        accounts?.push({
            account_category: 'wallet',
            account_type: 'crypto',
            broker: 'CRW',
            created_at: 1714716793,
            currency: 'ETH',
            currency_type: 'crypto',
            is_disabled: 0,
            is_virtual: 0,
            landing_company_name: 'svg',
            linked_to: [],
            loginid: 'CRW1170',
        });

        const accountsWithToken = getAccountListWithAuthToken(accounts);

        expect(accounts?.length).toBe(4);
        expect(accountsWithToken?.length).toBe(3);
    });
});
