import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbox from '../toolbox';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

describe('Toolbox component', () => {
    const mocked_props = {
        hasSubCategory: jest.fn(),
        is_search_loading: false,
        onMount: jest.fn(),
        onSearch: jest.fn(),
        onSearchBlur: jest.fn(),
        onSearchClear: jest.fn(),
        onSearchKeyUp: jest.fn(),
        onToolboxItemClick: jest.fn(),
        onToolboxItemExpand: jest.fn(),
        onUnmount: jest.fn(),
        setVisibility: jest.fn(),
        sub_category_index: [],
        loadDataStrategy: jest.fn(),
    };

    it('should render Toolbox with content wrapper is open', () => {
        render(<Toolbox {...mocked_props} />);
        expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
        expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should render Toolbox with content wrapper is open', () => {
        const setVisibility = jest.fn();
        render(<Toolbox {...mocked_props} setVisibility={setVisibility} />);
        expect(screen.getByTestId('db-toolbox__title')).toBeInTheDocument();

        userEvent.click(screen.getByTestId('db-toolbox__title'));
        expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('db-toolbox__content-wrapper active');
        expect(setVisibility).toHaveBeenCalled();
    });
    it('should not render Toolbox if it is mobile version', () => {
        render(<Toolbox {...mocked_props} />);
        if (isMobile()) {
            expect(screen.getByRole('dashboard__toolbox')).toBeEmptyDOMElement();
        }
    });
});
