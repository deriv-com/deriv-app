import React from 'react';
import { render, screen } from '@testing-library/react';
import DynamicLeverageModalContent from '../dynamic-leverage-modal-content';

jest.mock('../dynamic-leverage-market-card', () => ({
    DynamicLeverageMarketCard: jest.fn(() => <div data-testid='leverage-market-card' />),
}));

describe('DynamicLeverageModalContent', () => {
    it('should render DynamicLeverageModalContent header properly', () => {
        render(<DynamicLeverageModalContent />);

        const title = screen.getByRole('heading');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent(
            'Enjoy dynamic leverage of up to 1:1500 when trading selected instruments in the forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to your trading position, based on asset type and trading volume.'
        );
    });

    it('should render DynamicLeverageModalContent cards properly', () => {
        render(<DynamicLeverageModalContent />);

        const cards = screen.getAllByTestId('leverage-market-card');
        expect(cards).toHaveLength(4);
        cards.forEach(card => {
            expect(card).toBeInTheDocument();
        });
    });
});
