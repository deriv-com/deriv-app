import React from 'react';
import { render, screen } from '@testing-library/react';
import PurchaseButtonsOverlay from '../purchase-buttons-overlay.jsx';

describe('PurchaseButtonsOverlay', () => {
    const message = 'You can only purchase one contract at a time';

    it('should render with a correct message', () => {
        render(<PurchaseButtonsOverlay message={message} />);
        expect(screen.getByText(message)).toBeInTheDocument();
    });
    it('should have purchase-buttons-overlay__one-button class when is_to_cover_one_button prop is passed', () => {
        render(<PurchaseButtonsOverlay message={message} is_to_cover_one_button />);
        expect(screen.getByTestId('dt_purchase_button_overlay')).toHaveClass('purchase-buttons-overlay__one-button');
    });
});
