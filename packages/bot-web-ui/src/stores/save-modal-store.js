import { observable, action } from 'mobx';
import { localize } from '@deriv/translations';
import { saveWorkspaceToRecent, save_types, save, updateWorkspaceName } from '@deriv/bot-skeleton';
import { button_status } from 'Constants/button-status';

export default class SaveModalStore {
    @observable is_save_modal_open = false;
    @observable button_status = button_status.NORMAL;
    @observable bot_name;

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    toggleSaveModal() {
        if (!this.is_save_modal_open) {
            this.setButtonStatus(button_status.NORMAL);
        }

        this.is_save_modal_open = !this.is_save_modal_open;
    }

    validateBotName = values => {
        const errors = {};

        if (values.bot_name.trim() === '') {
            errors.bot_name = localize('Strategy name cannot be empty');
        }

        return errors;
    };

    @action.bound
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

        this.updateBotName(bot_name);
        saveWorkspaceToRecent(xml, is_local ? save_types.LOCAL : save_types.GOOGLE_DRIVE);
        this.toggleSaveModal();
    }

    @action.bound
    updateBotName(bot_name) {
        this.bot_name = bot_name;
        updateWorkspaceName();
    }

    @action.bound
    async onDriveConnect() {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    }

    @action.bound
    setButtonStatus(status) {
        this.button_status = status;
    }
}
