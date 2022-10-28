import { action, observable } from 'mobx';
import { runGroupedEvents, load, config } from '@deriv/bot-skeleton';
import RootStore from './root-store';

interface IToolbarStore {
    is_animation_info_modal_open: boolean;
    is_dialog_open: boolean;
    file_name: { [key: string]: string };
    has_undo_stack: boolean;
    has_redo_stack: boolean;
    toggleAnimationInfoModal: () => void;
    onResetClick: () => void;
    closeResetDialog: () => void;
    onResetOkButtonClick: () => void;
    onSortClick: () => void;
    onUndoClick: (is_redo: boolean) => void;
    onZoomInOutClick: (is_zoom_in: boolean) => void;
    setHasUndoStack: () => void;
    setHasRedoStack: () => void;
}

export default class ToolbarStore implements IToolbarStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable is_animation_info_modal_open = false;
    @observable is_dialog_open = false;
    @observable file_name = config.default_file_name;
    @observable has_undo_stack = false;
    @observable has_redo_stack = false;

    @action.bound
    toggleAnimationInfoModal = (): void => {
        this.is_animation_info_modal_open = !this.is_animation_info_modal_open;
    };

    @action.bound
    onResetClick = (): void => {
        this.is_dialog_open = true;
    };

    @action.bound
    closeResetDialog = (): void => {
        this.is_dialog_open = false;
    };

    @action.bound
    onResetOkButtonClick = (): void => {
        runGroupedEvents(
            false,
            () => {
                const workspace = Blockly.derivWorkspace;
                workspace.current_strategy_id = Blockly.utils.genUid();
                load({
                    block_string: workspace.cached_xml.main,
                    file_name: config.default_file_name,
                    workspace,
                });
            },
            'reset'
        );
        this.is_dialog_open = false;

        const { run_panel } = this.root_store;
        if (run_panel.is_running) {
            this.root_store.run_panel.stopBot();
        }
    };

    onSortClick = () => {
        Blockly.derivWorkspace.cleanUp();
    };

    @action.bound
    onUndoClick = (is_redo: boolean): void => {
        Blockly.Events.setGroup('undo_clicked');
        Blockly.derivWorkspace.undo(is_redo);
        Blockly.svgResize(Blockly.derivWorkspace); // Called for CommentDelete event.
        this.setHasRedoStack();
        this.setHasUndoStack();
        Blockly.Events.setGroup(false);
    };

    onZoomInOutClick = (is_zoom_in: boolean): void => {
        const workspace = Blockly.derivWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    @action.bound
    setHasUndoStack = (): void => {
        this.has_undo_stack = Blockly.derivWorkspace?.hasUndoStack();
    };

    @action.bound
    setHasRedoStack = (): void => {
        this.has_redo_stack = Blockly.derivWorkspace?.hasRedoStack();
    };
}
