import {
    getSavedWorkspaces,
    save,
    saveWorkspaceToRecent,
    save_types,
    updateWorkspaceName,
    observer as globalObserver,
} from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { MAX_STRATEGIES } from 'Constants/bot-contents';
import { button_status } from 'Constants/button-status';
import localForage from 'localforage';
import LZString from 'lz-string';
import { action, makeObservable, observable } from 'mobx';
import RootStore from './root-store';

interface ISaveModalStore {
    is_save_modal_open: boolean;
    button_status: { [key: string]: string } | number;
    bot_name: { [key: string]: string } | string;
    toggleSaveModal: () => void;
    validateBotName: (values: string) => { [key: string]: string };
    onConfirmSave: () => void;
    updateBotName: (bot_name: { [key: string]: string } | string) => void;
    setButtonStatus: (status: { [key: string]: string } | string | number) => void;
}

export default class SaveModalStore implements ISaveModalStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_save_modal_open: observable,
            button_status: observable,
            bot_name: observable,
            toggleSaveModal: action.bound,
            validateBotName: action.bound,
            onConfirmSave: action.bound,
            updateBotName: action.bound,
            onDriveConnect: action.bound,
            setButtonStatus: action.bound,
        });

        this.root_store = root_store;
    }
    is_save_modal_open = false;
    button_status = button_status.NORMAL;
    bot_name = '';

    toggleSaveModal = (): void => {
        if (!this.is_save_modal_open) {
            this.setButtonStatus(button_status.NORMAL);
        }

        this.is_save_modal_open = !this.is_save_modal_open;
    };

    validateBotName = (values: string): { [key: string]: string } => {
        const errors = {};

        if (values.bot_name.trim() === '') {
            errors.bot_name = localize('Strategy name cannot be empty');
        }

        return errors;
    };

    addStrategyToWorkspace = async (
        workspace_id: string,
        is_local: boolean,
        save_as_collection: boolean,
        bot_name: string,
        xml: string
    ) => {
        try {
            const workspace = await getSavedWorkspaces();
            const current_workspace_index = workspace.findIndex(strategy => strategy.id === workspace_id);
            const {
                load_modal: { getSaveType },
            } = this.root_store;
            const local_type = is_local ? save_types.LOCAL : save_types.GOOGLE_DRIVE;
            const save_collection = save_as_collection ? save_types.UNSAVED : local_type;
            const type = save_collection;

            const save_type = getSaveType(type)?.toLowerCase();

            const workspace_structure = {
                id: workspace_id,
                xml: Blockly.Xml.domToText(xml),
                name: bot_name,
                timestamp: Date.now(),
                save_type,
            };

            if (current_workspace_index >= 0) {
                const current_workspace = workspace_structure;
                workspace[current_workspace_index] = current_workspace;
            } else {
                workspace.push(workspace_structure);
            }

            workspace
                .sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                })
                .reverse();

            if (workspace.length > MAX_STRATEGIES) {
                workspace.pop();
            }
            const {
                load_modal: { setRecentStrategies },
            } = this.root_store;
            localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspace)));
            const updated_strategies = await getSavedWorkspaces();
            setRecentStrategies(updated_strategies);
            const {
                dashboard: { setStrategySaveType },
            } = this.root_store;
            setStrategySaveType(save_type);
        } catch (error) {
            globalObserver.emit('Error', error);
        }
    };

    async onConfirmSave({ is_local, save_as_collection, bot_name }) {
        this.setButtonStatus(button_status.LOADING);

        const { saveFile } = this.root_store.google_drive;
        const xml = Blockly.Xml.workspaceToDom(Blockly.derivWorkspace);

        xml.setAttribute('is_dbot', 'true');
        xml.setAttribute('collection', save_as_collection ? 'true' : 'false');

        if (is_local) {
            save(bot_name, save_as_collection, xml);
        } else {
            await saveFile({
                name: bot_name,
                content: Blockly.Xml.domToPrettyText(xml),
                mimeType: 'application/xml',
            });

            this.setButtonStatus(button_status.COMPLETED);
        }
        const {
            dashboard: { active_tab },
        } = this.root_store;
        const {
            load_modal: { selected_strategy_id },
        } = this.root_store;

        if (active_tab === 0) {
            const workspace_id = selected_strategy_id || Blockly.utils.genUid();
            this.addStrategyToWorkspace(workspace_id, is_local, save_as_collection, bot_name, xml);
        } else {
            saveWorkspaceToRecent(xml, is_local ? save_types.LOCAL : save_types.GOOGLE_DRIVE);
        }
        this.updateBotName(bot_name);
        this.toggleSaveModal();
    }

    updateBotName = (bot_name: { [key: string]: string } | string): void => {
        this.bot_name = bot_name;
        updateWorkspaceName();
    };

    async onDriveConnect() {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    }

    setButtonStatus = (status: { [key: string]: string } | string | number): void => {
        this.button_status = status;
    };
}
