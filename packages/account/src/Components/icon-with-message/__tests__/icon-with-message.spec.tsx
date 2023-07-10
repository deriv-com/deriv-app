import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import IconWithMessage from '../icon-with-message';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

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

    it('should render the IconWithMessage component', () => {
        render(<IconWithMessage {...props} />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('title')).toBeInTheDocument();
    });

    it('should not render the button component if has_button is false', () => {
        render(<IconWithMessage {...props} has_button={false} />);
        const btn = screen.queryByTestId('icon-with-message-button');
        expect(btn).not.toBeInTheDocument();
    });
    it('should show "Switch to real account" button label if user have real account', () => {
        render(<IconWithMessage {...props} has_button={true} has_real_account={true} />);
        const btn = screen.getByTestId('icon-with-message-button');
        expect(btn).toBeInTheDocument();
        expect(screen.getByText('Switch to real account')).toBeInTheDocument();
    });

    it('should show "Add a real account" button label if user doesnt have real account', () => {
        render(<IconWithMessage {...props} has_button={true} has_real_account={false} />);
        expect(screen.getByText('Add a real account')).toBeInTheDocument();
    });

    it('Should trigger click on the button', () => {
        const new_props = {
            icon: 'string',
            message: 'title',
            has_button: true,
            has_real_account: true,
        };
        const toggleShouldShowRealAccountsList = jest.fn();
        const toggleAccountsDialog = jest.fn();
        render(
            <IconWithMessage
                {...new_props}
                toggleAccountsDialog={toggleAccountsDialog}
                toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            />
        );
        const btn = screen.getByTestId('icon-with-message-button');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(toggleShouldShowRealAccountsList).toHaveBeenCalledTimes(1);
        expect(toggleAccountsDialog).toHaveBeenCalledTimes(1);
    });
});
