import filesaver            from 'file-saver';
import {
    observable,
    action,
}                           from 'mobx';
import {
    saveWorkspaceToLocal,
}                           from '../scratch/utils';
import { save_types }       from '../constants/save-type';

export default class SaveModalStore {

    @observable is_save_modal_open = false;
    @observable button_status = 0; // 0 - none, 1 - loading, 2 - completed

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    toggleSaveModal() {
        if (!this.is_save_modal_open) {
            this.setButtonStatus(0);
        }

        this.is_save_modal_open = !this.is_save_modal_open;
    }

    @action.bound
    async onConfirmSave({ is_local, save_as_collection }) {
        this.setButtonStatus(1);
        
        const { file_name } = this.root_store.toolbar;
        const { saveFile } = this.root_store.google_drive;
        const xml = Blockly.Xml.workspaceToDom(Blockly.derivWorkspace);

        xml.setAttribute('is_dbot', 'true');
        xml.setAttribute('collection', save_as_collection ? 'true' : 'false');

        if (is_local) {
            const data = Blockly.Xml.domToPrettyText(xml);
            const blob = new Blob([data], { type: 'text/xml;charset=utf-8' });

            filesaver.saveAs(blob, `${file_name}.xml`);
        } else {
            await saveFile({
                name    : file_name,
                content : Blockly.Xml.domToPrettyText(xml),
                mimeType: 'application/xml',
            });

            this.setButtonStatus(2);
        }
        saveWorkspaceToLocal(is_local ? save_types.LOCAL : save_types.GOOGLE_DRIVE);
        this.toggleSaveModal();
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
