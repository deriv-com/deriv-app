import filesaver                        from 'file-saver';
import {
    observable,
    action,
}                                       from 'mobx';
import { load }                         from '../scratch/utils';

export default class SaveLoadModalStore {

    @observable is_saveload_modal_open = false;
    @observable is_save_modal = true;
    @observable button_status = 0; // 0 - none, 1 - loading, 2 - completed

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    toggleSaveLoadModal(is_save = this.is_save_modal) {
        if (!this.is_saveload_modal_open) {
            this.setButtonStatus(0);
        }

        this.is_saveload_modal_open = !this.is_saveload_modal_open;
        this.is_save_modal = is_save;
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
        this.toggleSaveLoadModal();
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
    async onLoadClick({ is_local }) {
        
        const { onBotNameTyped } = this.root_store.toolbar;
        const { loadFile } = this.root_store.google_drive;

        if (is_local) {
            const upload = document.getElementById('files');
            upload.click();
        } else {
            const { xml_doc, file_name } = await loadFile();

            onBotNameTyped(file_name);
            load(xml_doc);
            
            this.setButtonStatus(2);
            this.toggleSaveLoadModal();
        }
    }

    @action.bound
    setButtonStatus(status) {
        this.button_status = status;
    }

    @action.bound
    handleFileChange(event) {
        this.setButtonStatus(1);
        const { onBotNameTyped } = this.root_store.toolbar;
        let files, drop_event;
        
        if (event.type === 'drop') {
            event.stopPropagation();
            event.preventDefault();

            ({ files } = event.dataTransfer);
            drop_event = event;
        } else {
            ({ files } = event.target);

            this.toggleSaveLoadModal();
        }

        files = Array.from(files);
        files.forEach(file => {
            const file_name = file.name.replace(/\.[^/.]+$/, '');

            onBotNameTyped(file_name);

            if (file.type.match('text/xml')) {
                this.readFile(file, drop_event);
            }
        });
        event.target.value = '';
    }

    // eslint-disable-next-line class-methods-use-this
    readFile(file, drop_event = {}) {
        const reader = new FileReader();
        reader.onload = e => load(e.target.result, drop_event);
        reader.readAsText(file);
    }
}
