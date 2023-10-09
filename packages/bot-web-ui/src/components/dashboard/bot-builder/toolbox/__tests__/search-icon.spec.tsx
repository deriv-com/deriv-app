import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SearchIcon from '../search-box/search-icon';

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
jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mocked_props = {
    search: 'text',
    is_search_loading: false,
    onClick: jest.fn(),
};

describe('SearchIcon', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    beforeEach(() => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render loader when is_search_loading is true', () => {
        const mocked_props = {
            search: 'text',
            is_search_loading: true,
            onClick: jest.fn(),
        };
        render(<SearchIcon {...mocked_props} />, { wrapper });

        const loader = screen.getByTestId('loader');
        expect(loader).toBeInTheDocument();
        expect(loader).toHaveClass('loader', { exact: true });
    });

    it('should render the SearchIcon component', () => {
        render(<SearchIcon {...mocked_props} />, { wrapper });

        const icon_element = screen.getByText('Icon');
        expect(icon_element).toBeInTheDocument();
    });

    it('should render the SearchIcon component with IcCloseCircle icon and has correct props when search value is not empty', () => {
        render(<SearchIcon {...mocked_props} />, { wrapper });

        const icon_close_circle = screen.getByText('Icon');
        expect(icon_close_circle).toBeInTheDocument();
        expect(icon_close_circle).toHaveAttribute('data-testid-color', 'secondary');
        expect(icon_close_circle).toHaveAttribute('data-testid-icon', 'IcCloseCircle');
    });

    it('should render search icon when search is empty', () => {
        render(<SearchIcon {...mocked_props} search='' />, { wrapper });

        const search_icon = screen.getByText('Icon');
        expect(search_icon).toBeInTheDocument();
        expect(search_icon).toHaveAttribute('data-testid-icon', 'IcSearch');
    });
});
