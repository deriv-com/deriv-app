import {
    observable,
    action }                 from 'mobx';
import { localize }          from 'deriv-translations';
import { scrollWorkspace }   from '../scratch/utils';
import { delayCallbackByMs } from '../utils/tools';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_dialog_open = false;
    @observable is_toolbox_open = false;
    @observable is_search_loading = false;
    @observable file_name = localize('Untitled Bot');

    @action.bound
    onRunClick() {
        this.root_store.run_panel.onRunButtonClick();
    }

    @action.bound
    onStopClick() {
        this.root_store.run_panel.onStopButtonClick();
    }

    @action.bound
    onToolboxToggle() {
        const workspace      = Blockly.derivWorkspace;
        const toolbox        = workspace.toolbox_; // eslint-disable-line
        this.is_toolbox_open = !this.is_toolbox_open;

        toolbox.toggle();

        if (this.is_toolbox_open) {
            const toolbox_width     = toolbox.HtmlDiv.clientWidth;
            const block_canvas_rect = workspace.svgBlockCanvas_.getBoundingClientRect(); // eslint-disable-line
            
            if (block_canvas_rect.left < toolbox_width) {
                const scroll_distance = toolbox_width - block_canvas_rect.left + toolbox.width;
                scrollWorkspace(workspace, scroll_distance, true, false);
            }
        }
    }

    @action.bound
    onSearchKeyUp(submitForm) {
        this.is_search_loading = true;
        delayCallbackByMs(submitForm, 1000).then(action(timer => {
            clearTimeout(timer);
            this.is_search_loading = false;
        }));
    }

    @action.bound
    onSearchBlur() {
        this.on_search_focus = false;
    }

    @action.bound
    onSearch({ search }) {
        if (this.is_toolbox_open && search !== '') {
            this.onToolboxToggle();
        }

        // eslint-disable-next-line no-underscore-dangle
        Blockly.derivWorkspace.toolbox_.showSearch(search);
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
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
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
