import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';

const mockDbotStore = {
    toolbox: {
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
        sub_category_index: [],
    },
    flyout: {
        setVisibility: jest.fn(),
    },
    quick_strategy: {
        loadDataStrategy: jest.fn(),
    },
};

jest.mock('Stores/useDBotStore', () => ({
    useDBotStore: jest.fn(() => mockDbotStore),
}));

describe('Toolbox component', () => {
    it('should render Toolbox with content wrapper is open', () => {
        render(<Toolbox />);
        expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
        expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('db-toolbox__content-wrapper active');
    });
    it('should render Toolbox with content wrapper is open', () => {
        const setVisibility = jest.fn();
        (useDBotStore as jest.Mock).mockReturnValue({ ...mockDbotStore, flyout: { setVisibility } });
        render(<Toolbox />);
        expect(screen.getByTestId('db-toolbox__title')).toBeInTheDocument();

        userEvent.click(screen.getByTestId('db-toolbox__title'));
        expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('db-toolbox__content-wrapper active');
        expect(setVisibility).toHaveBeenCalled();
    });
    it('should not render Toolbox if it is mobile version', () => {
        render(<Toolbox />);
        if (isMobile()) {
            expect(screen.getByRole('dashboard__toolbox')).toBeEmptyDOMElement();
        }
    });
});
