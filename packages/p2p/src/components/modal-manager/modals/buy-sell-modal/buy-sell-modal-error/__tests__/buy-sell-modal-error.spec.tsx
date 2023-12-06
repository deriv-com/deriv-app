import React from 'react';
import { screen, render } from '@testing-library/react';
import BuySellModalError from '../buy-sell-modal-error';

const buy_sell_modal_error_props = {
    error_message: 'test error',
    show_low_balance_message: false,
};

describe('<BuySellModalError />', () => {
    it('should display the error_message if it is not an empty string and show_low_balance_message is false', () => {
        render(<BuySellModalError {...buy_sell_modal_error_props} />);

        expect(screen.getByText('test error')).toBeInTheDocument();
    });

    it('should display the show_low_balance_message if it is true and has error_message', () => {
        render(<BuySellModalError {...buy_sell_modal_error_props} show_low_balance_message={true} />);

        expect(
            screen.getByText("Your Deriv P2P balance isn't enough. Please increase your balance before trying again.")
        ).toBeInTheDocument();
    });

    it('should display nothing if error_message is an empty string', () => {
        render(<BuySellModalError {...buy_sell_modal_error_props} error_message='' />);

        expect(screen.queryByText('test error')).not.toBeInTheDocument();
    });
});
