import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { mockContractInfo } from '@deriv/shared';
import ReportsProviders from '../../reports-providers';
import IndicativeCell from '../indicative-cell';

const customStore = mockStore({
    portfolio: {
        onClickSell: jest.fn(),
    },
});
const contractID = 12546512435612;
const mockProps = {
    amount: 100.01,
    contract_info: mockContractInfo({ contract_id: contractID }),
    currency: 'USD',
    is_footer: false,
    is_sell_requested: false,
    profit: '5.23',
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    hasContractEntered: jest.fn().mockReturnValue(true),
    isValidToSell: jest.fn().mockReturnValue(true),
}));

describe('IndicativeCell component', () => {
    it('should render the amount and arrow indicator', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} />
            </ReportsProviders>
        );

        const amountElement = screen.getByText(Math.abs(mockProps.amount).toString());
        const arrow = screen.getByTestId('dt_arrow_indicator');

        expect(amountElement).toBeInTheDocument();
        expect(arrow).toBeInTheDocument();
    });

    it('should render the profit amount with a profit class', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} />
            </ReportsProviders>
        );

        const amountContainer = screen.getByTestId('dt_amount_container');

        expect(amountContainer).toHaveClass('dc-contract-card--profit');
    });

    it('should render the loss amount with a loss class', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} profit='-2.35' />
            </ReportsProviders>
        );

        const amountContainer = screen.getByTestId('dt_amount_container');

        expect(amountContainer).toHaveClass('dc-contract-card--loss');
    });

    it('should not call onClickSell if user clicks on Sell button, but contract_id is falsy', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} contract_info={mockContractInfo({ contract_id: 0 })} />
            </ReportsProviders>
        );

        userEvent.click(screen.getByText('Sell'));

        expect(customStore.portfolio.onClickSell).not.toHaveBeenCalled();
    });

    it('should call onClickSell with contract_id if user clicks on Sell button', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} />
            </ReportsProviders>
        );

        userEvent.click(screen.getByText('Sell'));

        expect(customStore.portfolio.onClickSell).toHaveBeenCalledWith(contractID);
    });

    it('should not render the ContractCard.Sell component for footer cells', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} is_footer />
            </ReportsProviders>
        );

        const sellButton = screen.queryByTestId('dt_contract_card_sell');

        expect(sellButton).not.toBeInTheDocument();
    });
});
