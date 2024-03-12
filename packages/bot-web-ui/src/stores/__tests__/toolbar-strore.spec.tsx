import { mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { mock_ws } from 'Utils/mock';
import { mockDBotStore } from 'Stores/useDBotStore';
import ToolbarStore from '../toolbar-store';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    onWorkspaceResize: jest.fn(),
}));

window.Blockly = {
    derivWorkspace: {
        current_strategy_id: {
            utils: {
                genUid: jest.fn(),
            },
        },
        getAllBlocks: jest.fn(() => ({
            find: jest.fn(),
        })),
    },
    utils: {
        genUid: jest.fn(),
    },
    Events: () => ({}),
    svgResize: jest.fn(),
};

describe('ToolbarStore', () => {
    const mock_store: TStores = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
    let toolbarStore: ToolbarStore;

    beforeEach(() => {
        toolbarStore = new ToolbarStore(mock_DBot_store);
    });

    it('should initialize correctly', () => {
        expect(toolbarStore.is_animation_info_modal_open).toBe(false);
        expect(toolbarStore.is_dialog_open).toBe(false);
        expect(toolbarStore.file_name).toBe('Untitled Bot');
        expect(toolbarStore.has_undo_stack).toBe(false);
        expect(toolbarStore.has_redo_stack).toBe(false);
        expect(toolbarStore.is_reset_button_clicked).toBe(false);
    });

    it('should show dialog on reset button click', () => {
        toolbarStore.onResetClick();
        expect(toolbarStore.is_dialog_open).toBe(true);
    });

    it('should hide dialog on close reset dialog click', () => {
        toolbarStore.closeResetDialog();
        expect(toolbarStore.is_dialog_open).toBe(false);
    });
});
