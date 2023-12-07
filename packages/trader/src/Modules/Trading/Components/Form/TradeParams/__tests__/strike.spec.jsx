import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { isMobile, isDesktop, CONTRACT_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';
import Strike from '../strike';

const default_mock_store = {
    modules: {
        trade: {
            barrier_1: '1',
            barrier_choices: ['16', '33', '40'],
            duration_unit: 'm',
            onChange: jest.fn(),
            validation_errors: {},
            expiry_type: 'endtime',
            expiry_date: null,
            vanilla_trade_type: CONTRACT_TYPES.VANILLA.CALL,
        },
    },
};
const mocked_strike_param_modal = 'Mocked Strike Param Modal Component';
const strike_price = 'Strike price';
const spot = 'Spot';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn().mockReturnValue(true),
    isDesktop: jest.fn().mockReturnValue(false),
}));
jest.mock('Modules/Trading/Containers/strike-param-modal', () => jest.fn(() => <div>{mocked_strike_param_modal}</div>));

describe('<Strike />', () => {
    const mockStrike = mocked_store => {
        return (
            <TraderProviders store={mocked_store}>
                <Strike />
            </TraderProviders>
        );
    };

    it('should render a proper children components if it is mobile', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockStrike(mock_root_store));

        expect(screen.getByText(spot)).toBeInTheDocument();
        expect(screen.getByText(strike_price)).toBeInTheDocument();
        expect(screen.getByText(mocked_strike_param_modal)).toBeInTheDocument();
    });
    it('should not render Spot components if it duration_unit is equal to "d" in mobile', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules = {
            trade: {
                barrier_1: '1',
                barrier_choices: ['16', '33', '40'],
                duration_unit: 'd',
                onChange: jest.fn(),
                validation_errors: {},
                expiry_type: 'endtime',
                expiry_date: null,
                vanilla_trade_type: CONTRACT_TYPES.VANILLA.CALL,
            },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockStrike(mock_root_store));

        expect(screen.queryByText(spot)).not.toBeInTheDocument();
        expect(screen.getByText(strike_price)).toBeInTheDocument();
        expect(screen.getByText(mocked_strike_param_modal)).toBeInTheDocument();
    });
    it('should render a proper fieldset if it is desktop', () => {
        isDesktop.mockReturnValueOnce(true);
        isMobile.mockReturnValueOnce(false);
        const mock_root_store = mockStore(default_mock_store);
        render(mockStrike(mock_root_store));

        expect(screen.getByText(strike_price)).toBeInTheDocument();
    });
});
