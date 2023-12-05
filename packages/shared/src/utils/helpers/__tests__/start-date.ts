import { ContractsFor } from '@deriv/api-types';
import { buildForwardStartingConfig } from '../start-date';

describe('start_date', () => {
    describe('buildForwardStartingConfig', () => {
        it('Returns empty object when forward_starting_options and forward_starting_dates are both empties', () => {
            const contract: ContractsFor['available'][number] = {
                barrier_category: 'euro_atm',
                barriers: 0,
                contract_category: 'callput',
                contract_category_display: 'Up/Down',
                contract_display: 'Higher',
                contract_type: 'CALL',
                exchange_name: 'FOREX',
                expiry_type: 'daily',
                market: 'forex',
                max_contract_duration: '365d',
                min_contract_duration: '1d',
                sentiment: 'up',
                start_type: 'spot',
                submarket: 'major_pairs',
                underlying_symbol: 'frxAUDJPY',
                forward_starting_options: undefined,
            };
            /* eslint-disable no-unused-expressions */
            expect(buildForwardStartingConfig(contract, [])).toHaveLength(0);
        });
    });
});
