import { Context } from '../../utils/mocks/mocks';

export default function mockGetLimits(context: Context) {
    if ('get_limits' in context.request && context.request.get_limits === 1) {
        context.response = {
            echo_req: {
                get_limits: 1,
                req_id: context.req_id,
            },
            get_limits: {
                account_balance: null,
                daily_cumulative_amount_transfers: {
                    dxtrade: {
                        allowed: 50000,
                        available: 50000,
                    },
                    enabled: 0,
                    internal: {
                        allowed: 100000,
                        available: 100000,
                    },
                    mt5: {
                        allowed: 200000,
                        available: 200000,
                    },
                },
                daily_transfers: {
                    ctrader: {
                        allowed: 10,
                        available: 10,
                    },
                    dxtrade: {
                        allowed: 10,
                        available: 10,
                    },
                    internal: {
                        allowed: 10,
                        available: 10,
                    },
                    mt5: {
                        allowed: 10,
                        available: 10,
                    },
                },
                lifetime_limit: 10000,
                market_specific: {
                    commodities: [
                        {
                            level: 'market',
                            name: 'Commodities',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                    ],
                    cryptocurrency: [
                        {
                            level: 'market',
                            name: 'Cryptocurrencies',
                            payout_limit: 100.0,
                            profile_name: 'extreme_risk',
                            turnover_limit: 1000.0,
                        },
                    ],
                    forex: [
                        {
                            level: 'submarket',
                            name: 'Minor Pairs',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                        {
                            level: 'submarket',
                            name: 'Major Pairs',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                        {
                            level: 'market',
                            name: 'Forex',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                    ],
                    indices: [
                        {
                            level: 'market',
                            name: 'Stock Indices',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                    ],
                    synthetic_index: [
                        {
                            level: 'submarket',
                            name: 'Forex Basket',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                        {
                            level: 'submarket',
                            name: 'Commodities Basket',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                        {
                            level: 'market',
                            name: 'Derived',
                            payout_limit: 50000,
                            profile_name: 'low_risk',
                            turnover_limit: 500000,
                        },
                    ],
                },
                num_of_days: 30,
                num_of_days_limit: 10000,
                open_positions: 100,
                payout: 50000,
                remainder: 10000,
                withdrawal_for_x_days_monetary: 0,
                withdrawal_since_inception_monetary: 0,
            },
            msg_type: 'get_limits',
            req_id: context.req_id,
        };
    }
}
