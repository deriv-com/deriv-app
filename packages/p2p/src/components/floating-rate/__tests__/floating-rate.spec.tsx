import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { useP2PSettings } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import FloatingRate from '../floating-rate';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

jest.mock('@deriv/hooks');

const mockUseP2PSettings = useP2PSettings as jest.MockedFunction<typeof useP2PSettings>;

describe('<FloatingRate/>', () => {
    const floating_rate_props = {
        change_handler: jest.fn(),
        className: 'floating-rate',
        data_testid: 'dt_floating_rate',
        error_messages: '',
        fiat_currency: 'AED',
        local_currency: 'INR',
        onChange: jest.fn(),
        offset: {},
    };

    beforeEach(() => {
        mockUseP2PSettings.mockReturnValue({
            // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
            p2p_settings: {
                override_exchange_rate: '1.00',
            },
        });
    });

    it('should render default state of the component with hint message and increment, decrement buttons', () => {
        render(<FloatingRate {...floating_rate_props} />, { wrapper });

        expect(screen.getByText('of the market rate')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should display error messages when error is passed as props', () => {
        render(<FloatingRate {...floating_rate_props} error_messages='Floating rate error' />, { wrapper });

        expect(screen.getByText('Floating rate error')).toBeInTheDocument();
    });

    it('should render market rate feed based on the floating rate value passed', () => {
        render(<FloatingRate {...floating_rate_props} value='+2' />, { wrapper });

        expect(screen.getByText('Your rate is = 1.02 INR')).toBeInTheDocument();
    });

    it('should render the exchange rate in hint', () => {
        render(<FloatingRate {...floating_rate_props} />, { wrapper });

        expect(screen.getByText('1 AED = 1.00')).toBeInTheDocument();
    });

    it('should call onChange with the modified event object on blur', () => {
        const onChangeMock = jest.fn();
        render(<FloatingRate {...floating_rate_props} error_messages='' onChange={onChangeMock} />, { wrapper });

        // Case 1: Value meets conditions with '+' symbol
        const inputElement = screen.getByLabelText('Floating rate');
        (inputElement as HTMLInputElement).value = '10';
        fireEvent.blur(inputElement);

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith(
            expect.objectContaining({ target: expect.objectContaining({ value: '+10.00' }) })
        );

        // Case 2: Value does not meet conditions without '+' symbol
        (inputElement as HTMLInputElement).value = '-5';
        fireEvent.blur(inputElement);
        expect(onChangeMock).toHaveBeenCalledTimes(2);
        expect(onChangeMock).toHaveBeenCalledWith(
            expect.objectContaining({ target: expect.objectContaining({ value: '-5.00' }) })
        );
    });
});
