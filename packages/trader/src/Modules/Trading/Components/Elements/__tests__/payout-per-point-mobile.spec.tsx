import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayoutPerPointMobile from '../payout-per-point-mobile';
import { mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';

const mocked_root_store = {
    modules: {
        trade: {
            currency: 'EUR',
            proposal_info: {
                TURBOSLONG: { obj_contract_basis: { text: 'Payout per point', value: 10 }, message: 'test' },
            },
            contract_type: 'turboslong',
            vanilla_trade_type: 'VANILLALONGCALL',
        },
    },
};

describe('<PayoutPerPointMobile/>', () => {
    beforeEach(() => {
        render(
            <TraderProviders store={mockStore(mocked_root_store)}>
                <PayoutPerPointMobile />
            </TraderProviders>
        );
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
