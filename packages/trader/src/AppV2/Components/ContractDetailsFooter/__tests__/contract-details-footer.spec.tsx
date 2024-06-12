import React from 'react';
import { render, screen } from '@testing-library/react';
userEvent;
import '@testing-library/jest-dom';
import { useStore } from '@deriv/stores';
import { getCardLabels, isValidToSell, isValidToCancel, isMultiplierContract } from '@deriv/shared';
import ContractDetailsFooter from '../contract-details-footer';
import { getRemainingTime } from 'AppV2/Utils/helper';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
}));
jest.mock('@deriv/shared', () => ({
    getCardLabels: jest.fn(),
    isValidToSell: jest.fn(),
    isValidToCancel: jest.fn(),
    isMultiplierContract: jest.fn(),
}));
jest.mock('AppV2/Utils/helper', () => ({
    getRemainingTime: jest.fn(),
}));

const mockContractInfo = {
    bid_price: 100,
    currency: 'USD',
    contract_id: 1,
    profit: 10,
    contract_type: 'non-multiplier',
};

describe('ContractDetailsFooter', () => {
    let mockStore: any;

    beforeEach(() => {
        mockStore = {
            contract_replay: {
                onClickCancel: jest.fn(),
                onClickSell: jest.fn(),
                is_sell_requested: false,
            },
            common: {
                server_time: new Date(),
            },
        };

        (useStore as jest.Mock).mockImplementation(() => mockStore);
        (getCardLabels as jest.Mock).mockImplementation(() => ({
            CLOSE: 'Close',
            CANCEL: 'Cancel',
            RESALE_NOT_OFFERED: 'Resale not offered',
        }));
        jest.clearAllMocks();
    });

    it('should render close button with bid price and currency for non-multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);

        render(<ContractDetailsFooter contract_info={mockContractInfo} />);

        const closeButton = screen.getByRole('button', { name: /close @ 100 usd/i });
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toBeEnabled();
    });

    it('should render resale not offered message for non-valid sell contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        render(<ContractDetailsFooter contract_info={mockContractInfo} />);

        const resaleMessage = screen.getByText(/resale not offered/i);
        expect(resaleMessage).toBeInTheDocument();
    });

    it('should render close and cancel buttons for multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        (getRemainingTime as jest.Mock).mockImplementation(() => '10:00');

        render(
            <ContractDetailsFooter
                contract_info={{
                    ...mockContractInfo,
                    contract_type: 'multiplier',
                    cancellation: { date_expiry: new Date() },
                }}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        const cancelButton = screen.getByRole('button', { name: /cancel 10:00/i });

        expect(closeButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('should call onClickSell when close button is clicked', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);

        render(<ContractDetailsFooter contract_info={mockContractInfo} />);

        const closeButton = screen.getByRole('button', { name: /close @ 100 usd/i });

        userEvent.click(closeButton);

        expect(mockStore.contract_replay.onClickSell).toHaveBeenCalledWith(1);
    });

    it('should disable close button for multiplier contract when profit is negative and valid to cancel', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);

        render(
            <ContractDetailsFooter contract_info={{ ...mockContractInfo, contract_type: 'multiplier', profit: -10 }} />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeDisabled();
    });

    it('should disable cancel button when profit is non-negative', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        (getRemainingTime as jest.Mock).mockImplementation(() => '10:00');

        render(
            <ContractDetailsFooter
                contract_info={{
                    ...mockContractInfo,
                    contract_type: 'multiplier',
                    profit: 0,
                    cancellation: { date_expiry: new Date() },
                }}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel 10:00/i });
        expect(cancelButton).toBeDisabled();
    });

    it('should not render cancel button if not valid to cancel', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => false);

        render(<ContractDetailsFooter contract_info={{ ...mockContractInfo, contract_type: 'multiplier' }} />);

        const cancelButton = screen.queryByRole('button', { name: /cancel/i });
        expect(cancelButton).not.toBeInTheDocument();
    });

    it('should not call onClickSell if not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        render(<ContractDetailsFooter contract_info={mockContractInfo} />);

        const closeButton = screen.queryByRole('button', { name: /close @ 100 usd/i });
        if (closeButton) {
            userEvent.click(closeButton);
        }

        expect(mockStore.contract_replay.onClickSell).not.toHaveBeenCalled();
    });

    it('should render correct button label for non-multiplier contract when not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        render(<ContractDetailsFooter contract_info={mockContractInfo} />);

        const resaleMessage = screen.getByRole('button', { name: /resale not offered/i });
        expect(resaleMessage).toBeInTheDocument();
    });
});
