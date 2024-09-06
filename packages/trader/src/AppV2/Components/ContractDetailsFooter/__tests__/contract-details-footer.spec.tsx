import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isValidToSell, isValidToCancel, isMultiplierContract } from '@deriv/shared';
import ContractDetailsFooter from '../contract-details-footer';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isValidToSell: jest.fn(),
    isValidToCancel: jest.fn(),
    isMultiplierContract: jest.fn(),
}));

const mockContractInfo = {
    bid_price: 100,
    currency: 'USD',
    contract_id: 1,
    profit: 10,
    contract_type: 'non-multiplier',
};

describe('ContractDetailsFooter', () => {
    const mock_store = mockStore({
        contract_replay: {
            onClickCancel: jest.fn(),
            onClickSell: jest.fn(),
            is_sell_requested: false,
        },
        common: {
            server_time: new Date(),
        },
    });

    const renderFooter = () => {
        render(
            <StoreProvider store={mock_store}>
                <ContractDetailsFooter contract_info={mockContractInfo} />
            </StoreProvider>
        );
    };

    it('should render close button with bid price and currency for non-multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        renderFooter();
        const closeButton = screen.getByRole('button', { name: /close 100.00 usd/i });
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toBeEnabled();
    });

    it('should render resale not offered message for non-valid sell contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);
        renderFooter();
        const resaleMessage = screen.getByText(/resale not offered/i);
        expect(resaleMessage).toBeInTheDocument();
    });

    it('should render close and cancel buttons for multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        renderFooter();

        const closeButton = screen.getByRole('button', { name: /close/i });
        const cancelButton = screen.getByRole('button', { name: /cancel/i });

        expect(closeButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('should call onClickSell when close button is clicked', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);

        renderFooter();
        const closeButton = screen.getByRole('button', { name: /close 100.00 usd/i });

        userEvent.click(closeButton);

        expect(mock_store.contract_replay.onClickSell).toHaveBeenCalledWith(1);
    });

    it('should not call onClickSell if not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        renderFooter();

        const closeButton = screen.queryByRole('button');
        expect(closeButton).toBeDisabled();
    });

    it('should disable cancel button when profit is non-negative', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        mock_store.contract_replay.contract_store.contract_info.profit = 0;
        renderFooter();
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeDisabled();
    });

    it('should not render cancel button if not valid to cancel', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => false);
        mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        renderFooter();

        const cancelButton = screen.queryByRole('button', { name: /cancel/i });
        expect(cancelButton).not.toBeInTheDocument();
    });

    it('should render correct button label for non-multiplier contract when not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        renderFooter();

        const resaleMessage = screen.getByRole('button', { name: /resale not offered/i });
        expect(resaleMessage).toBeInTheDocument();
    });
});
