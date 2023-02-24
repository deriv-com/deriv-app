/* global google,gapi */
import decodeJwtResponse from 'jwt-decode';
import GD_CONFIG from '../../botPage/common/google_drive_config';
import { load } from '../../botPage/view/blockly';
import store from '../../botPage/view/deriv/store';
import { setGdLoggedIn, setGoogleEmail } from '../../botPage/view/deriv/store/client-slice';
import { setGdReady } from '../../botPage/view/deriv/store/ui-slice';
import { TrackJSError } from '../../botPage/view/logger';
import { getLanguage } from '../lang';
import { observer as globalObserver } from '../utils/observer';
import { errLogger, loadExternalScript, translate } from '../utils/tools';

const getPickerLanguage = () => {
    const language = getLanguage();

    if (language === 'zhTw') return 'zh-TW';
    if (language === 'zhCn') return 'zh-CN';

    return language;
};
// [TODO]: Refactor to a function or improve it by TS
class GoogleDriveUtil {
    constructor(
        client_id = GD_CONFIG.CLIENT_ID,
        api_key = GD_CONFIG.API_KEY,
        app_id = GD_CONFIG.APP_ID,
        api_url_identity = GD_CONFIG.API_URL_IDENTITY,
        api_url_gdrive = GD_CONFIG.API_URL_GDRIVE,
        auth_scope = GD_CONFIG.AUTH_SCOPE,
        scope = GD_CONFIG.SCOPE,
        discovery_docs = GD_CONFIG.DISCOVERY_DOCS,
        bot_folder = `Binary Bot - ${translate('Strategies')}`
    ) {
        this.client_id = client_id;
        this.api_key = api_key;
        this.app_id = app_id;
        this.api_url_identity = api_url_identity;
        this.api_url_gdrive = api_url_gdrive;
        this.auth_scope = auth_scope;
        this.scope = scope;
        this.discovery_docs = discovery_docs;
        this.bot_folder = bot_folder;
        this.auth = null;
        this.is_authorized = false;
        // Fetch Google API script and initialize class fields
        loadExternalScript(this.api_url_identity)
            .then(() => this.initUrlIdentity())
            .catch(err => errLogger(err, translate('There was an error loading Google Identity API script.')));
        loadExternalScript(this.api_url_gdrive)
            .then(() =>
                gapi.load(this.auth_scope, async () => {
                    await gapi.client.load(...this.discovery_docs);
                })
            )
            .then(() => store.dispatch(setGdReady(true)))
            .catch(err => {
                errLogger(err, translate('There was an error loading Google Drive API script.'));
            });

        this.google_email = localStorage.getItem('google_email') ? localStorage.getItem('google_email') : null;
    }

    handleCredentialResponse = response => {
        const response_payload = decodeJwtResponse(response.credential);
        this.google_email = response_payload.email;
        store.dispatch(setGoogleEmail(this.google_email));
        localStorage.setItem('google_email', this.google_email);
        this.updateLoginStatus(true);
    };

    initUrlIdentity = () => {
        this.client = google.accounts.oauth2.initTokenClient({
            client_id: GD_CONFIG.CLIENT_ID,
            scope: GD_CONFIG.SCOPE,
            callback: response => {
                this.access_token = response.access_token;
            },
        });

        google.accounts.id.initialize({
            client_id: GD_CONFIG.CLIENT_ID,
            callback: response => this.handleCredentialResponse(response),
            auto_select: true,
            email: this.google_email ? this.google_email : '',
        });

        google.accounts.id.prompt();
    };

    login = () => {
        this.google_email = localStorage.getItem('google_email') ? localStorage.getItem('google_email') : null;
        store.dispatch(setGoogleEmail(this.google_email));
        this.client.callback = response => {
            this.access_token = response.access_token;
            store.dispatch(setGdLoggedIn(true));
            google.accounts.id.prompt();
        };
        this.requestAccessToken();
    };

    updateLoginStatus(is_logged_in) {
        store.dispatch(setGdLoggedIn(is_logged_in));
        this.is_authorized = is_logged_in;
    }

    logout() {
        if (this.google_email) {
            google.accounts.id.revoke(this.google_email, () => {
                this.updateLoginStatus(false);
                this.access_token = '';
                store.dispatch(setGoogleEmail(''));
            });
        }
    }

    listFiles = async () => {
        try {
            await gapi.client.drive.files.list({
                pageSize: 10,
                fields: 'files(id, name)',
            });
        } catch (err) {
            const error = new TrackJSError(
                'GoogleDrive',
                translate('There was an error listing files from Google Drive'),
                err
            );
            globalObserver.emit('Error', error);
        }
    };

