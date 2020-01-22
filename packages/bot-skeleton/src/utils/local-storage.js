import DBotStore        from '../scratch/dbot-store';
import { save_types }   from '../constants/save-type';

/**
 * Save workspace to localStorage
 * @param {String} location // constants/save_types.js (unsaved, local, googledrive)
 * @param {Blockly.Events} event // Blockly event object
 */
export const saveWorkspaceToRecent = (location, event = {}) => {
    if (event.recordUndo === false) {
        return;
    }
    
    const { toolbar } = DBotStore.instance;
    const workspace_id = Blockly.derivWorkspace.id;
    const workspaces = JSON.parse(localStorage.getItem('saved_workspace')) || [];
    const current_xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
    const current_timestamp = new Date().getTime();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === `${workspace_id}_${location}`);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = toolbar.file_name;
        current_workspace.timestamp = current_timestamp;
        current_workspace.location = location;
    } else {
        const unsaved_workspace_index = workspaces.findIndex(workspace => workspace.id === `${workspace_id}_${save_types.UNSAVED}`);

        if (unsaved_workspace_index >= 0) {
            workspaces.splice(unsaved_workspace_index, 1);
        }

        workspaces.push({
            id       : `${workspace_id}_${location}`,
            timestamp: current_timestamp,
            name     : toolbar.file_name,
            xml      : current_xml,
            location,
        });
    }

    workspaces.sort((a, b) => { return new Date(a.timestamp) - new Date(b.timestamp); }).reverse();

    if (workspaces.length > 10) {
        workspaces.pop();
    }

    localStorage.setItem('saved_workspace', JSON.stringify(workspaces));
};

export const getRecentFiles = () => {
    return JSON.parse(localStorage.getItem('saved_workspace'));
};