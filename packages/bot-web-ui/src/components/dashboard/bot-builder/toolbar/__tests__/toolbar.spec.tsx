import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import Toolbar from '..';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('Toolbar component', () => {
    const mocked_props = {
        active_tab: '0',
        file_name: 'qwe',
        has_redo_stack: false,
        has_undo_stack: false,
        is_drawer_open: false,
        is_stop_button_disabled: false,
        is_stop_button_visible: false,
        closeResetDialog: jest.fn(),
        onOkButtonClick: jest.fn(),
        onResetClick: jest.fn(),
        onRunButtonClick: jest.fn(),
        onSortClick: jest.fn(),
        onUndoClick: jest.fn(),
        onZoomInOutClick: jest.fn(),
        toggleSaveLoadModal: jest.fn(),
        toggleLoadModal: jest.fn(),
        toggleSaveModal: jest.fn(),
    };

    beforeEach(() => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        jest.clearAllMocks();
    });

    it('should render Toolbar', () => {
        render(<Toolbar {...mocked_props} is_running={false} is_dialog_open={false} />);
        expect(screen.getByTestId('dashboard__toolbar')).toBeInTheDocument();
    });

    it('Toolbar should renders a modal window, when the bot is running and dialog is open', () => {
        render(<Toolbar {...mocked_props} is_running={true} is_dialog_open={true} />);
        expect(screen.getByTestId('dashboard__toolbar')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('toolbar__dialog-text--second')).toBeInTheDocument();
    });

    it('Toolbar should renders a button, when it is mobile version', async () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        render(<Toolbar {...mocked_props} is_running={false} is_dialog_open={false} />);
        expect(await screen.findByRole('button')).toBeInTheDocument();
    });
});
