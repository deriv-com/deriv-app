import React from 'react';
import AccountTypeDropdown from '../account-type-dropdown';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

let mock = mockStore({});

const checkAccountTypeDropdownContainer = () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(<AccountTypeDropdown />, { wrapper });
    expect(container).toBeInTheDocument();
};

describe('AccountTypeDropdown', () => {
    beforeEach(() => {
        mock = mockStore({});
    });
    it('should render the component', () => {
        checkAccountTypeDropdownContainer();
    });

    it('should show real account type', () => {
        checkAccountTypeDropdownContainer();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should show demo account type', () => {
        mock.traders_hub.selected_account_type = 'demo';
        checkAccountTypeDropdownContainer();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should change to demo account type', () => {
        checkAccountTypeDropdownContainer();
        userEvent.click(screen.getByText('Real'));
        userEvent.click(screen.getByText('Demo'));
        expect(mock.traders_hub.selectAccountType).toBeCalledTimes(1);
    });
});
