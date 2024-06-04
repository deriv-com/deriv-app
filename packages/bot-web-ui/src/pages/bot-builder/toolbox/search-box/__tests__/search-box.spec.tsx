import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from '../search-box';

const onSearchKeyUp = jest.fn();
const onSearchClear = jest.fn();
const onSearchBlur = jest.fn();

const mocked_props = {
    is_search_loading: false,
    onSearch: jest.fn(),
    onSearchBlur,
    onSearchClear,
    onSearchKeyUp,
};

describe('SearchBox', () => {
    it('should render the SearchBox component', () => {
        render(<SearchBox {...mocked_props} />);

        const searchInput = screen.getByPlaceholderText('Search');
        expect(searchInput).toBeInTheDocument();
    });

    it('should handle on search', () => {
        render(<SearchBox {...mocked_props} />);

        const searchInput = screen.getByPlaceholderText('Search');
        userEvent.type(searchInput, 'A');
        expect(onSearchKeyUp).toHaveBeenCalled();
    });

    it('should handle search clear click', () => {
        render(<SearchBox {...mocked_props} />);

        const searchInput = screen.getByPlaceholderText('Search');
        userEvent.type(searchInput, 'demo text');

        // can not add data-testid to svg element. so we have to use this way to get svg element
        // eslint-disable-next-line testing-library/no-node-access
        const svgElements = document.getElementsByTagName('svg');
        const svgElement = svgElements[0];
        userEvent.click(svgElement);
        expect(onSearchClear).toHaveBeenCalled();
    });

    it('should handle on search blur', () => {
        render(<SearchBox {...mocked_props} />);

        const searchInput = screen.getByPlaceholderText('Search');
        userEvent.type(searchInput, 'demo text');

        // This simulates tabbing out of the input
        userEvent.tab();
        expect(onSearchBlur).toHaveBeenCalled();
    });
});
