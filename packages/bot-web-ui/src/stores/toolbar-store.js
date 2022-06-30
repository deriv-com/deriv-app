import { action, observable, makeObservable } from 'mobx';
import { runGroupedEvents, load, config } from '@deriv/bot-skeleton';

export default class ToolbarStore {
    constructor(root_store) {
        makeObservable(this, {
            is_animation_info_modal_open: observable,
            is_dialog_open: observable,
            file_name: observable,
            has_undo_stack: observable,
            has_redo_stack: observable,
            toggleAnimationInfoModal: action.bound,
            onResetClick: action.bound,
            closeResetDialog: action.bound,
            onResetOkButtonClick: action.bound,
            onUndoClick: action.bound,
            setHasUndoStack: action.bound,
            setHasRedoStack: action.bound,
        });

        this.root_store = root_store;
    }

    is_animation_info_modal_open = false;
    is_dialog_open = false;
    file_name = config.default_file_name;
    has_undo_stack = false;
    has_redo_stack = false;

    toggleAnimationInfoModal() {
        this.is_animation_info_modal_open = !this.is_animation_info_modal_open;
    }

    onResetClick() {
        this.is_dialog_open = true;
    }

    closeResetDialog() {
        this.is_dialog_open = false;
    }

    onResetOkButtonClick() {
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
    }

    onSortClick = () => {
        Blockly.derivWorkspace.cleanUp();
    };

    onUndoClick(is_redo) {
        Blockly.Events.setGroup('undo_clicked');
        Blockly.derivWorkspace.undo(is_redo);
        Blockly.svgResize(Blockly.derivWorkspace); // Called for CommentDelete event.
        this.setHasRedoStack();
        this.setHasUndoStack();
        Blockly.Events.setGroup(false);
    }

    onZoomInOutClick = is_zoom_in => {
        const workspace = Blockly.derivWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    setHasUndoStack() {
        this.has_undo_stack = Blockly.derivWorkspace.hasUndoStack();
    }

    setHasRedoStack() {
        this.has_redo_stack = Blockly.derivWorkspace?.hasRedoStack();
    }
}
