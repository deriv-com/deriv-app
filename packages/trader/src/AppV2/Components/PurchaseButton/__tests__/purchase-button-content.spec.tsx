import React from 'react';
import { render, screen } from '@testing-library/react';
import { getLocalizedBasis } from '@deriv/shared';
import PurchaseButtonContent from '../purchase-button-content';

const mock_props = {
    currency: 'USD',
    current_stake: 12,
    has_open_accu_contract: false,
    is_accumulator: false,
    is_reverse: false,
};
const wrapper_data_test_id = 'dt_purchase_button_wrapper';
const localized_basis = getLocalizedBasis();

describe('PurchaseButtonContent', () => {
    it('should render empty wrapper with specific className if info prop is empty object or falsy', () => {
        render(<PurchaseButtonContent {...mock_props} />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.queryByText(mock_props.currency)).not.toBeInTheDocument();
    });

    it('should render correct default text basis and amount if info was passed', () => {
        render(<PurchaseButtonContent {...mock_props} />);

        expect(screen.getByTestId(wrapper_data_test_id)).not.toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.getByText(localized_basis.payout)).toBeInTheDocument();
        expect(screen.getByText(/19.23/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should apply specific className to wrapper when is_reverse is true', () => {
        render(<PurchaseButtonContent {...mock_props} is_reverse />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass('purchase-button__information__wrapper--reverse');
    });
});
