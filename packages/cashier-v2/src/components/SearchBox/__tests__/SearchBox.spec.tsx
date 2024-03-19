import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from '../SearchBox';

describe('SearchBox', () => {
    let mockedProps: React.ComponentProps<typeof SearchBox>;
    beforeEach(() => {
        mockedProps = {
            onSearchHandler: jest.fn(),
            placeholder: 'Search box placeholder',
        };
    });

    it('should show proper placeholder', () => {
        render(<SearchBox {...mockedProps} />);

        const placeholder = screen.getByText('Search box placeholder');

        expect(placeholder).toBeInTheDocument();
    });

    it('should trigger onSearchHandler callback with proper value', () => {
        render(<SearchBox {...mockedProps} />);

        const searchBox = screen.getByRole('textbox');
        userEvent.type(searchBox, 'Hello');

        expect(mockedProps.onSearchHandler).toHaveBeenLastCalledWith('Hello');
    });

    it('should erase the entered value when the user is clicking on close icon', () => {
        render(<SearchBox {...mockedProps} />);

        const searchBox = screen.getByRole('textbox');
        userEvent.type(searchBox, 'Hello');
        const closeIcon = screen.getByTestId('dt_close_icon');
        userEvent.click(closeIcon);

        expect(mockedProps.onSearchHandler).toHaveBeenLastCalledWith('');
    });

    it('should prevent the input of empty strings', () => {
        render(<SearchBox {...mockedProps} />);

        const searchBox = screen.getByRole('textbox');
        userEvent.type(searchBox, '     ');

        expect(mockedProps.onSearchHandler).toHaveBeenLastCalledWith('');
    });

    it('close icon should not be visible if there is no value in search box', () => {
        render(<SearchBox {...mockedProps} />);

        const closeIcon = screen.queryByTestId('dt_close_icon');

        expect(closeIcon).not.toBeInTheDocument();
    });
});
