import React from 'react';
import { screen, render } from '@testing-library/react';
import { isDesktop } from '@deriv/shared';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import BuySellModalTitle from '../buy-sell-modal-title';
import userEvent from '@testing-library/user-event';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        selected_ad_state: {
            account_currency: 'USD',
        },
        show_advertiser_page: false,
        table_type: 'sell',
    },
    general_store: {
        is_form_modified: false,
    },
    my_profile_store: {
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => false),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<BuySellModalTitle />', () => {
    it('should display Sell USD if table type is sell', () => {
        render(<BuySellModalTitle />);

        expect(screen.getByText('Sell USD')).toBeInTheDocument();
    });

    it('should display Buy USD if table type is buy', () => {
        mock_store.buy_sell_store.table_type = 'buy';

        render(<BuySellModalTitle is_buy={true} />);

        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });

    it('should display Add payment method text if should_show_add_payment_method_form is true and isDesktop is false', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<BuySellModalTitle />);

        expect(screen.getByText('Add payment method')).toBeInTheDocument();
    });

    it('should display Add payment method text with arrow icon if should_show_add_payment_method_form is true and isDesktop is true', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);

        render(<BuySellModalTitle />);

        expect(screen.getByTestId('dt_buy_sell_modal_back_icon')).toBeInTheDocument();
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
    });

    it('should call setShouldShowAddPaymentMethodForm when clicking the icon, if is_form_modified is false', () => {
        render(<BuySellModalTitle />);

        const back_icon = screen.getByTestId('dt_buy_sell_modal_back_icon');
        userEvent.click(back_icon);

        expect(mock_store.my_profile_store.setShouldShowAddPaymentMethodForm).toHaveBeenCalledWith(false);
    });

    it('should call showModal when clicking the icon, if is_form_modified is true', () => {
        mock_store.general_store.is_form_modified = true;

        render(<BuySellModalTitle />);

        const back_icon = screen.getByTestId('dt_buy_sell_modal_back_icon');
        userEvent.click(back_icon);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CancelAddPaymentMethodModal', props: {} });
    });
});
