import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellHeader from '../BuySellHeader';

const mockProps = {
    activeTab: 'Buy',
    setActiveTab: jest.fn(),
};

describe('<BuySellHeader />', () => {
    it('should render the BuySellHeader', () => {
        render(<BuySellHeader {...mockProps} />);

        const buySellHeader = screen.getByTestId('dt_p2p_v2_buy_sell_header');

        expect(within(buySellHeader).getByRole('button', { name: 'Buy' })).toBeInTheDocument();
        expect(within(buySellHeader).getByRole('button', { name: 'Sell' })).toBeInTheDocument();
    });

    it('should call setActiveTab when Sell tab is clicked', () => {
        render(<BuySellHeader {...mockProps} />);

        const sellTab = screen.getByRole('button', { name: 'Sell' });

        userEvent.click(sellTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith('Sell');
    });

    it('should call setActiveTab when Buy tab is clicked', () => {
        render(<BuySellHeader {...mockProps} />);

        const buyTab = screen.getByRole('button', { name: 'Buy' });

        userEvent.click(buyTab);
        expect(mockProps.setActiveTab).toHaveBeenCalledWith('Buy');
    });
});
