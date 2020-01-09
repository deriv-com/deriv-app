import {
    observable,
    action }               from 'mobx';
import { localize }        from '@deriv/translations';
import { tabs_title }      from '../constants/bot-contents';
import { scrollWorkspace } from '../scratch/utils';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_dialog_open = false;
    @observable is_toolbox_open = false;
    @observable is_search_loading = false;
    @observable is_toolbox_loading = false;
    @observable is_search_focus = false;
    @observable file_name = localize('Untitled Bot');

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
        const workspace = Blockly.derivWorkspace;
        const toolbox   = workspace.getToolbox();

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
        // eslint-disable-next-line no-underscore-dangle
        const toolbox = Blockly.derivWorkspace.toolbox_;

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
        Blockly.Events.setGroup('reset');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.cached_xml.main), workspace);
        Blockly.Events.setGroup(false);
        this.file_name = localize('Untitled Bot');
        this.is_dialog_open = false;
    }

    @action.bound
    onUndoClick = () => {
        Blockly.Events.setGroup('undo');
        Blockly.derivWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    onRedoClick = () => {
        Blockly.derivWorkspace.undo(true);
    }

    onZoomInOutClick = (is_zoom_in) => {
        const metrics = Blockly.derivWorkspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    onSortClick = () => {
        Blockly.derivWorkspace.cleanUp();
    }
}
