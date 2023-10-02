import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MinMaxStakeInfo from '../min-max-stake-info';

describe('<MinMaxStakeInfo/>', () => {
    const mock_props = {
        className: 'trade-container__stake-field',
        currency: 'USD',
        min_stake: 0,
        max_stake: 100,
    };

    it('should be rendered correctly with both Min. stake and Max. stake', () => {
        render(<MinMaxStakeInfo {...mock_props} />);

        [screen.getByText('Min. stake'), screen.getByText('Max. stake')].forEach(stake_text => {
            expect(stake_text).toBeInTheDocument();
        });
    });
});
