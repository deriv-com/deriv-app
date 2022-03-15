import React from 'react';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MyProfileForm from '../my-profile-form.jsx';

const mock_profile_store = {
    contact_info: '',
    default_advert_description: '',
    payment_info: '',
    is_submit_success: false,
    form_error: null,
    handleSubmit: jest.fn(),
    validateForm: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({ my_profile_store: mock_profile_store })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileFullPageModal: jest.fn(({ children }) => (
        <div>
            <div>Mobile view</div>
            {children}
        </div>
    )),
}));

describe('<MyProfileForm/>', () => {
    it('should disable only the Subit button when empty form is present', () => {
        render(<MyProfileForm />);

        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('should invoke submit method for valid values are entered', async () => {
        const { my_profile_store } = useStores();
        render(<MyProfileForm />);
        const fields = screen.getAllByRole('textbox');
        fireEvent.input(fields[0], { target: { value: '9715023468' } });
        fireEvent.input(fields[1], { target: { value: 'P2P test' } });
        fireEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
            expect(my_profile_store.validateForm).toHaveBeenCalledTimes(3);
            expect(my_profile_store.handleSubmit).toHaveBeenCalled();
        });
    });

    it('should display the mobile view when rendered in mobile', () => {
        isDesktop.mockImplementation(() => false);
        render(<MyProfileForm />);

        expect(screen.getByText('Mobile view')).toBeInTheDocument();
    });
});
