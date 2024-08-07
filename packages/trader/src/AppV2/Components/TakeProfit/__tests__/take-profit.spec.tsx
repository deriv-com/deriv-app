import React from 'react';
import { render, screen } from '@testing-library/react';
import TakeProfit from '../take-profit';

jest.mock('AppV2/Hooks/useContractDetails', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        contract_info: {
            limit_order: {
                stop_loss: {
                    order_amount: 10,
                },
            },
            contract_type: 'MULTUP',
        },
    })),
}));

jest.mock('../../RiskManagementItem', () => ({
    __esModule: true,
    default: jest.fn(({ label, modal_body_content, value, type }) => (
        <div>
            <span>Risk Management Item Mock</span>
            <span>{label}</span>
            <span>{modal_body_content}</span>
            <span>{value}</span>
            <span>{type}</span>
        </div>
    )),
}));

describe('TakeProfit component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('passes correct props to RiskManagementItem component when take profit is visible', () => {
        render(<TakeProfit />);
        expect(screen.getByText('Risk Management Item Mock')).toBeInTheDocument();
        expect(screen.getByText('Take profit')).toBeInTheDocument();
        expect(
            screen.getByText(
                'When your profit reaches or exceeds the set amount, your trade will be closed automatically.'
            )
        ).toBeInTheDocument();
    });
});
