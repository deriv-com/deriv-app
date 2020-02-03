import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

/**
 * Save workspace to localStorage
 * @param {String} save_type // constants/save_types.js (unsaved, local, googledrive)
 * @param {Blockly.Events} event // Blockly event object
 */
export const saveWorkspaceToRecent = (save_type, event = {}) => {
    if (event.recordUndo === false) {
        return;
    }

    const { toolbar } = DBotStore.instance;
    const workspace_id = Blockly.derivWorkspace.id;
    const workspaces = JSON.parse(localStorage.getItem('saved_workspaces')) || [];
    const current_xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
    const current_timestamp = Date.now();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === `${workspace_id}_${save_type}`);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = toolbar.file_name;
        current_workspace.timestamp = current_timestamp;
        current_workspace.save_type = save_type;
    } else {
        const unsaved_workspace_index = workspaces.findIndex(
            workspace => workspace.id === `${workspace_id}_${save_types.UNSAVED}`
        );

        if (unsaved_workspace_index >= 0) {
            workspaces.splice(unsaved_workspace_index, 1);
        }

        workspaces.push({
            id: `${workspace_id}_${save_type}`,
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
