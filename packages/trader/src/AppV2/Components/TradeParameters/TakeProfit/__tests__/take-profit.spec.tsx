import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import TakeProfit from '../take-profit';

jest.mock('../../RiskManagement/take-profit-and-stop-loss-input', () =>
    jest.fn(() => <div>TakeProfitAndStopLossInput</div>)
);
jest.mock('AppV2/Components/TradeParamDefinition', () => jest.fn(() => <div>TradeParamDefinition</div>));

describe('TakeProfit', () => {
    let default_mock_store: ReturnType<typeof mockStore>, default_mock_prop: React.ComponentProps<typeof TakeProfit>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: { ...mockStore({}).modules.trade, currency: 'USD', has_take_profit: true, take_profit: '5' },
            },
        });
        default_mock_prop = { is_minimized: true, is_disabled: false };
    });

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfit = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfit {...default_mock_prop} />
                </ModulesProvider>
            </TraderProviders>
        );

    it('renders TP trade parameter with correct take profit from trade store', () => {
        mockTakeProfit();

        expect(screen.getByRole('textbox')).toHaveValue('5 USD');
        expect(screen.getByText('Take profit')).toBeInTheDocument();
    });

    it('renders TakeProfitAndStopLossInput and TradeParamDefinition when user clicks on TP input', () => {
        mockTakeProfit();

        userEvent.click(screen.getByText('Take profit'));

        expect(screen.getByText('TakeProfitAndStopLossInput')).toBeInTheDocument();
        expect(screen.getByText('TradeParamDefinition')).toBeInTheDocument();
    });

    it('disables trade param if is_disabled === true', () => {
        default_mock_prop.is_disabled = true;
        mockTakeProfit();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
