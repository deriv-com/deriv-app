import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import WorkspaceControl from '../workspace-control';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('WorkspaceControl', () => {
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

    it('should render LocalFooter', () => {
        const { container } = render(<WorkspaceControl />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should show zoom in icon', async () => {
        render(<WorkspaceControl />, { wrapper });
        const zoom_in_icon = screen.getByTestId('zoom-in');
        expect(zoom_in_icon).toBeInTheDocument();
    });

    it('should show zoom out icon', async () => {
        render(<WorkspaceControl />, { wrapper });
        const zoom_out_icon = screen.getByTestId('zoom-out');
        expect(zoom_out_icon).toBeInTheDocument();
    });

    it('should call onZoomInOutClick when zoom in icon is clicked', async () => {
        const onZoomInOutClick = jest.fn();
        render(<WorkspaceControl mockZoomInOut={onZoomInOutClick} />, { wrapper });
        const zoom_icon = screen.getByTestId('zoom-in');
        userEvent.click(zoom_icon);
        expect(onZoomInOutClick).toHaveBeenCalledWith(true);
    });

    it('should call onZoomInOutClick when zoom out icon is clicked', async () => {
        const onZoomInOutClick = jest.fn();
        render(<WorkspaceControl mockZoomInOut={onZoomInOutClick} />, { wrapper });
        const zoom_icon = screen.getByTestId('zoom-out');
        userEvent.click(zoom_icon);
        expect(onZoomInOutClick).toHaveBeenCalledWith(false);
    });
});
