import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, getCardLabels } from '@deriv/shared';
import VanillaOptionsCardBody, { TVanillaOptionsCardBodyProps } from '../vanilla-options-card-body';

describe('VanillaOptionsCardBody', () => {
    const mock_props: TVanillaOptionsCardBodyProps = {
        contract_info: mockContractInfo({
            buy_price: 100,
            bid_price: 105,
            entry_spot_display_value: '1100.00',
            barrier: '1200.00',
            sell_price: 95,
            profit: -5,
            status: 'lost',
        }),
        currency: 'USD',
        getCardLabels: () => getCardLabels(),
        is_sold: true,
        progress_slider: null,
    };
    it('should render the correct content for a sold contract', async () => {
        // Render the component with the provided props
        render(<VanillaOptionsCardBody {...mock_props} />);

        // Test that the correct elements are present in the component
        expect(screen.getByText(getCardLabels().CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText('1,100.00')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STRIKE)).toBeInTheDocument();
        expect(screen.getByText('1,200.00')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
    });

    it('should render the correct content for an unsold contract', async () => {
        mock_props.contract_info.profit = 5;
        mock_props.contract_info.status = 'won';
        mock_props.is_sold = false;
        mock_props.progress_slider = <div />;
        delete mock_props.contract_info.sell_price;

        // Render the component with the provided props
        render(<VanillaOptionsCardBody {...mock_props} />);

        // Test that the correct elements are present in the component
        expect(screen.getByText(getCardLabels().CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STRIKE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
    });

    it('should render arrow indicator if the contract is not sold (is_sold === false)', () => {
        render(<VanillaOptionsCardBody {...mock_props} />);

        expect(screen.getAllByTestId('dt_arrow_indicator')).not.toHaveLength(0);
    });

    it('should not render arrow indicator if the contract was sold (is_sold === true)', () => {
        render(<VanillaOptionsCardBody {...mock_props} is_sold />);

        expect(screen.queryByTestId('dt_arrow_indicator')).not.toBeInTheDocument();
    });
});
