import {
    observable,
    action,
}                           from 'mobx';
import config               from '../constants';
import { getLanguage }      from '../utils/lang/lang';
import { translate }        from '../utils/lang/i18n';
import { importExternal }   from '../utils/tools';

export default class GoogleDriveStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.bot_folder_name = `Binary Bot - ${translate('Strategies')}`;
        this.google_auth = null;
        this.setKey();
        
        importExternal('https://apis.google.com/js/api.js')
            .then(() => this.initialise());
    }

    @observable is_authorised = false;

    setKey = () => {
        const { aid, cid, api } = config.gd;
        this.client_id = cid;
        this.app_id = aid;
        this.api_key = api;
    }

    initialise() {
        gapi.load('client:auth2:picker', {
            callback: () => {
                gapi.client
                    .init({
                        apiKey       : this.api_key,
                        clientId     : this.client_id,
                        scope        : 'https://www.googleapis.com/auth/drive',
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
                            console.error(error); // eslint-disable-line
                        }
                    );
            },
            onerror: console.error, // eslint-disable-line
        });
    }

    @action.bound
    updateSigninStatus(is_signed_in) {
        this.is_authorised = is_signed_in;
    }
    
    @action.bound
    signIn() {
        if (this.is_authorised) {
            return Promise.resolve();
        }

        return this.google_auth.signIn({ prompt: 'select_account' });
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

    @action.bound
    async saveFile(options) {
        await this.signIn();
        await this.checkFolderExists();

        await this.createSaveFilePicker('application/vnd.google-apps.folder', 'Select a folder', options);
    }

    @action.bound
    async loadFile() {
        await this.signIn();
        const xml_doc = await this.createLoadFilePicker(['text/xml', 'application/xml'], 'Select a Deriv Bot Strategy');

        return xml_doc;
    }

    async checkFolderExists() {
        const { files } = gapi.client.drive;
        
        const response = await files.list({ q: 'trashed=false' });
        const mimeType = 'application/vnd.google-apps.folder';
        const folder = response.result.files.find(file => file.mimeType === mimeType);

        if (folder) {
            return;
        }

        await files.create({
            resource: {
                name  : this.bot_folder_name,
                mimeType,
                fields: 'id',
            },
        });
    }

    createSaveFilePicker(mime_type, title, options) {
        const { setButtonStatus } = this.root_store.saveload;
        return new Promise(resolve => {
            const savePickerCallback = data => {
                if (data.action === google.picker.Action.PICKED) {
                    const folderId = data.docs[0].id;
                    const strategyFile = new Blob([options.content], { type: options.mimeType });
                    const strategyFileMetadata = JSON.stringify({
                        name    : options.name,
                        mimeType: options.mimeType,
                        parents : [folderId],
                    });

                    const formData = new FormData();
                    formData.append('metadata', new Blob([strategyFileMetadata], { type: 'application/json' }));
                    formData.append('file', strategyFile);

                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'json';
                    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
                    xhr.setRequestHeader('Authorization', `Bearer ${gapi.auth.getToken().access_token}`);
                    xhr.onload = () => {
                        if (xhr.status === 401) {
                            this.signOut();
                        }

                        setButtonStatus(0);
                        resolve();
                    };
                    xhr.send(formData);
                } else if (data.action === google.picker.Action.CANCEL) {
                    setButtonStatus(0);
                }
            };

            this.showGoogleDriveFilePicker(true, mime_type, title, savePickerCallback);
        });
    }

    createLoadFilePicker(mime_type, title) {
        const { setButtonStatus } = this.root_store.saveload;
        return new Promise(resolve => {
            const loadPickerCallback = async data => {
                if (data.action === google.picker.Action.PICKED) {
                    const file = data.docs[0];
                    const file_name = file.name;
                    const fileId = file.id;
                    const { files } = gapi.client.drive;

                    const response = await files.get({
                        alt     : 'media',
                        fileId,
                        mimeType: 'text/plain',
                    });
                    
                    resolve({ xml_doc: response.body, file_name });
                } else if (data.action === google.picker.Action.CANCEL) {
                    setButtonStatus(0);
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
            .setTitle(translate(title))
            .setLocale(this.getPickerLanguage())
            .setAppId(this.app_id)
            .setOAuthToken(gapi.auth.getToken().access_token)
            .addView(docs_view)
            .setDeveloperKey(this.api_key)
            .setCallback(callback)
            .build()
            .setVisible(true);
    }
}

