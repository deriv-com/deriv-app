import React from 'react';
import { useStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    quick_strategy: {
        setFormVisibility: jest.fn(),
    },
    dashboard: {},
};

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
jest.mock('Stores/useDBotStore', () => ({
    useDBotStore: jest.fn(() => mockDbotStore),
}));

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
    useStore: jest.fn(() => ({
        ui: {
            is_mobile: false,
        },
    })),
}));

describe('Toolbar component', () => {
    beforeEach(() => {
        (useDBotStore as jest.Mock).mockReturnValue(mockDbotStore);
    });
    it('should render Toolbar', () => {
        render(<Toolbar />);
        expect(screen.getByTestId('dt_dashboard_toolbar')).toBeInTheDocument();
    });

    it('Toolbar should renders a modal window, when the bot is running and dialog is open', () => {
        (useDBotStore as jest.Mock).mockReturnValue({
            ...mockDbotStore,
            run_panel: { ...mockDbotStore.run_panel, is_running: true },
            toolbar: { ...mockDbotStore.toolbar, is_dialog_open: true },
        });
        render(<Toolbar />);
        expect(screen.getByTestId('dt_dashboard_toolbar')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('dt_toolbar_dialog_text_second')).toBeInTheDocument();
    });

    it('Toolbar should renders a button, when it is mobile version', async () => {
        (useStore as jest.Mock).mockReturnValue({
            ui: {
                is_mobile: true,
            },
        });
        render(<Toolbar />);
        expect(await screen.findByRole('button')).toBeInTheDocument();
    });

    it('Toolbar should render Quick strategy form on toolbar button click and when it is mobile version', () => {
        (useStore as jest.Mock).mockReturnValue({
            ui: {
                is_mobile: true,
            },
        });
        render(<Toolbar />);
        const quick_strategy_button = screen.getByText('Quick strategy');
        userEvent.click(quick_strategy_button);
        expect(mockDbotStore?.quick_strategy.setFormVisibility).toHaveBeenCalledWith(true);
    });
});
