import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import TradingPasswordManager from '../trading-password-manager';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

describe('TradingPasswordManager', () => {
    const mock_props = { platform: 'mt5', onConfirm: jest.fn() };

    it('should render the proper icon and text for DMT5', () => {
        render(<TradingPasswordManager {...mock_props} platform='mt5' />);
        expect(screen.getByTestId('mocked_icon')).toHaveTextContent('IcMt5OnePassword');
        expect(screen.getAllByText(/DMT5 password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change DMT5 password/i })).toBeInTheDocument();
    });

    it('should render the proper icon and text for DerivX', () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        expect(screen.getByTestId('mocked_icon')).toHaveTextContent(/IcDxtradeOnePassword/i);
        expect(screen.getAllByText(/Deriv X password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your Deriv X accounts on the web and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change Deriv X password/i })).toBeInTheDocument();
    });

    it('should call onConfirm if the button is clicked', async () => {
        render(<TradingPasswordManager {...mock_props} platform='dxtrade' />);
        const button = screen.getByRole('button', { name: /Change Deriv X password/i });
        fireEvent.click(button);
    });
});
