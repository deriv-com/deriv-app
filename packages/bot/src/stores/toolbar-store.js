import {
    observable,
    action,
}                                       from 'mobx';
import { translate }                    from '../utils/lang/i18n';

export default class ToolbarStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_toolbox_open = true;
    @observable file_name = 'Untitled Bot';

    @action.bound
    // eslint-disable-next-line class-methods-use-this
    onRunClick() {
        // TODO
    }

    @action.bound
    onToolboxToggle() {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        toolbox.toggle();
        this.is_toolbox_open = !this.is_toolbox_open;
    }

    @action.bound
    onSearchBlur() {
        this.on_search_focus = false;
    }

    @action.bound
    onSearch({ search }) {
        if (this.is_toolbox_open) {
            this.onToolboxToggle();
        }

        Blockly.derivWorkspace.toolbox_.showSearch(search);
    }

    // eslint-disable-next-line class-methods-use-this
    onSearchClear(setValues) {
        const toolbox = Blockly.derivWorkspace.toolbox_;

        setValues({ search: '' });
        toolbox.showSearch('');
    }

    @action.bound
    onBotNameTyped(values) {
        const bot_name = values.botname;
        this.file_name = bot_name;
    }

    @action.bound
    onResetClick() {
        const workspace = Blockly.derivWorkspace;
        
        Blockly.Events.setGroup('reset');
        workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.blocksXmlStr), workspace);
        Blockly.Events.setGroup(false);

        this.file_name = translate('Untitled Bot');
    }

    @action.bound onUndoClick = () => {
        Blockly.Events.setGroup('undo');
        Blockly.derivWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    // eslint-disable-next-line class-methods-use-this
    onRedoClick() {
        Blockly.derivWorkspace.undo(true);
    }

    // eslint-disable-next-line class-methods-use-this
    onZoomInOutClick(is_zoom_in) {
        const metrics = Blockly.derivWorkspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        Blockly.derivWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    }

    // eslint-disable-next-line class-methods-use-this
    onSortClick() {
        Blockly.derivWorkspace.cleanUp();
    }
}
