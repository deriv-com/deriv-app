import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import IconWithMessage from '../icon-with-message';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
describe('<IconWithMessage />', () => {
    const props = {
        icon: 'string',
        message: 'title',
    };
    const store = mockStore();

    it('should render the IconWithMessage component', () => {
        render(
            <StoreProvider store={store}>
                <IconWithMessage {...props} />
            </StoreProvider>
        );
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('title')).toBeInTheDocument();
    });

    it('should not render the button component if has_button is false', () => {
        render(
            <StoreProvider store={store}>
                <IconWithMessage {...props} has_button={false} />
            </StoreProvider>
        );
        const btn = screen.queryByTestId('icon-with-message-button');
        expect(btn).not.toBeInTheDocument();
    });
    it('should show "Switch to real account" button label if user have real account', () => {
        store.client.has_any_real_account = true;
        render(
            <StoreProvider store={store}>
                <IconWithMessage {...props} has_button={true} />
            </StoreProvider>
        );
        const btn = screen.getByTestId('icon-with-message-button');
        expect(btn).toBeInTheDocument();
        expect(screen.getByText('Switch to real account')).toBeInTheDocument();
    });

    it('should show "Add a real account" button label if user doesnt have real account', () => {
        store.client.has_any_real_account = false;
        render(
            <StoreProvider store={store}>
                <IconWithMessage {...props} has_button={true} />
            </StoreProvider>
        );
        expect(screen.getByText('Add a real account')).toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const new_props = {
            icon: 'string',
            message: 'title',
            has_button: true,
        };
        store.client.has_any_real_account = true;
        const toggleShouldShowRealAccountsList = jest.fn();
        const toggleAccountsDialog = jest.fn();
        store.ui.toggleShouldShowRealAccountsList = toggleShouldShowRealAccountsList;
        store.ui.toggleAccountsDialog = toggleAccountsDialog;
        render(
            <StoreProvider store={store}>
                <IconWithMessage {...new_props} />
            </StoreProvider>
        );
        const btn = screen.getByTestId('icon-with-message-button');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(toggleShouldShowRealAccountsList).toHaveBeenCalledTimes(1);
        expect(toggleAccountsDialog).toHaveBeenCalledTimes(1);
    });
});
