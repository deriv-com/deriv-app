import DBotStore from '../scratch/dbot-store';

/**
 * Save workspace to localStorage
 * @param {String} save_type // constants/save_types.js (unsaved, local, googledrive)
 * @param {Blockly.Events} event // Blockly event object
 */
export const saveWorkspaceToRecent = (save_type, event = {}) => {
    if (event.recordUndo === false || event.group === 'load_collections') {
        return;
    }

    const { toolbar } = DBotStore.instance;
    const workspace_id = Blockly.derivWorkspace.current_strategy_id || Blockly.utils.genUid();
    const workspaces = JSON.parse(localStorage.getItem('saved_workspaces')) || [];
    const current_xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
    const current_timestamp = Date.now();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = toolbar.file_name;
        current_workspace.timestamp = current_timestamp;
        current_workspace.save_type = save_type;
    } else {
        workspaces.push({
            id: workspace_id,
            timestamp: current_timestamp,
            name: toolbar.file_name,
            xml: current_xml,
            save_type,
        });
    }

    workspaces
        .sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        })
        .reverse();

    if (workspaces.length > 10) {
        workspaces.pop();
    }

    localStorage.setItem('saved_workspaces', JSON.stringify(workspaces));
};

export const getSavedWorkspaces = () => {
    return JSON.parse(localStorage.getItem('saved_workspaces'));
};

export const removeExistingWorkspace = workspace_id => {
    const workspaces = JSON.parse(localStorage.getItem('saved_workspaces')) || [];
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        workspaces.splice(current_workspace_index, 1);
    }

    localStorage.setItem('saved_workspaces', JSON.stringify(workspaces));
};
