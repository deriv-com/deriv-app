import {
    observable,
    action,
} from 'mobx';
import { translate } from '../utils/lang/i18n';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_dialog_open = false;
    @observable is_toolbox_open = false;
    @observable file_name = translate('Untitled Bot');

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
        // eslint-disable-next-line no-underscore-dangle
        const toolbox = Blockly.derivWorkspace.toolbox_;
        this.is_toolbox_open = !this.is_toolbox_open;

        // Scroll workspace so toolbox doesn't overlap
        const ws_metrics       = Blockly.derivWorkspace.getMetrics();
        const current_scroll_x = ws_metrics.viewLeft - ws_metrics.contentLeft;
        const current_scroll_y = ws_metrics.viewTop - ws_metrics.contentTop;
        const new_scroll_x     = current_scroll_x + (!this.is_toolbox_open ? toolbox.HtmlDiv.clientWidth : -toolbox.HtmlDiv.clientWidth);

        Blockly.derivWorkspace.scrollbar.set(new_scroll_x, current_scroll_y);
        toolbox.toggle();
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
        this.file_name = translate('Untitled Bot');
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
