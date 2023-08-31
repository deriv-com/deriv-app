import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { StoreProvider, mockStore } from '@deriv/stores';
import ClosingAccountSteps from '../closing-account-steps';

describe('<ClosingAccountSteps />', () => {
    const mockRootStore = mockStore({});
    const history = createBrowserHistory();
    const mock_props: React.ComponentProps<typeof ClosingAccountSteps> = {
        redirectToReasons: jest.fn(),
    };

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>
                <BrowserRouter>{children}</BrowserRouter>
            </StoreProvider>
        );
        render(<ClosingAccountSteps {...mock_props} />, {
            wrapper,
        });
    };

    it('should render the ClosingAccountSteps component', () => {
        renderComponent();
        expect(screen.getByText(/are you sure?/i)).toBeInTheDocument();
        expect(screen.getByText(/if you close your account:/i)).toBeInTheDocument();
        expect(screen.getByText(/you can't trade on Deriv./i)).toBeInTheDocument();
        expect(screen.getByText(/you can't make transactions./i)).toBeInTheDocument();
        expect(screen.getByText(/before closing your account:/i)).toBeInTheDocument();
        expect(screen.getByText(/close all your positions./i)).toBeInTheDocument();
        expect(screen.getByText(/withdraw your funds/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /we shall delete your personal information as soon as our legal obligations are met, as mentioned in the section on Data Retention in our/i
            )
        ).toBeInTheDocument();
    });

    it('should have link to security and privacy policy pdf', () => {
        renderComponent();
        expect(screen.getByRole('link', { name: /security and privacy policy/i })).toHaveAttribute(
            'href',
            'https://deriv.com/tnc/security-and-privacy.pdf'
        );
    });

    it('should call redirectToReasons when close_account_button is clicked ', () => {
        renderComponent();
        const close_account_button = screen.getByRole('button', { name: /close my account/i });
        expect(close_account_button).toBeInTheDocument();
        userEvent.click(close_account_button);
        expect(mock_props.redirectToReasons).toHaveBeenCalled();
    });

    it('should navigate to root page on clicking the cancel button', () => {
        renderComponent();
        const cancel_button = screen.getByRole('button', { name: /cancel/i });
        expect(cancel_button).toBeInTheDocument();
        userEvent.click(cancel_button);
        expect(history.location.pathname).toBe('/');
    });

    it('should render proper button if is_from_derivgo is true', () => {
        mockRootStore.common.is_from_derivgo = true;
        renderComponent();
        expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
        const close_account_button = screen.getByRole('button', { name: /close my account/i });
        expect(close_account_button).toBeInTheDocument();
        userEvent.click(close_account_button);
        expect(mock_props.redirectToReasons).toHaveBeenCalled();
    });
});
