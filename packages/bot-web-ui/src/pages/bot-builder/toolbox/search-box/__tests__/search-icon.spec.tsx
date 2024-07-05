import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchIcon from '../search-icon';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => (
            <div data-testid-icon={props.icon} data-testid-color={props.color}>
                Icon
            </div>
        )),
    };
});

const mocked_props = {
    search: 'text',
    is_search_loading: false,
    onClick: jest.fn(),
};

describe('SearchIcon', () => {
    it('should render the SearchIcon component', () => {
        render(<SearchIcon {...mocked_props} />);

        const icon_element = screen.getByText('Icon');

        expect(icon_element).toBeInTheDocument();
    });

    it('should render the SearchIcon component with IcCloseCircle icon and has correct props when search value is not empty', () => {
        render(<SearchIcon {...mocked_props} />);

        const icon_close_circle = screen.getByText('Icon');

        expect(icon_close_circle).toBeInTheDocument();
        expect(icon_close_circle).toHaveAttribute('data-testid-color', 'secondary');
        expect(icon_close_circle).toHaveAttribute('data-testid-icon', 'IcCloseCircle');
    });

    it('should render search icon when search is empty', () => {
        render(<SearchIcon {...mocked_props} search='' />);

        const search_icon = screen.getByText('Icon');
        userEvent.click(search_icon);

        expect(search_icon).toBeInTheDocument();
        expect(search_icon).toHaveAttribute('data-testid-icon', 'IcSearch');
    });

    it('should render loader when is_search_loading is true', () => {
        render(<SearchIcon {...mocked_props} is_search_loading={true} />);

        const loader = screen.getByTestId('loader');

        expect(loader).toBeInTheDocument();
        expect(loader).toHaveClass('loader', { exact: true });
    });
});
