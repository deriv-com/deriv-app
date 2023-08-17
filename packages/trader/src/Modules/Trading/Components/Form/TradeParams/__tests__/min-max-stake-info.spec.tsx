import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MinMaxStakeInfo from '../min-max-stake-info';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';

const mocked_root_store = {
    modules: {
        trade: {
            currency: 'USD',
            contract_type: 'turboslong',
            stake_boundary: {
                TURBOSLONG: {
                    min_stake: 0,
                    max_stake: 100,
                },
            },
        },
    },
};

describe('<MinMaxStakeInfo/>', () => {
    const mock_props = {
        className: 'trade-container__stake-field',
    };

    it('should be rendered correctly with both Min. stake and Max. stake', () => {
        render(
            <TraderProviders store={mockStore(mocked_root_store)}>
                <MinMaxStakeInfo {...mock_props} />
            </TraderProviders>
        );

        [screen.getByText('Min. stake'), screen.getByText('Max. stake')].forEach(stake_text => {
            expect(stake_text).toBeInTheDocument();
        });
    });
});
