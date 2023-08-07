import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import { useDBotStore } from 'Stores/useDBotStore';
import Toolbar from '..';

const mockDbotStore = {
    run_panel: {
        is_running: false,
    },
    save_modal: {
        toggleSaveModal: jest.fn(),
    },
    load_modal: {
        toggleLoadModal: jest.fn(),
    },
    toolbar: {
        has_redo_stack: false,
        has_undo_stack: false,
        closeResetDialog: jest.fn(),
        onResetOkButtonClick: jest.fn(),
        onResetClick: jest.fn(),
        onSortClick: jest.fn(),
        onUndoClick: jest.fn(),
        onZoomInOutClick: jest.fn(),
        is_dialog_open: false,
    },
    quick_strategy: {},
    dashboard: {},
};

jest.mock('Stores/useDBotStore', () => ({
    useDBotStore: jest.fn(() => mockDbotStore),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('Toolbar component', () => {
    beforeEach(() => {
        (useDBotStore as jest.Mock).mockReturnValue(mockDbotStore);
    });
    it('should render Toolbar', () => {
        render(<Toolbar />);
        expect(screen.getByTestId('dashboard__toolbar')).toBeInTheDocument();
    });

    it('Toolbar should renders a modal window, when the bot is running and dialog is open', () => {
        (useDBotStore as jest.Mock).mockReturnValue({
            ...mockDbotStore,
            run_panel: { ...mockDbotStore.run_panel, is_running: true },
            toolbar: { ...mockDbotStore.toolbar, is_dialog_open: true },
        });
        render(<Toolbar />);
        expect(screen.getByTestId('dashboard__toolbar')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('toolbar__dialog-text--second')).toBeInTheDocument();
    });

    it('Toolbar should renders a button, when it is mobile version', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<Toolbar />);
        expect(await screen.findByRole('button')).toBeInTheDocument();
    });
});
