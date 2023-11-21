import React from 'react';
import { render, screen } from '@testing-library/react';
import VanillaOptionsCardBody, { TVanillaOptionsCardBodyProps } from '../vanilla-options-card-body';

describe('VanillaOptionsCardBody', () => {
    const mock_props: TVanillaOptionsCardBodyProps = {
        contract_info: {
            buy_price: 100,
            bid_price: 105,
            entry_spot_display_value: '110',
            barrier: '120',
            sell_price: 95,
            profit: -5,
            status: 'loss',
        },
        currency: 'USD',
        getCardLabels: () => ({
            CONTRACT_VALUE: 'Contract Value',
            ENTRY_SPOT: 'Entry Spot',
            PURCHASE_PRICE: 'Purchase Price',
            STRIKE: 'Strike',
            TOTAL_PROFIT_LOSS: 'Total Profit/Loss',
        }),
        is_sold: true,
        progress_slider: null,
        status: 'loss',
    };
    it('should render the correct content for a sold contract', async () => {
        // Render the component with the provided props
        render(<VanillaOptionsCardBody {...mock_props} />);

        const indicative_movement = screen.getByTestId('dc-contract-card__indicative--movement');

        // Test that the correct elements are present in the component
        expect(screen.getByText(mock_props.getCardLabels().CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().PURCHASE_PRICE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().STRIKE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(indicative_movement).toHaveClass('dc-contract-card__indicative--movement-complete');
    });

    it('should render the correct content for an unsold contract', async () => {
        mock_props.contract_info.profit = 5;
        mock_props.contract_info.status = 'profit';
        mock_props.is_sold = false;
        mock_props.progress_slider = <div />;
        mock_props.status = 'profit';
        delete mock_props.contract_info.sell_price;

        // Render the component with the provided props
        render(<VanillaOptionsCardBody {...mock_props} />);

        const indicative_movement = screen.getByTestId('dc-contract-card__indicative--movement');

        // Test that the correct elements are present in the component
        expect(screen.getByText(mock_props.getCardLabels().CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().PURCHASE_PRICE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().STRIKE)).toBeInTheDocument();
        expect(screen.getByText(mock_props.getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(indicative_movement).not.toHaveClass('dc-contract-card__indicative--movement-complete');
    });
});
