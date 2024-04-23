import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingRate from '../FloatingRate';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        settings: {
            useGetSettings: () => ({
                data: {
                    override_exchange_rate: 1,
                },
            }),
        },
    },
    useExchangeRateSubscription: () => ({
        data: {
            rates: {
                USD: 1,
            },
        },
        subscribe: jest.fn(),
    }),
}));

const mockProps = {
    changeHandler: jest.fn(),
    errorMessages: '',
    fiatCurrency: 'USD',
    localCurrency: 'IDR',
    onChange: jest.fn(),
    value: 1.1,
};

describe('FloatingRate', () => {
    it('should render the component as expected', () => {
        render(<FloatingRate {...mockProps} />);
        expect(screen.getByText(/of the market rate/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    it('should handle onChange', () => {
        render(<FloatingRate {...mockProps} />);
        const input = screen.getByDisplayValue('1.1');
        expect(input).toBeInTheDocument();
        userEvent.type(input, '1');
        expect(mockProps.changeHandler).toHaveBeenCalledTimes(1);
    });
    it('should show error message', () => {
        render(<FloatingRate {...mockProps} errorMessages='Error' />);
        expect(screen.getByText('Error')).toBeInTheDocument();
    });
    it('should display rate message when no errors are there', () => {
        render(<FloatingRate {...mockProps} />);
        expect(screen.getByText(/Your rate is =/)).toBeInTheDocument();
    });
    it('should handle blur event', () => {
        render(<FloatingRate {...mockProps} />);
        const input = screen.getByDisplayValue('1.1');
        userEvent.click(input);
        userEvent.tab();
        expect(input).toHaveValue('+1.10');
    });
});
