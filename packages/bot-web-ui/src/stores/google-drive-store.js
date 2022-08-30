import { observable, action, makeObservable } from 'mobx';
import { localize, getLanguage } from '@deriv/translations';
import { importExternal, config } from '@deriv/bot-skeleton';
import { button_status } from 'Constants/button-status';

export default class GoogleDriveStore {
    constructor(root_store) {
        makeObservable(this, {
            is_authorised: observable,
            updateSigninStatus: action.bound,
            saveFile: action.bound,
            loadFile: action.bound,
        });

        this.root_store = root_store;
        this.bot_folder_name = `Binary Bot - ${localize('Strategies')}`;
        this.google_auth = null;
        this.setKey();

        importExternal('https://apis.google.com/js/api.js').then(() => this.initialise());
    }

    is_authorised = false;

    setKey = () => {
        const { aid, cid, api } = config.gd;
        this.client_id = cid;
        this.app_id = aid;
        this.api_key = api;
    };

    initialise() {
        gapi.load('client:auth2:picker', {
            callback: () => {
                gapi.client
                    .init({
                        apiKey: this.api_key,
                        clientId: this.client_id,
                        scope: 'https://www.googleapis.com/auth/drive.file',
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                    })
                    .then(
                        () => {
                            this.google_auth = gapi.auth2.getAuthInstance();
                            this.google_auth.isSignedIn.listen(is_signed_in => this.updateSigninStatus(is_signed_in));
                            this.updateSigninStatus(this.google_auth.isSignedIn.get());
                        },
                        error => {
                            // TODO
                            console.warn(error); // eslint-disable-line
                        }
                    );
            },
            onerror: console.warn, // eslint-disable-line
        });
    }

    updateSigninStatus(is_signed_in) {
        this.is_authorised = is_signed_in;
    }

    signIn() {
        if (this.is_authorised) {
            return Promise.resolve();
        }

        return this.google_auth.signIn({ prompt: 'select_account' }).catch(response => {
            if (response.error === 'access_denied') {
                // TODO
                console.error('Please grant permission to view and manage Google Drive folders created with Deriv Bot'); // eslint-disable-line
            }
        });
    }

    signOut() {
        if (!this.is_authorised) {
            return Promise.resolve();
        }

        return this.google_auth.signOut();
    }

    // eslint-disable-next-line class-methods-use-this
    getPickerLanguage() {
        const language = getLanguage();

        if (language === 'zhTw') {
            return 'zh-TW';
        } else if (language === 'zhCn') {
            return 'zh-CN';
        }
        return language;
    }

    async saveFile(options) {
        await this.signIn();
        await this.checkFolderExists();
        await this.createSaveFilePicker('application/vnd.google-apps.folder', localize('Select a folder'), options);
    }

    async loadFile() {
        await this.signIn();
        const xml_doc = await this.createLoadFilePicker(
            ['text/xml', 'application/xml'],
            localize('Select a Deriv Bot Strategy')
        );

        return xml_doc;
    }

    async checkFolderExists() {
        const { files } = gapi.client.drive;
        const response = await files.list({ q: 'trashed=false' });
        const mime_type = 'application/vnd.google-apps.folder';
        const folder = response.result.files.find(file => file.mimeType === mime_type);

        if (folder) {
            return;
        }

        await files.create({
            resource: {
                name: this.bot_folder_name,
                mimeType: mime_type,
                fields: 'id',
            },
        });
    }

    createSaveFilePicker(mime_type, title, options) {
        const { setButtonStatus } = this.root_store.save_modal;
        return new Promise(resolve => {
            const savePickerCallback = data => {
                if (data.action === google.picker.Action.PICKED) {
                    const folder_id = data.docs[0].id;
                    const strategy_file = new Blob([options.content], { type: options.mimeType });
                    const strategy_file_metadata = JSON.stringify({
                        name: options.name,
                        mimeType: options.mimeType,
                        parents: [folder_id],
                    });

                    const form_data = new FormData();
                    form_data.append('metadata', new Blob([strategy_file_metadata], { type: 'application/json' }));
                    form_data.append('file', strategy_file);

                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'json';
                    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
                    xhr.setRequestHeader('Authorization', `Bearer ${gapi.auth.getToken().access_token}`);
                    xhr.onload = () => {
                        if (xhr.status === 401) {
                            this.signOut();
                        }

                        setButtonStatus(button_status.NORMAL);
                        resolve();
                    };
                    xhr.send(form_data);
                } else if (data.action === google.picker.Action.CANCEL) {
                    setButtonStatus(button_status.NORMAL);
                }
            };

            this.showGoogleDriveFilePicker(true, mime_type, title, savePickerCallback);
        });
    }

    createLoadFilePicker(mime_type, title) {
        return new Promise(resolve => {
            const loadPickerCallback = async data => {
                if (data.action === google.picker.Action.PICKED) {
                    const file = data.docs[0];
                    const file_name = file.name;
                    const fileId = file.id;
                    const { files } = gapi.client.drive;

                    const response = await files.get({
                        alt: 'media',
                        fileId,
                        mimeType: 'text/plain',
                    });

                    resolve({ xml_doc: response.body, file_name });
                }
            };

            this.showGoogleDriveFilePicker(false, mime_type, title, loadPickerCallback);
        });
    }

    showGoogleDriveFilePicker(is_save, mime_type, title, callback) {
        const docs_view = new google.picker.DocsView();
        docs_view.setIncludeFolders(true);
        docs_view.setMimeTypes(mime_type);

        if (is_save) {
            docs_view.setSelectFolderEnabled(true);
        }
        const picker = new google.picker.PickerBuilder();
        picker
            .setOrigin(`${window.location.protocol}//${window.location.host}`)
            .setTitle(localize(title))
            .setLocale(this.getPickerLanguage())
            .setAppId(this.app_id)
            .setOAuthToken(gapi.auth.getToken().access_token)
            .addView(docs_view)
            .setDeveloperKey(this.api_key)
            .setSize(1051, 650)
            .setCallback(callback)
            .build()
            .setVisible(true);
    }
}
