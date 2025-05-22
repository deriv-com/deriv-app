import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isValidToSell, isValidToCancel, isMultiplierContract, mockContractInfo } from '@deriv/shared';
import ContractDetailsFooter from '../contract-details-footer';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isValidToSell: jest.fn(),
    isValidToCancel: jest.fn(),
    isMultiplierContract: jest.fn(),
}));

describe('ContractDetailsFooter', () => {
    let default_mock_store: ReturnType<typeof mockStore>,
        default_mock_prop: React.ComponentProps<typeof ContractDetailsFooter>['contract_info'];

    beforeEach(() => {
        default_mock_store = mockStore({
            contract_replay: {
                onClickCancel: jest.fn(),
                onClickSell: jest.fn(),
                is_sell_requested: false,
            },
            common: {
                server_time: new Date(),
            },
        });

        default_mock_prop = mockContractInfo({
            bid_price: 100,
            currency: 'USD',
            contract_id: 1,
            profit: 10,
            contract_type: 'non-multiplier',
        });
    });

    const renderFooter = () => {
        render(
            <StoreProvider store={default_mock_store}>
                <ContractDetailsFooter contract_info={default_mock_prop} />
            </StoreProvider>
        );
    };

    it('renders close button with bid price and currency for non-multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);

        renderFooter();

        const close_button = screen.getByRole('button', { name: /close 100.00 usd/i });
        expect(close_button).toBeInTheDocument();
        expect(close_button).toBeEnabled();
    });

    it('renders resale not offered message for non-valid sell contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        renderFooter();

        const resale_message = screen.getByText(/resale not offered/i);
        expect(resale_message).toBeInTheDocument();
    });

    it('renders close and cancel buttons for multiplier contracts', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';

        renderFooter();

        const close_button = screen.getByRole('button', { name: /close/i });
        const cancel_button = screen.getByRole('button', { name: /cancel/i });

        expect(close_button).toBeInTheDocument();
        expect(cancel_button).toBeInTheDocument();
    });

    it('renders enabled close button with bid price for multiplier contracts if profit is positive and cancellation is valid', async () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        default_mock_prop = mockContractInfo({
            bid_price: 30,
            currency: 'BYN',
            contract_id: 1,
            profit: 20,
            contract_type: 'multiplier',
        });

        renderFooter();

        const close_button = screen.getByRole('button', { name: 'Close 30.00 BYN' });
        expect(close_button).toBeEnabled();
        await userEvent.click(close_button);

        expect(default_mock_store.contract_replay.onClickSell).toHaveBeenCalledWith(1);
    });

    it('renders disabled close button without bid price for multiplier contracts if profit is negative and cancellation is valid', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        default_mock_prop.profit = -20;

        renderFooter();

        expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    });

    it('calls onClickCancel when cancel button is clicked', async () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToSell as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        default_mock_prop.profit = -20;

        renderFooter();

        const cancel_button = screen.getByRole('button', { name: /cancel/i });
        await userEvent.click(cancel_button);

        expect(default_mock_store.contract_replay.onClickCancel).toHaveBeenCalledWith(1);
    });

    it('calls onClickSell when close button is clicked', async () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => true);

        renderFooter();

        const close_button = screen.getByRole('button', { name: /close 100.00 usd/i });
        await userEvent.click(close_button);

        expect(default_mock_store.contract_replay.onClickSell).toHaveBeenCalledWith(1);
    });

    it('does not call onClickSell if not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        renderFooter();

        const close_button = screen.queryByRole('button');
        expect(close_button).toBeDisabled();
    });

    it('disables cancel button when profit is non-negative', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => true);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';
        default_mock_store.contract_replay.contract_store.contract_info.profit = 0;

        renderFooter();

        const cancel_button = screen.getByRole('button', { name: /cancel/i });
        expect(cancel_button).toBeDisabled();
    });

    it('does not render cancel button if not valid to cancel', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => true);
        (isValidToCancel as jest.Mock).mockImplementation(() => false);
        default_mock_store.contract_replay.contract_store.contract_info.contract_type = 'multiplier';

        renderFooter();

        const cancel_button = screen.queryByRole('button', { name: /cancel/i });
        expect(cancel_button).not.toBeInTheDocument();
    });

    it('renders correct button label for non-multiplier contract when not valid to sell', () => {
        (isMultiplierContract as jest.Mock).mockImplementation(() => false);
        (isValidToSell as jest.Mock).mockImplementation(() => false);

        renderFooter();

        const resale_message = screen.getByRole('button', { name: /resale not offered/i });
        expect(resale_message).toBeInTheDocument();
    });
});
