import React from 'react';
import { render, screen } from '@testing-library/react';
import StopLoss from '../stop-loss';

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
    default: jest.fn(({ label, modal_body_content, value, type, validation_params }) => (
        <div>
            <span>Risk Management Item Mock</span>
            <span>{label}</span>
            <span>{modal_body_content}</span>
            <span>{value}</span>
            <span>{type}</span>
            <span>{validation_params.stop_loss.min}</span>
            <span>{validation_params.stop_loss.max}</span>
        </div>
    )),
}));

describe('StopLoss component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('passes correct validation_params prop to RiskManagementItem component', () => {
        const validation_params = {
            stop_loss: {
                min: 1,
                max: 50,
            },
        };

        render(<StopLoss validation_params={validation_params} />);

        expect(screen.getByText('Risk Management Item Mock')).toBeInTheDocument();
        expect(screen.getByText('Stop loss')).toBeInTheDocument();
        expect(
            screen.getByText(
                'When your loss reaches or exceeds the set amount, your trade will be closed automatically.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });
});
