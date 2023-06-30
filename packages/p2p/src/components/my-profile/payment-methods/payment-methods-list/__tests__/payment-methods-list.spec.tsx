import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import {
    payment_method_info_alipay,
    payment_method_info_bank,
    payment_method_info_other,
} from 'Components/my-profile/__mocks__/mock-payment-method-data';
import PaymentMethodsList from '../payment-methods-list';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        active_index: 4,
    },
    my_profile_store: {
        advertiser_payment_methods_list: [
            payment_method_info_alipay,
            payment_method_info_bank,
            payment_method_info_other,
        ],
        payment_methods_list_methods: [
            { display_name: 'E-wallet', method: 'e_wallet' },
            { display_name: 'Bank Transfer', method: 'bank_transfer' },
            { display_name: 'Other', method: 'other' },
        ],
        setActiveTab: jest.fn(),
        setPaymentMethodToDelete: jest.fn(),
        setPaymentMethodToEdit: jest.fn(),
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileWrapper: jest.fn(({ children }) => children),
}));

describe('<PaymentMethodsList /> Desktop', () => {
    it('should render PaymentMethodsList component', () => {
        render(<PaymentMethodsList />);

        expect(screen.getAllByRole('button', { name: 'Add new' }).length).toBe(2);
        expect(screen.getAllByText('Alipay').length).toBe(2);
        expect(screen.getAllByText('test_account').length).toBe(2);

        expect(screen.getAllByText('Others').length).toBe(2);
        expect(screen.getAllByText('test_other').length).toBe(2);

        expect(screen.getAllByText('Bank Transfers').length).toBe(2);
        expect(screen.getAllByText('test_bank_name').length).toBe(2);
    });

    it('should call setShouldShowAddPaymentMethodForm when clicking Add new button', () => {
        render(<PaymentMethodsList />);

        const addNewButtons = screen.getAllByRole('button', { name: 'Add new' });

        userEvent.click(addNewButtons[0]);

        expect(mock_store.my_profile_store.setShouldShowAddPaymentMethodForm).toBeCalledWith(true);
    });

    it('should call setActiveTab when clicking return icon', () => {
        render(<PaymentMethodsList />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });
});
