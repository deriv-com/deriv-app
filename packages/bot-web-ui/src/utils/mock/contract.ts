import { TContractInfo } from 'Components/summary/summary-card.types';

export const mock_contract: TContractInfo = {
    transaction_ids: { buy: 123, sell: 6789 },
    underlying: 'EURUSD',
    entry_tick: 1.2345,
    exit_tick: 1.6789,
    entry_tick_time: '5pm',
    exit_tick_time: '6pm',
    date_start: 10,
    tick_count: 100,
    buy_price: 50,
    currency: 'USD',
    profit: 30,
    barrier: '3',
    is_completed: true,
    contract_type: 'CALL',
    shortcode: 'CALL_BARRIER',
};
