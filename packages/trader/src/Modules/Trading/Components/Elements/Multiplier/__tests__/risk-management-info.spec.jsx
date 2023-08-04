import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';
import RiskManagementInfo from '../risk-management-info';

const default_mock_store = {
    modules: {
        trade: {
            currency: '',
            stop_loss: 0,
            take_profit: 0,
            has_take_profit: false,
            has_stop_loss: false,
            cancellation_duration: '60m',
            cancellation_range_list: [],
            has_cancellation: false,
        },
    },
};

jest.mock('Modules/Trading/Containers/Multiplier/risk-management-dialog', () =>
    jest.fn(props => (
        <div style={{ display: props.is_open ? 'block' : 'none' }}>
            <span>RiskManagementDialog component</span>
            <button onClick={props.toggleDialog}>Toggle button</button>
            <button onClick={props.onClose}>Close button</button>
        </div>
    ))
);
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: () => true,
}));

describe('<RiskManagementInfo />', () => {
    const mockRiskManagementInfo = mocked_store => {
        return (
            <TraderProviders store={mocked_store}>
                <RiskManagementInfo />
            </TraderProviders>
        );
    };

    it('should render only risk managment block if has_take_profit, has_stop_loss, has_cancellation are equal to false', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementInfo(mock_root_store));

        expect(screen.getByText(/Risk management/i)).toBeInTheDocument();
        expect(screen.queryByText(/Take profit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stop loss/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Deal Cancellation/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/RiskManagementDialog/i)).not.toBeVisible();
    });
    it('should render has_take_profit, has_stop_loss, has_cancellation blocks if proper values are equal to true and not render risk managment block ', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules = {
            trade: {
                currency: 'USD',
                stop_loss: 10,
                take_profit: 30,
                has_take_profit: true,
                has_stop_loss: true,
                cancellation_duration: '60m',
                cancellation_range_list: [{ value: '60m', text: 'test text' }],
                has_cancellation: true,
            },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockRiskManagementInfo(mock_root_store));

        expect(screen.getByText(/Take profit/i)).toBeInTheDocument();
        expect(screen.getByText(/30.00 usd/i)).toBeInTheDocument();
        expect(screen.getByText(/Stop loss/i)).toBeInTheDocument();
        expect(screen.getByText(/10.00 usd/i)).toBeInTheDocument();
        expect(screen.getByText(/Deal Cancellation/i)).toBeInTheDocument();
        expect(screen.getByText(/test text/i)).toBeInTheDocument();
        expect(screen.queryByText(/Risk management/i)).not.toBeInTheDocument();
    });
    it('should render <RiskManagementDialog /> if user clicked on one of risk managment blocks', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementInfo(mock_root_store));

        const risk_managment_block = screen.getByText(/Risk management/i);
        userEvent.click(risk_managment_block);

        expect(screen.queryByText(/RiskManagementDialog/i)).toBeVisible();
    });
    it('should close <RiskManagementDialog /> if user clicked on close button', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementInfo(mock_root_store));

        const risk_managment_block = screen.getByText(/Risk management/i);
        userEvent.click(risk_managment_block);
        const close_botton = screen.getByText(/close/i);
        userEvent.click(close_botton);

        expect(screen.queryByText(/RiskManagementDialog/i)).not.toBeVisible();
    });
    it('should close <RiskManagementDialog /> if user clicked on toggle button', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementInfo(mock_root_store));

        const risk_managment_block = screen.getByText(/Risk management/i);
        userEvent.click(risk_managment_block);
        const close_botton = screen.getByText(/toggle/i);
        userEvent.click(close_botton);

        expect(screen.queryByText(/RiskManagementDialog/i)).not.toBeVisible();
    });
});
