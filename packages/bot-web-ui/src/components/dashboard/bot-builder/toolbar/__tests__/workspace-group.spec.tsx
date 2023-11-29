import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import WorkspaceGroup from '../workspace-group';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

describe('WorkspaceGroup', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_props = {
        has_redo_stack: true,
        has_undo_stack: true,
        onResetClick: jest.fn(),
        onSortClick: jest.fn(),
        onUndoClick: jest.fn(),
        onZoomInOutClick: jest.fn(),
        toggleLoadModal: jest.fn(),
        toggleSaveModal: jest.fn(),
    };

    beforeAll(() => {
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

    it('should render WorkspaceGroup', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        expect(screen.getByTestId('dt_toolbar_group_btn')).toBeInTheDocument();
    });

    it('should call reset function on clicking reset icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const reset_button = screen.getByTestId('dt_toolbar_reset_button');
        userEvent.click(reset_button);
        expect(mock_props.onResetClick).toBeCalledTimes(1);
    });

    it('should call toggleLoadModal function on clicking import icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const import_button = screen.getByTestId('dt_toolbar_import_button');
        userEvent.click(import_button);
        expect(mock_props.toggleLoadModal).toBeCalledTimes(1);
    });

    it('should call toggleSaveModal function on clicking save icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const save_button = screen.getByTestId('dt_toolbar_save_button');
        userEvent.click(save_button);
        expect(mock_props.toggleSaveModal).toBeCalledTimes(1);
    });

    it('should call onSortClick function on clicking sort icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const sort_button = screen.getByTestId('dt_toolbar_sort_button');
        userEvent.click(sort_button);
        expect(mock_props.onSortClick).toBeCalledTimes(1);
    });

    it('should call onUndoClick function with false on clicking undo icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const undo_button = screen.getByTestId('dt_toolbar_undo_button');
        userEvent.click(undo_button);
        expect(mock_props.onUndoClick).toBeCalledWith(false);
    });

    it('should call onUndoClick function with true on clicking redo icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const undo_button = screen.getByTestId('dt_toolbar_redo_button');
        userEvent.click(undo_button);
        expect(mock_props.onUndoClick).toBeCalledWith(true);
    });

    it('should call onZoomInOutClick function with true on clicking zoomIn icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const zoom_button = screen.getByTestId('dt_toolbar_zoom_in_button');
        userEvent.click(zoom_button);
        expect(mock_props.onZoomInOutClick).toBeCalledWith(true);
    });

    it('should call onZoomInOutClick function with false on clicking zoomOut icon', () => {
        render(<WorkspaceGroup {...mock_props} />, {
            wrapper,
        });
        const zoom_button = screen.getByTestId('dt_toolbar_zoom_out_button');
        userEvent.click(zoom_button);
        expect(mock_props.onZoomInOutClick).toBeCalledWith(false);
    });
});
