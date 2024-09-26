import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import TakeProfitAndStopLossContainer from '../take-profit-and-stop-loss-container';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        forget: jest.fn(),
    },
}));

describe('TakeProfitAndStopLossContainer', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    ...mockStore({}).modules.trade,
                    currency: 'USD',
                    validation_params: {
                        TURBOSLONG: { take_profit: { min: '0.1', max: '100' }, stop_loss: { min: '0.1', max: '10' } },
                    },
                    validation_errors: {},
                    contract_type: 'turboslong',
                    trade_types: { TURBOSLONG: 'Turbos Long' },
                    trade_type_tab: 'TURBOSLONG',
                },
            },
        });
    });

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfitAndStopLossContainer = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfitAndStopLossContainer closeActionSheet={jest.fn()} />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render both inputs for TP&SL', () => {
        mockTakeProfitAndStopLossContainer();

        userEvent.click(screen.getByText('Save'));
        expect(screen.getByText('Take profit')).toBeInTheDocument();
        expect(screen.getByText('Stop loss')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should call onChangeMultiple if user clicked on Save button', () => {
        mockTakeProfitAndStopLossContainer();

        expect(default_mock_store.modules.trade.onChangeMultiple).not.toBeCalled();
        userEvent.click(screen.getByText('Save'));
        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalled();
    });
});
