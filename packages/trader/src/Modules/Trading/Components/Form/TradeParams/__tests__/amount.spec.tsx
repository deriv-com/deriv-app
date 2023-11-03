import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { useTraderStore } from 'Stores/useTraderStores';
import TraderProviders from '../../../../../../trader-providers';
import Amount from '../amount';

const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
            basis: 'stake',
            basis_list: [{ text: 'Stake', value: 'stake' }],
            contract_start_type: 'spot',
            contract_type: 'turboslong',
            contract_types_list: {} as ReturnType<typeof useTraderStore>['contract_types_list'],
            duration_unit: 'm',
            expiry_type: 'duration',
            is_accumulator: false,
            is_equal: false,
            is_multiplier: false,
            is_turbos: true,
            is_vanilla: false,
            has_equals_only: false,
            has_open_accu_contract: false,
            stake_boundary: { TURBOSLONG: { min_stake: 1, max_stake: 10000 } } as ReturnType<
                typeof useTraderStore
            >['stake_boundary'],
            onChange: jest.fn(),
            validation_errors: {} as ReturnType<typeof useTraderStore>['validation_errors'],
        },
    },
};

describe('<Amount />', () => {
    const mockAmount = (mocked_store: TCoreStores, mocked_props?: React.ComponentProps<typeof Amount>) => {
        return (
            <TraderProviders store={mocked_store}>
                <Amount {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render specific content if is_minimized === true', () => {
        render(mockAmount(mockStore(default_mock_store), { is_minimized: true }));

        expect(screen.getByText('Stake')).toBeInTheDocument();
        expect(screen.getByText('10.00')).toBeInTheDocument();
    });
    it('should render', () => {
        render(mockAmount(mockStore(default_mock_store)));

        // screen.debug();
        // expect(screen.getByText('Stake')).toBeInTheDocument();
        // expect(screen.getByText('10.00')).toBeInTheDocument();
    });
});
