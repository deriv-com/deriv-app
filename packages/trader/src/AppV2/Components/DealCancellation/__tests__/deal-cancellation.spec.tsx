import React from 'react';
import { render, screen } from '@testing-library/react';
import DealCancellation from '../deal-cancellation';
import { isValidToCancel, isOpen } from '@deriv/shared';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import useContractDetails from 'AppV2/Hooks/useContractDetails';

jest.mock('@deriv/shared', () => ({
    isValidToCancel: jest.fn(),
    isOpen: jest.fn(),
}));

jest.mock('AppV2/Utils/contract-details-config', () => ({
    getContractDetailsConfig: jest.fn(),
}));

jest.mock('AppV2/Hooks/useContractDetails', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../RiskManagementItem', () => {
    return jest.fn(props => {
        return (
            <div>
                <div>{props.label}</div>
                <div>{props.modal_body_content}</div>
                <div>{props.is_deal_cancellation}</div>
            </div>
        );
    });
});

describe('DealCancellation component', () => {
    const dealCancellation = 'Deal cancellation';

    const mockContractInfo = {
        contract_type: 'MULTIPLIER',
    };

    const mockContract = {
        validation_errors: [],
    };

    const mockUseContractDetails = {
        contract_info: mockContractInfo,
        contract: mockContract,
    };

    beforeEach(() => {
        (useContractDetails as jest.Mock).mockReturnValue(mockUseContractDetails);
    });

    it('renders the DealCancellation component when all conditions are met', () => {
        (isValidToCancel as jest.Mock).mockReturnValue(true);
        (isOpen as jest.Mock).mockReturnValue(true);
        (getContractDetailsConfig as jest.Mock).mockReturnValue({
            isDealCancellationVisible: true,
        });

        render(<DealCancellation />);

        expect(screen.getByText(dealCancellation)).toBeInTheDocument();
    });

    it('does not render the DealCancellation component when isValidToCancel is false', () => {
        (isValidToCancel as jest.Mock).mockReturnValue(false);
        (isOpen as jest.Mock).mockReturnValue(true);
        (getContractDetailsConfig as jest.Mock).mockReturnValue({
            isDealCancellationVisible: true,
        });

        render(<DealCancellation />);

        expect(screen.queryByText(dealCancellation)).not.toBeInTheDocument();
    });

    it('does not render the DealCancellation component when is_deal_cancellation_visible is false', () => {
        (isValidToCancel as jest.Mock).mockReturnValue(true);
        (isOpen as jest.Mock).mockReturnValue(true);
        (getContractDetailsConfig as jest.Mock).mockReturnValue({
            isDealCancellationVisible: false,
        });

        render(<DealCancellation />);

        expect(screen.queryByText(dealCancellation)).not.toBeInTheDocument();
    });

    it('does not render the DealCancellation component when isOpen is false', () => {
        (isValidToCancel as jest.Mock).mockReturnValue(true);
        (isOpen as jest.Mock).mockReturnValue(false);
        (getContractDetailsConfig as jest.Mock).mockReturnValue({
            isDealCancellationVisible: true,
        });

        render(<DealCancellation />);

        expect(screen.queryByText(dealCancellation)).not.toBeInTheDocument();
    });
});
