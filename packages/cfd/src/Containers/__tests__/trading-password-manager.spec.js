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

describe('TradingPasswordManager', () => {
    const mock_props = { platform: 'mt5', email: '', account_group: '', onConfirm: jest.fn(), onCancel: jest.fn() };

    it('should render the proper icon and text for DMT5 for TradingPasswordManager', () => {
        render(<TradingPasswordManager {...mock_props} platform='mt5' />);
        expect(screen.getByTestId('dt_mocked_icon')).toHaveTextContent('IcMt5OnePassword');
        expect(screen.getAllByText(/DMT5 password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change DMT5 password/i })).toBeInTheDocument();
    });

    it('should call ChangePasswordConfirmation component as the next step if the button is clicked ', () => {
        render(<TradingPasswordManager {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change DMT5 password/i }));
        expect(screen.getByText(/IcMt5OnePassword/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm to change your DMT5 password/i)).toBeInTheDocument();
        expect(screen.getByText(/This will change the password to all of your DMT5 accounts/i)).toBeInTheDocument();
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
        expect(screen.getByRole('button', { name: /Change Deriv X password/i })).toBeInTheDocument();
    });

    it('should call ChangePasswordConfirmation component as the next step if the button is clicked ', () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        expect(screen.getByText(/IcDxtradeOnePassword/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm to change your Deriv X password/i)).toBeInTheDocument();
        expect(screen.getByText(/This will change the password to all of your Deriv X accounts/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });
});
