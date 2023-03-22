import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayoutPerPoint from '../payout-per-point';
import { useStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

const mocked_root_store: Partial<ReturnType<typeof useStore>> = {
    modules: {
        trade: {
            currency: 'EUR',
            proposal_info: {
                TURBOSLONG: { number_of_contracts: 10, message: 'test' },
            },
            contract_type: 'turboslong',
        },
    },
};

jest.mock('@deriv/stores', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    observer: <T,>(Component: T) => Component,
    useStore: () => mocked_root_store,
}));

describe('<PayoutPerPoint/>', () => {
    beforeEach(() => {
        render(<PayoutPerPoint />);
    });
    it('should render label name correctly', () => {
        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });
    it('should render amount correctly', () => {
        expect(screen.getByText(/10/i)).toBeInTheDocument();
    });
    it('should render currency correctly', () => {
        expect(screen.getByText(/EUR/i)).toBeInTheDocument();
    });
    it('should render tooltip text correctly', () => {
        userEvent.hover(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText(/test/i)).toBeInTheDocument();
    });
});
