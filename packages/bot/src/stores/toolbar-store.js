import {
    observable,
    action }           from 'mobx';
import { localize }    from '@deriv/translations';
import { tabs_title }  from '../constants/bot-contents';
import {
    scrollWorkspace,
    runGroupedEvents } from '../scratch/utils';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_dialog_open    = false;
    @observable is_toolbox_open   = false;
    @observable is_search_focus   = false;
    @observable is_search_loading = false;
    @observable file_name         = localize('Untitled Bot');
    @observable has_undo_stack    = false;
    @observable has_redo_stack    = false;
    
    typing_timer;

    @action.bound
    onToolboxToggle() {
        const workspace        = Blockly.derivWorkspace;
        const toolbox          = workspace.getToolbox();
        this.is_toolbox_open   = !this.is_toolbox_open;
        const { main_content } = this.root_store;

        if (main_content.active_tab !== tabs_title.WORKSPACE) {
            main_content.setActiveTab(tabs_title.WORKSPACE);
        }

        toolbox.toggle();
        if (this.is_toolbox_open) {
            const toolbox_width     = toolbox.HtmlDiv.clientWidth;
            const block_canvas_rect = workspace.svgBlockCanvas_.getBoundingClientRect(); // eslint-disable-line

            if (block_canvas_rect.left < toolbox_width) {
                const scroll_distance = toolbox_width - block_canvas_rect.left + toolbox.width;
                scrollWorkspace(workspace, scroll_distance, true, false);
            }
            this.root_store.core.gtm.pushDataLayer({ event: 'dbot_toolbox_visible', value: true });
        }

    }

    @action.bound
    onSearchKeyUp(submitForm) {
        const typing_interval = 1000;
        this.is_search_loading = true;

        clearTimeout(this.typing_timer);
        this.typing_timer = setTimeout(action(() => {
            submitForm();
            this.is_search_loading = false;
        }), typing_interval);
    }

    @action.bound
    onSearch({ search }) {
        if (this.is_toolbox_open && search !== '') {
            this.onToolboxToggle();
        }

        const toolbox = Blockly.derivWorkspace.getToolbox();
        toolbox.showSearch(search);
    }

    @action.bound
    onSearchBlur() {
        this.is_search_focus = false;
    }

    onSearchClear = (setFieldValue) => {
        const toolbox = Blockly.derivWorkspace.getToolbox();
        setFieldValue('search', '');
        toolbox.showSearch('');
    }

    @action.bound
    onBotNameTyped(bot_name) {
        this.file_name = bot_name;
    }

    @action.bound
    onResetClick() {
        this.is_dialog_open = true;
    }

    @action.bound
    onResetCancelButtonClick() {
        this.is_dialog_open = false;
    }

    @action.bound
    onResetOkButtonClick() {
        const workspace = Blockly.derivWorkspace;

        runGroupedEvents(false, () => {
            workspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
        }, 'reset');

        this.file_name      = localize('Untitled Bot');
        this.is_dialog_open = false;
    }

    onSortClick = () => {
        Blockly.derivWorkspace.cleanUp();
    }

    @action.bound
    onUndoClick(is_redo) {
        Blockly.derivWorkspace.undo(is_redo);
        Blockly.svgResize(Blockly.derivWorkspace); // Called for CommentDelete event.
        this.setHasRedoStack();
        this.setHasUndoStack();
    }

    onZoomInOutClick = (is_zoom_in) => {
        const workspace = Blockly.derivWorkspace;
        const metrics   = workspace.getMetrics();
        const addition  = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    @action.bound
    setHasUndoStack() {
        this.has_undo_stack = Blockly.derivWorkspace.hasUndoStack();
    }

    @action.bound
    setHasRedoStack() {
        this.has_redo_stack = Blockly.derivWorkspace.hasRedoStack();
    }
}
