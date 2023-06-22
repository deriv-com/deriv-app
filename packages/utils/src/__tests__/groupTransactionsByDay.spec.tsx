import groupTransactionsByDay from '../groupTransactionsByDay';
import { Statement } from '@deriv/api-types';

describe('groupTransactionsByDay', () => {
    it('should group transactions by day', () => {
        const transactions: Statement['transactions'] = [
            {
                transaction_time: new Date('08 Jun 2023').getTime() / 1000,
            },
            {
                transaction_time: new Date('10 Jun 2023').getTime() / 1000,
            },
            {
                transaction_time: new Date('12 Jun 2023').getTime() / 1000,
            },
            {
                transaction_time: new Date('08 Jun 2023').getTime() / 1000,
            },
            {
                transaction_time: new Date('10 Jun 2023').getTime() / 1000,
            },
            {
                transaction_time: new Date('12 Jun 2023').getTime() / 1000,
            },
        ];

        const groupped_transactions = groupTransactionsByDay(transactions);

        expect(transactions.length).toBe(6);
        expect(Object.keys(groupped_transactions).length).toBe(3);
        expect(Object.keys(groupped_transactions)).toStrictEqual(['08 Jun 2023', '10 Jun 2023', '12 Jun 2023']);
    });
});
