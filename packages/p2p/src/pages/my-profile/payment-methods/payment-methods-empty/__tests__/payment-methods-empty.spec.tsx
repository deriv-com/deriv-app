import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores/index';
import PaymentMethodsEmpty from '../payment-methods-empty';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        setActiveTab: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('<PaymentMethodsEmpty/>', () => {
    it('should render PaymentMethodsEmpty component', () => {
        render(<PaymentMethodsEmpty />);

        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add payment methods' })).toBeInTheDocument();
    });

    it('should call setActiveTab when clicking on return icon', () => {
        render(<PaymentMethodsEmpty />);

        const returnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(returnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });
});
