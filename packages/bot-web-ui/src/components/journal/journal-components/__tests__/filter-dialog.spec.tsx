import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FilterDialog from '../filter-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const mockProps = {
    toggle_ref: { current: null },
    checked_filters: [],
    filters: [
        { id: 'error', label: 'Errors' },
        { id: 'notify', label: 'Notifications' },
        { id: 'success', label: 'System' },
    ],
    is_filter_dialog_visible: true,
    filterMessage: jest.fn(),
    toggleFilterDialog: jest.fn(),
};

describe('FilterDialog', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    test('should renders FilterDialog', () => {
        const { container } = render(<FilterDialog {...mockProps} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    test('should render FilterDialog with filters', () => {
        render(<FilterDialog {...mockProps} />, {
            wrapper,
        });
        const filterMessageElement = screen.getByText('Errors');
        expect(filterMessageElement).toBeInTheDocument();
    });

    test('should call toggleFilterDialog when clicking outside the dialog', () => {
        const { container } = render(<FilterDialog {...mockProps} />, { wrapper });
        userEvent.click(container);
        expect(mockProps.toggleFilterDialog).toHaveBeenCalled();
    });
});
