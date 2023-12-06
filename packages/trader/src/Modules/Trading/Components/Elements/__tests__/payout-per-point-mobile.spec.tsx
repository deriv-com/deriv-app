import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayoutPerPointMobile from '../payout-per-point-mobile';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';

const mocked_root_store = {
    modules: {
        trade: {
            contract_type: TRADE_TYPES.TURBOS.LONG,
            currency: 'EUR',
            proposal_info: {
                [CONTRACT_TYPES.TURBOS.LONG]: {
                    obj_contract_basis: { text: 'Payout per point', value: 0.987654321 },
                    message: 'test',
                },
            },
        },
    },
};

describe('<PayoutPerPointMobile/>', () => {
    const mockPayoutPerPointMobile = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <PayoutPerPointMobile />
            </TraderProviders>
        );
    };
    it('should render label name correctly', () => {
        render(mockPayoutPerPointMobile(mockStore(mocked_root_store)));
        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });
    it('should render amount correctly', () => {
        render(mockPayoutPerPointMobile(mockStore(mocked_root_store)));
        expect(screen.getByText(/0.987654321/i)).toBeInTheDocument();
    });
    it('should render currency correctly', () => {
        render(mockPayoutPerPointMobile(mockStore(mocked_root_store)));
        expect(screen.getByText(/EUR/i)).toBeInTheDocument();
    });
    it('should render tooltip text for Turbos correctly', () => {
        render(mockPayoutPerPointMobile(mockStore(mocked_root_store)));
        userEvent.hover(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
        expect(screen.getByText(/This is the amount you’ll receive at expiry/i)).toBeInTheDocument();
    });
    it('should render tooltip text for Vanillas correctly', () => {
        render(
            mockPayoutPerPointMobile(
                mockStore({
                    modules: {
                        trade: {
                            contract_type: TRADE_TYPES.VANILLA.CALL,
                            currency: 'USD',
                            is_vanilla: true,
                            proposal_info: {
                                [CONTRACT_TYPES.VANILLA.CALL]: {
                                    obj_contract_basis: { text: 'Payout per point', value: 0.123456789 },
                                    message: 'test',
                                },
                            },
                        },
                    },
                })
            )
        );
        userEvent.hover(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
        expect(screen.getByText(/0.123456789/i)).toBeInTheDocument();
        expect(screen.getByText(/The payout at expiry is equal to the payout/i)).toBeInTheDocument();
    });
});
