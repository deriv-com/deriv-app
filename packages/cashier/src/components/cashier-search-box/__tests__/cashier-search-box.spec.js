import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import CashierSearchBox from '../cashier-search-box';

describe('<CashierSearchBox />', () => {
    const props = {
        onClear: jest.fn(),
        onSearch: jest.fn(),
        placeholder: 'Search placeholder',
        setIsSearchLoading: jest.fn(),
    };

    it('should have close icon if there is a text in input field', () => {
        render(<CashierSearchBox {...props} />);

        const el_search_input = screen.getByPlaceholderText('Search placeholder');
        fireEvent.change(el_search_input, { target: { value: 'hello' } });

        expect(screen.getByTestId('dt_close_icon')).toBeInTheDocument();
    });

    it('should trigger onClear callback when the user clicks on close icon', () => {
        render(<CashierSearchBox {...props} />);

        const el_search_input = screen.getByPlaceholderText('Search placeholder');
        fireEvent.change(el_search_input, { target: { value: 'hello' } });
        const el_close_icon = screen.getByTestId('dt_close_icon');
        fireEvent.click(el_close_icon);

        expect(props.onClear).toHaveBeenCalledTimes(1);
    });

    it('should not trigger setTimeout callback (formSubmit) when the user presses backspace button on empty search input', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        render(<CashierSearchBox {...props} />);

        const el_search_input = screen.getByPlaceholderText('Search placeholder');
        fireEvent.keyDown(el_search_input);

        expect(props.setIsSearchLoading).not.toHaveBeenCalled();
        expect(setTimeout).not.toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('should trigger setIsSearchLoading, onSearch and setTimeout callbacks when the user enters the search term', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        render(<CashierSearchBox {...props} />);

        const el_search_input = screen.getByPlaceholderText('Search placeholder');
        await waitFor(() => {
            fireEvent.change(el_search_input, { target: { value: 'hello' } });
            fireEvent.keyUp(el_search_input);

            expect(props.setIsSearchLoading).toHaveBeenCalled();
            expect(setTimeout).toHaveBeenCalled();
            expect(props.onSearch).toHaveBeenCalled();
        });
        jest.useRealTimers();
    });
});
