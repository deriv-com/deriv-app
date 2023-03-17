import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TurbosInfo from '../turbos-info';
import { useStore } from '@deriv/stores';

const mocked_root_store: Partial<ReturnType<typeof useStore>> = {
    modules: {
        trade: {
            currency: 'USD',
            max_stake: 0,
            min_stake: 100,
        },
    },
};

jest.mock('@deriv/stores', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    observer: <T,>(Component: T) => Component,
    useStore: () => mocked_root_store,
}));

describe('<TurbosInfo/>', () => {
    const mock_props = {
        className: 'trade-container__turbos-trade-info',
    };

    it('should be rendered correctly with both Min. stake and Max. stake', () => {
        render(<TurbosInfo {...mock_props} />);

        [screen.getByText('Min. stake'), screen.getByText('Max. stake')].forEach(stake_text => {
            expect(stake_text).toBeInTheDocument();
        });
    });
});
