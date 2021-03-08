import { expect } from 'chai';
import { formatStatementTransaction } from '../format-response';
import { toTitleCase } from '@deriv/shared';

describe('formatStatementTransaction', () => {
    const constant = {
        id: 1234,
        action_type: 'buy',
    };

    const currency = 'USD';
    let transaction = {
        action_type: constant.action_type,
        transaction_time: 123456789,
        transaction_id: constant.id,
        payout: 1000,
        amount: 2000,
        balance_after: 3000,
        longcode: 'test \n test \n test',
        contract_id: constant.id,
        app_id: constant.id,
        shortcode: 'shortcode',
        purchase_time: 123456789,
    };

    let expected_result = {
        action: toTitleCase(constant.action_type),
        action_type: constant.action_type,
        date: '29 Nov 1973 21:33:09',
        display_name: '',
        refid: constant.id,
        payout: '1,000.00',
        amount: '2,000.00',
        balance: '3,000.00',
        desc: 'test <br /> test <br /> test',
        id: constant.id,
        app_id: constant.id,
        shortcode: 'shortcode',
        purchase_time: 123456789,
        transaction_time: 123456789,
    };

    it('should return an object with values of object passed as argument', () => {
        expect(formatStatementTransaction(transaction, currency)).to.eql(expected_result);
    });

    it('should return payout, amount and balance as -', () => {
        transaction.payout = NaN;
        transaction.amount = NaN;
        transaction.balance_after = NaN;

        expected_result.payout = '-';
        expected_result.amount = '-';
        expected_result.balance = '-';

        expect(formatStatementTransaction(transaction, currency)).to.eql(expected_result);
    });
});
