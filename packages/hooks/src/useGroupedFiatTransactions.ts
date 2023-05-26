import _ from 'lodash';
import moment from 'moment';

const useGroupedFiatTransactions = () => {
    // TODO: don't hardcode, replace with ... = useFetch('statement');
    const transactions = [
        {
            action_type: 'initial_fund',
            amount: 42,
            app_id: 1,
            balance_after: 42,
            contract_id: 6842558021,
            longcode: 'Win payout if AUD/JPY is strictly higher than entry spot at 1 minute after contract start time.',
            payout: 1,
            reference_id: {},
            shortcode: 'CALL_FRXAUDJPY_1_1470637406_1470637466_S0P_0',
            transaction_id: 13693011401,
            transaction_time: 1470637406,
        },
        {
            action_type: 'reset_balance',
            amount: -42,
            app_id: 2,
            balance_after: 0,
            contract_id: 6842548881,
            longcode: 'Win payout if AUD/JPY is strictly lower than entry spot at 1 minute after contract start time.',
            payout: 1,
            purchase_time: 1470637295,
            reference_id: 13692993001,
            shortcode: 'PUT_FRXAUDJPY_1_1470637295_1470637355_S0P_0',
            transaction_id: 13693003421,
            transaction_time: 1470637357,
        },
        {
            action_type: 'deposit',
            amount: 2,
            app_id: {},
            balance_after: 44.24,
            contract_id: {},
            longcode: 'Payment from Binary Services Ltd Apr 2017',
            payout: {},
            reference_id: {},
            shortcode: {},
            transaction_id: 17494117541,
            transaction_time: 1494295963,
        },
        {
            action_type: 'withdrawal',
            amount: -2.24,
            app_id: {},
            balance_after: 0,
            contract_id: {},
            longcode: 'Account closed. Please contact customer support for assistance.',
            payout: {},
            reference_id: {},
            shortcode: {},
            transaction_id: 17494415481,
            transaction_time: 1494297523,
        },
        {
            action_type: 'transfer',
            amount: 2.24,
            from: {
                loginid: '',
                type: 'trading',
            },
            to: {
                loginid: '',
                type: 'wallet',
            },
            app_id: {},
            balance_after: 0,
            contract_id: {},
            longcode: 'Transfer from <> to <>. Includes fees',
            payout: {},
            reference_id: {},
            shortcode: {},
            transaction_id: 17494415481,
            transaction_time: 1494297523,
        },
    ];

    const grouped_transactions = _.groupBy(transactions, transaction =>
        moment(transaction.transaction_time).startOf('day').format('DD MMM YYYY')
    );

    return grouped_transactions;
};

export default useGroupedFiatTransactions;
