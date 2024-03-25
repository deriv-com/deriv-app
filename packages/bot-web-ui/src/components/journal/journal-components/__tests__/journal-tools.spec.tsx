import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import JournalTools from '../journal-tools';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockProps = {
    toggle_ref: { current: null },
    checked_filters: { error: ['test error'], notify: ['test notify'], success: ['test success'] },
    filters: [
        { id: 'error', label: 'Errors' },
        { id: 'notify', label: 'Notifications' },
        { id: 'success', label: 'System' },
    ],
    is_filter_dialog_visible: true,
    filterMessage: jest.fn(),
    toggleFilterDialog: jest.fn(),
};

describe('JournalTools', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    test('should renders JournalTools', () => {
        const { container } = render(<JournalTools {...mockProps} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    test('should renders filter options that is passed as prop', () => {
        render(<JournalTools {...mockProps} />, {
            wrapper,
        });
        expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
});
