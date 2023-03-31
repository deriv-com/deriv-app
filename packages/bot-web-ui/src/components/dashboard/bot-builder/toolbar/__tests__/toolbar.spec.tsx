import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from '..';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

describe('Toolbar component', () => {
    const mocked_props = {
        active_tab: '0',
        file_name: 'qwe',
        has_redo_stack: false,
        has_undo_stack: false,
        is_dialog_open: false,
        is_drawer_open: false,
        is_running: false,
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

    it('should render Toolbar', () => {
        render(<Toolbar {...mocked_props} />);
        expect(screen.getByTestId('dashboard__toolbar')).toBeInTheDocument();
    });
});
