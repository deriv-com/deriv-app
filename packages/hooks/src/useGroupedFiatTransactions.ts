import _ from 'lodash';
import moment from 'moment';
import { Statement } from '@deriv/api-types';

const useGroupedFiatTransactions = (transactions: Statement['transactions']) => {
    const grouped_transactions = _.pickBy(
        _.groupBy(transactions, transaction => {
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

export default useGroupedFiatTransactions;
