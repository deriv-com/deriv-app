import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import RiskManagementInfo from '../risk-management-info';
import TraderProviders from '../../../../../../trader-providers';

const default_mock_store = {
    modules: {
        trade: {
            currency: 'USD',
            stop_loss: 0,
            take_profit: 0,
            has_take_profit: false,
            has_stop_loss: false,
            cancellation_duration: '60m',
            cancellation_range_list: [] as ReturnType<typeof useTraderStore>['cancellation_range_list'],
            has_cancellation: false,
        },
    },
};

const risk_management = 'Risk management';
const take_profit = 'Take profit';
const risk_management_dialog = 'Risk Management Dialog component';
const deal_cancellation = 'Deal Cancellation';
const stop_loss = 'Stop loss';

jest.mock('Modules/Trading/Containers/Multiplier/risk-management-dialog', () =>
    jest.fn(props =>
        props.is_open ? (
            <div>
                <span>{risk_management_dialog}</span>
                <button onClick={props.toggleDialog}>Toggle button</button>
                <button onClick={props.onClose}>Close button</button>
            </div>
        ) : null
    )
);

describe('<RiskManagementInfo />', () => {
    const mockRiskManagementInfo = (mocked_store = mockStore(default_mock_store)) => {
        return (
            <TraderProviders store={mocked_store}>
                <RiskManagementInfo />
            </TraderProviders>
        );
    };

    it('should render only risk management block if has_take_profit, has_stop_loss, has_cancellation are equal to false', () => {
        render(mockRiskManagementInfo());

        expect(screen.getByText(risk_management)).toBeInTheDocument();
        expect(screen.queryByText(take_profit)).not.toBeInTheDocument();
        expect(screen.queryByText(stop_loss)).not.toBeInTheDocument();
        expect(screen.queryByText(deal_cancellation)).not.toBeInTheDocument();
        expect(screen.queryByText(risk_management_dialog)).not.toBeInTheDocument();
    });
    it('should render has_take_profit, has_stop_loss, has_cancellation blocks if proper values are equal to true and not render risk management block ', () => {
        default_mock_store.modules = {
            trade: {
                currency: 'USD',
                stop_loss: 10,
                take_profit: 30,
                has_take_profit: true,
                has_stop_loss: true,
                cancellation_duration: '60m',
                cancellation_range_list: [{ value: '60m', text: 'mocked text' }],
                has_cancellation: true,
            },
        };
        render(mockRiskManagementInfo());

        expect(screen.getByText(take_profit)).toBeInTheDocument();
        expect(screen.getByText(/30.00 usd/i)).toBeInTheDocument();
        expect(screen.getByText(stop_loss)).toBeInTheDocument();
        expect(screen.getByText(/10.00 usd/i)).toBeInTheDocument();
        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(/mocked text/i)).toBeInTheDocument();
        expect(screen.queryByText(risk_management)).not.toBeInTheDocument();
    });
    it('should render <RiskManagementDialog /> if user clicked on one of the risk management blocks', () => {
        render(mockRiskManagementInfo());

        const risk_management_block = screen.getByText(take_profit);
        userEvent.click(risk_management_block);

        expect(screen.getByText(risk_management_dialog)).toBeInTheDocument();
    });
    it('should close <RiskManagementDialog /> if user clicked on close button', () => {
        render(mockRiskManagementInfo());

        const risk_management_block = screen.getByText(take_profit);
        userEvent.click(risk_management_block);
        const close_button = screen.getByText(/close/i);
        userEvent.click(close_button);

        expect(screen.queryByText(risk_management_dialog)).not.toBeInTheDocument();
    });
    it('should close <RiskManagementDialog /> if user clicked on toggle button', () => {
        render(mockRiskManagementInfo());

        const risk_management_block = screen.getByText(take_profit);
        userEvent.click(risk_management_block);
        const close_button = screen.getByText(/toggle/i);
        userEvent.click(close_button);

        expect(screen.queryByText(risk_management_dialog)).not.toBeInTheDocument();
    });
});