    createFilePickerView({ title, afterAuthCallback, mime_type, pickerCallback, generalCallback, rejectCallback }) {
        afterAuthCallback()
            .then(() => {
                const view = new google.picker.DocsView();
                view.setIncludeFolders(true)
                    .setSelectFolderEnabled(true)
                    .setMimeTypes(mime_type);

                const picker = new google.picker.PickerBuilder();
                picker
                    .setOrigin(`${window.location.protocol}//${window.location.host}`)
                    .setTitle(translate(title))
                    .addView(view)
                    .setLocale(getPickerLanguage())
                    .setOAuthToken(this.access_token)
                    .setDeveloperKey(this.api_key)
                    .setCallback(pickerCallback)
                    .build()
                    .setVisible(true);
                if (typeof generalCallback === 'function') generalCallback();
            })
            .catch(rejectCallback);
    }

    createFilePicker() {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line consistent-return
            const userPickedFile = data => {
                if (data.action === google.picker.Action.PICKED) {
                    const file_id = data.docs[0].id;

                    gapi.client.drive.files
                        .get({
                            alt: 'media',
                            fileId: file_id,
                            mimeType: 'text/plain',
                        })
                        .then(response => {
                            try {
                                load(response.body);
                            } catch (err) {
                                const error = new TrackJSError(
                                    'GoogleDrive',
                                    translate('Unrecognized file format'),
                                    err
                                );
                                globalObserver.emit('Error', error);
                                reject(error);
                            }
                        })
                        .catch(err => {
                            if (err.status && err.status === 401) this.logout();

                            const error = new TrackJSError(
                                'GoogleDrive',
                                translate('There was an error retrieving data from Google Drive'),
                                err
                            );

                            globalObserver.emit('Error', error);
                            reject(error);
                        });
                }
            };

            this.createFilePickerView({
                title: translate('Select a Binary Bot strategy'),
                afterAuthCallback: this.listFiles,
                mime_type: ['text/xml', 'application/xml'],
                pickerCallback: userPickedFile,
                generalCallback: resolve,
                rejectCallback: err => {
                    const error = new TrackJSError('GoogleDrive', translate(err.message), err);
                    globalObserver.emit('Error', error);
                    reject(error);
                },
                generalRejectCallback: reject,
            });
        });
    }

    getDefaultFolderId() {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line
            gapi.client.drive.files
                .list({ q: 'trashed=false' })
                .then(response => {
                    const folder = response.result.files.find(
                        file => file.mimeType === 'application/vnd.google-apps.folder'
                    );

                    if (folder) return resolve();

                    return gapi.client.drive.files
                        .create({
                            resource: {
                                name: this.bot_folder,
                                mimeType: 'application/vnd.google-apps.folder',
                                fields: 'id',
                            },
                        })
                        .then(resolve)
                        .catch(err => {
                            if (err?.status === 401) this.logout();

                            const error = new TrackJSError(
                                'GoogleDrive',
                                translate('There was an error retrieving files from Google Drive'),
                                err
                            );
                            globalObserver.emit('Error', error);
                            reject(error);
                        });
                })
                .catch(error => {
                    globalObserver.emit('Error', error);
                    reject(error);
                });
        });
    }

    requestAccessToken = () => {
        if (!this.access_token) this.client.requestAccessToken({ prompt: '' });
    };

    saveFile(options) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line consistent-return
            const savePickerCallback = data => {
                if (data.action === google.picker.Action.PICKED) {
                    const folder_id = data.docs[0].id;
                    const strategy_file = new Blob([options.content], {
                        type: options.mimeType,
                    });
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
                    xhr.setRequestHeader('Authorization', `Bearer ${this.access_token}`);
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve();
                            return;
                        }
                        if (xhr.status === 401) this.logout();
                        const error = new TrackJSError(
                            'GoogleDrive',
                            translate('There was an error processing your request'),
                            xhr
                        );
                        globalObserver.emit('Error', error);
                        reject(error);
                    };

                    try {
                        xhr.send(form_data);
                    } catch (error) {
                        globalObserver.emit('Error', error);
                        reject(error);
                    }
                }
            };

            this.createFilePickerView({
                title: translate('Select a folder'),
                afterAuthCallback: this.getDefaultFolderId.bind(this),
                mime_type: 'application/vnd.google-apps.folder',
                pickerCallback: savePickerCallback,
                rejectCallback: reject,
                generalRejectCallback: reject,
            });
        });
    }
}

const google_drive_util = new GoogleDriveUtil();

export default google_drive_util;
