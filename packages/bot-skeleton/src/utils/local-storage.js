import LZString from 'lz-string';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

/**
 * Save workspace to localStorage
 * @param {String} save_type // constants/save_types.js (unsaved, local, googledrive)
 * @param {Blockly.Events} event // Blockly event object
 */
export const saveWorkspaceToRecent = (xml, save_type = save_types.UNSAVED) => {
    // Ensure strategies don't go through expensive conversion.
    xml.setAttribute('is_dbot', true);

    const { save_modal } = DBotStore.instance;
    const workspace_id = Blockly.derivWorkspace.current_strategy_id || Blockly.utils.genUid();
    const workspaces = getSavedWorkspaces();
    const current_xml = Blockly.Xml.domToText(xml);
    const current_timestamp = Date.now();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = save_modal.bot_name;
        current_workspace.timestamp = current_timestamp;
        current_workspace.save_type = save_type;
    } else {
        workspaces.push({
            id: workspace_id,
            timestamp: current_timestamp,
            name: save_modal.bot_name,
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

    localStorage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};

export const getSavedWorkspaces = () => {
    try {
        return JSON.parse(LZString.decompress(localStorage.getItem('saved_workspaces'))) || [];
    } catch (e) {
        return [];
    }
};

export const removeExistingWorkspace = workspace_id => {
    const workspaces = getSavedWorkspaces();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        workspaces.splice(current_workspace_index, 1);
    }

    localStorage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};
