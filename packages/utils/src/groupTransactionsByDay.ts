import groupBy from 'lodash.groupby';
import pickBy from 'lodash.pickby';
import moment from 'moment';
import { Statement } from '@deriv/api-types';

const groupTransactionsByDay = (transactions: Statement['transactions']) => {
    const grouped_transactions = pickBy(
        groupBy(transactions, transaction => {
            return transaction.transaction_time
                ? moment(transaction.transaction_time * 1000)
                      .startOf('day')
                      .format('DD MMM YYYY')
                : null;
        }),
        (value, key) => key !== null
    );

    return grouped_transactions;
};

export default groupTransactionsByDay;
