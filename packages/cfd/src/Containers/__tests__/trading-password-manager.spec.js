import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import TradingPasswordManager from '../trading-password-manager';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='dt_mocked_icon'>{props.icon}</div>),
    };
});

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        verifyEmail: jest.fn(() => Promise.resolve()),
    },
}));

describe('TradingPasswordManager', () => {
    const mock_props = {
        platform: 'mt5',
        email: '',
        account_group: '',
    };

    it('should render the proper icon and text for Deriv MT5 for TradingPasswordManager', () => {
        render(<TradingPasswordManager {...mock_props} platform='mt5' />);
        expect(screen.getByTestId('dt_mocked_icon')).toHaveTextContent('IcMt5OnePassword');
        expect(screen.getAllByText(/Deriv MT5 password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps/i
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change password/i })).toBeInTheDocument();
    });

    it('should call ChangePasswordConfirmation component as the next step if the button is clicked ', () => {
        render(<TradingPasswordManager {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change password/i }));
        expect(screen.getByText(/IcMt5OnePassword/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm to change your Deriv MT5 password/i)).toBeInTheDocument();
        expect(
            screen.getByText(/This will change the password to all of your Deriv MT5 accounts/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });

    it('should render the proper icon and text for Deriv X for TradingPasswordManager', () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        expect(screen.getByTestId('dt_mocked_icon')).toHaveTextContent('IcDxtradeOnePassword');
        expect(screen.getAllByText(/Deriv X password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your Deriv X accounts on the web and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change password/i })).toBeInTheDocument();
    });

    it('should call ChangePasswordConfirmation component as the next step if the button is clicked ', () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change password/i }));
        expect(screen.getByText(/IcDxtradeOnePassword/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm to change your Deriv X password/i)).toBeInTheDocument();
        expect(screen.getByText(/This will change the password to all of your Deriv X accounts/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });

    it('should return to the previous Modal (TradingPasswordManager) if cancel button is clicked', () => {
        render(<TradingPasswordManager {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(screen.getByText(/Change password/i)).toBeInTheDocument();
    });

    it('should call SendEmailModal if the confirm button is clicked for Deriv MT5 account', async () => {
        render(<TradingPasswordManager {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv MT5 password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
    });

    it('should call SendEmailModal if the confirm button is clicked for Deriv X account', async () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
    });
});
