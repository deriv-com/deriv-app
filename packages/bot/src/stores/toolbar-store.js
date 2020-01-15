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

    @observable is_dialog_open     = false;
    @observable is_toolbox_open    = false;
    @observable is_search_focus    = false;
    @observable is_search_loading  = false;
    @observable is_toolbox_loading = false;
    @observable has_undo_stack     = false;
    @observable has_redo_stack     = false;
    @observable file_name          = localize('Untitled Bot');

    typing_timer;

    @action.bound
    async initToolbox() {
        const workspace = Blockly.derivWorkspace;
        const toolbox   = workspace.getToolbox();

        if (!toolbox.is_chunk_loaded) {
            this.setIsToolboxLoading(true);
            await toolbox.loadChunk();
            this.setIsToolboxLoading(false);
        }

        return true;
    }

    @action.bound
    setIsToolboxLoading(is_loading) {
        this.is_toolbox_loading = is_loading;
    }

    @action.bound
    async onToolboxToggle() {
        const workspace        = Blockly.derivWorkspace;
        const toolbox          = workspace.getToolbox();

        await this.initToolbox();
        
        const { main_content } = this.root_store;

        if (main_content.active_tab !== tabs_title.WORKSPACE) {
            main_content.setActiveTab(tabs_title.WORKSPACE);
        }

        // Bump workspace if the toolbox is going to be open and overlaps blocks.
        if (!this.is_toolbox_open) {
            const toolbox_width     = toolbox.HtmlDiv.clientWidth;
            const block_canvas_rect = workspace.svgBlockCanvas_.getBoundingClientRect(); // eslint-disable-line

            if (block_canvas_rect.left < toolbox_width) {
                const scroll_distance = toolbox_width - block_canvas_rect.left + toolbox.width;
                scrollWorkspace(workspace, scroll_distance, true, false);
            }
            this.root_store.core.gtm.pushDataLayer({ event: 'dbot_toolbox_visible', value: true });
        }

        this.is_toolbox_open = !this.is_toolbox_open;
        toolbox.toggle();
    }

    @action.bound
    async onSearchKeyUp(submitForm) {
        const typing_interval = 1000;
        this.is_search_loading = true;

        clearTimeout(this.typing_timer);
        this.typing_timer = setTimeout(action(() => {
            submitForm();
            this.is_search_loading = false;
        }), typing_interval);
    }

    @action.bound
    async onSearch({ search }) {
        const workspace = Blockly.derivWorkspace;
        const toolbox   = workspace.getToolbox();

        await this.initToolbox();

        if (this.is_toolbox_open && search !== '') {
            this.onToolboxToggle();
        }

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
