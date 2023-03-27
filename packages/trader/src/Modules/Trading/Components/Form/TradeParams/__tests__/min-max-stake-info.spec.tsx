import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MinMaxStakeInfo from '../min-max-stake-info';
import { useStore } from '@deriv/stores';

const mocked_root_store: Partial<ReturnType<typeof useStore>> = {
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

jest.mock('@deriv/stores', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    observer: <T,>(Component: T) => Component,
    useStore: () => mocked_root_store,
}));

describe('<MinMaxStakeInfo/>', () => {
    const mock_props = {
        className: 'trade-container__stake-field',
    };

    it('should be rendered correctly with both Min. stake and Max. stake', () => {
        render(<MinMaxStakeInfo {...mock_props} />);

        [screen.getByText('Min. stake'), screen.getByText('Max. stake')].forEach(stake_text => {
            expect(stake_text).toBeInTheDocument();
        });
    });
});
