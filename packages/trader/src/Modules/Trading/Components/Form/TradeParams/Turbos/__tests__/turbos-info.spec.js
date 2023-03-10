import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TurbosInfo from '../turbos-info';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('Turbos Stake information', () => {
    const mock_props = {
        currency: 'USD',
        has_stop_loss: true,
        max_stake: 0,
        min_stake: 100,
    };

    it('max_stake should not be rendered if has_stop_loss is equal to true and min_stake should be rendered in any case', () => {
        const { rerender } = render(<TurbosInfo className='trade-container__turbos-trade-info' {...mock_props} />);

        expect(screen.queryByText('Max. stake')).not.toBeInTheDocument();
        expect(screen.getByText('Min. stake')).toBeInTheDocument();

        rerender(<TurbosInfo className='trade-container__turbos-trade-info' {...mock_props} has_stop_loss={false} />);

        [screen.getByText('Min. stake'), screen.getByText('Max. stake')].forEach(stake => {
            expect(stake).toBeInTheDocument();
        });
    });
});
