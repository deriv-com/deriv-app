import { useFetch } from '@deriv/api';
import { Statement } from '@deriv/api-types';
import { useStore } from '@deriv/stores';

const useWalletStatement = (action_type: '' | 'deposit' | 'withdrawal' | 'reset_balance' | 'transfer') => {
    const {
        client: { loginid },
        traders_hub: { is_demo },
    } = useStore();

    // TODO remove mock
    const mock_transactions = is_demo
        ? [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'standard',
                  },
                  app_id: {},
                  balance_after: 9995,
                  transaction_id: 17494415484,
                  transaction_time: 1685942139,
              },
              {
                  action_type: 'reset_balance',
                  amount: 350,
                  balance_after: 10000,
                  transaction_id: 13693003421,
                  transaction_time: 1685942138,
              },
              {
                  action_type: 'transfer',
                  amount: 200,
                  from: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'standard',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                  },
                  balance_after: 9650,
                  transaction_id: 17494415483,
                  transaction_time: 1685855740,
              },
              {
                  action_type: 'transfer',
                  amount: 550,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'standard',
                  },
                  app_id: {},
                  balance_after: 9450,
                  transaction_id: 17494415482,
                  transaction_time: 1685855739,
              },
              {
                  action_type: 'initial_fund',
                  amount: 10000,
                  balance_after: 10000,
                  transaction_id: 13693011401,
                  transaction_time: 1685855738,
              },
          ]
        : [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'standard',
                  },
                  balance_after: 0,
                  transaction_id: 17494117541,
                  transaction_time: 1685942138,
              },
              {
                  action_type: 'transfer',
                  amount: 20,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                      account_type: 'crypto',
                  },
                  balance_after: 5,
                  transaction_id: 17494415489,
                  transaction_time: 1685942137,
              },
              {
                  action_type: 'deposit',
                  amount: 25,
                  balance_after: 25,
                  transaction_id: 17494415481,
                  transaction_time: 1685942136,
              },
              {
                  action_type: 'withdrawal',
                  amount: 750,
                  balance_after: 0,
                  transaction_id: 17494415480,
                  transaction_time: 1685942135,
              },
              {
                  action_type: 'transfer',
                  amount: 100,
                  from: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'standard',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  balance_after: 750,
                  transaction_id: 17494415479,
                  transaction_time: 1685855738,
              },
              {
                  action_type: 'transfer',
                  amount: 200,
                  from: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                      account_type: 'crypto',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  balance_after: 650,
                  transaction_id: 17494117541,
                  transaction_time: 1685855737,
              },
              {
                  action_type: 'transfer',
                  amount: 550,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                      account_type: 'crypto',
                  },
                  balance_after: 450,
                  transaction_id: 17494117540,
                  transaction_time: 1685855736,
              },
              {
                  action_type: 'deposit',
                  amount: 1000,
                  balance_after: 1000,
                  transaction_id: 17494117539,
                  transaction_time: 1685769338,
              },
          ];

    // @ts-expect-error reset_balance is not supported in the API yet
    const { data } = useFetch('statement', {
        options: { keepPreviousData: true },
        ...(!!action_type && {
            payload: {
                action_type,
            },
        }),
    });

    // return { data };

    return {
        data: {
            statement: {
                transactions: (mock_transactions as Required<Statement>['transactions']).filter(
                    el => !action_type || el.action_type === action_type
                ),
            },
        },
        isLoading: false,
        isSuccess: true,
    };
};

export default useWalletStatement;
