import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStores } from 'Stores/index';
import { mockStore, StoreProvider } from '@deriv/stores';
import FloatingRate from '../floating-rate';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

describe('<FloatingRate/>', () => {
    beforeEach(() => {
        mock_store = {
            floating_rate_store: {
                market_rate: '100',
                float_rate_offset_limit: 10,
            },
            general_store: {
                current_focus: '',
                client: { local_currency_config: { decimal_places: 2 } },
                setCurrentFocus: jest.fn(),
            },
        };
    });

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

    it('should render default state of the component with hint message and increment, decrement buttons', () => {
        render(<FloatingRate {...floating_rate_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('of the market rate')).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBe(2);
    });

    it('should display error messages when error is passed as props', () => {
        render(<FloatingRate {...floating_rate_props} error_messages='Floating rate error' />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Floating rate error')).toBeInTheDocument();
    });

    it('should render market rate feed based on the floating rate value passed', () => {
        render(<FloatingRate {...floating_rate_props} value='+2' />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Your rate is = 102.00 INR')).toBeInTheDocument();
    });

    it('should render the exchange rate in hint', () => {
        render(<FloatingRate {...floating_rate_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('1 AED = 100.00')).toBeInTheDocument();
    });

    it('should call onChange with the modified event object on blur', () => {
        const onChangeMock = jest.fn();
        render(<FloatingRate {...floating_rate_props} error_messages='' onChange={onChangeMock} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        // Case 1: Value meets conditions with '+' symbol
        const inputElement = screen.getByLabelText('Floating rate');
        inputElement.value = '10';
        fireEvent.blur(inputElement);

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith(
            expect.objectContaining({ target: expect.objectContaining({ value: '+10.00' }) })
        );

        // Case 2: Value does not meet conditions without '+' symbol
        inputElement.value = '-5';
        fireEvent.blur(inputElement);
        expect(onChangeMock).toHaveBeenCalledTimes(2);
        expect(onChangeMock).toHaveBeenCalledWith(
            expect.objectContaining({ target: expect.objectContaining({ value: '-5.00' }) })
        );
    });
});
