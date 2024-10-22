import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import RiskManagement from '../risk-management';

const risk_management = 'Risk Management';

describe('RiskManagement', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}).modules.trade,
                        currency: 'USD',
                    },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockRiskManagement = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <RiskManagement is_minimized />
                </ModulesProvider>
            </TraderProviders>
        );

    it('renders Risk Management trade param with correct value', () => {
        mockRiskManagement();

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('-');
    });

    it('renders Risk Management trade param with correct value for active DC', () => {
        default_mock_store.modules.trade.has_cancellation = true;
        default_mock_store.modules.trade.cancellation_duration = '30m';

        mockRiskManagement();

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('DC: 30 minutes');
    });

    it('renders Risk Management trade param with correct value for both active TP&SL', () => {
        default_mock_store.modules.trade.has_take_profit = true;
        default_mock_store.modules.trade.has_stop_loss = true;
        default_mock_store.modules.trade.take_profit = '5';
        default_mock_store.modules.trade.stop_loss = '1';

        mockRiskManagement();

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('TP: 5 USD / SL: 1 USD');
    });

    it('renders Risk Management trade param with correct value for active TP', () => {
        default_mock_store.modules.trade.has_take_profit = true;
        default_mock_store.modules.trade.take_profit = '10';

        mockRiskManagement();

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('TP: 10 USD');
    });

    it('renders Risk Management trade param with correct value for active SL', () => {
        default_mock_store.modules.trade.has_stop_loss = true;
        default_mock_store.modules.trade.stop_loss = '2';

        mockRiskManagement();

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('SL: 2 USD');
    });

    it('disables trade param if is_market_closed === true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        mockRiskManagement();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
