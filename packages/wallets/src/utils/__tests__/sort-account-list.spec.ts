import { sortAccountList } from '../sort-account-list';

describe('sortAccountList', () => {
    it('sorts accounts by login property in ascending order', () => {
        const accounts = [{ login: 'zebra' }, { login: 'apple' }, { login: 'mango' }];
        const sortedAccounts = sortAccountList(accounts);
        expect(sortedAccounts).toEqual([{ login: 'apple' }, { login: 'mango' }, { login: 'zebra' }]);
    });

    it('handles accounts with identical login properties', () => {
        const accounts = [{ login: 'apple' }, { login: 'apple' }];
        const sortedAccounts = sortAccountList(accounts);
        expect(sortedAccounts).toEqual([{ login: 'apple' }, { login: 'apple' }]);
    });
});
