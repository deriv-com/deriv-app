import { localize }                     from 'deriv-translations';
import { getLanguage }                  from '../lang/lang';
import { observer as globalObserver }   from '../observer';
import { trackAndEmitError }            from '../tools';
import config                           from '../../constants';
import { loadWorkspace, loadBlocks }    from '../../scratch';

/* eslint-disable */
class GoogleDrive {
    constructor() {
        this.botFolderName = `Binary Bot - ${localize('Strategies')}`;
        this.setInfo(config);
        this.googleAuth = null;
        this.isAuthorised = null;
        this.profile = null;

        this.getScript('https://apis.google.com/js/api.js', () => this.init());
    }

    getScript(source, callback) {
        let script = document.createElement('script');
        const prior = document.getElementsByTagName('script')[0];

        script.async = 1;
        script.onload = script.onreadystatechange = function(_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = null;
                script.onreadystatechange = null;
                script = undefined;
    
                if (!isAbort && callback) setTimeout(callback, 0);
            }
        };
    
        script.src = source;
        prior.parentNode.insertBefore(script, prior);
    }

    init() {
        gapi.load('client:auth2', 
            () => {
                gapi.client
                    .init({
                        apiKey       : this.apiKey,
                        clientId     : this.clientId,
                        scope        : 'https://www.googleapis.com/auth/drive.file',
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                    })
                    .then(
                        () => {
                            this.googleAuth = gapi.auth2.getAuthInstance();
                            this.googleAuth.isSignedIn.listen(isSignedIn => this.updateSigninStatus(isSignedIn));
                            this.updateSigninStatus(this.googleAuth.isSignedIn.get());
                        },
                        error => {
                            console.log(error); // eslint-disable-line
                        }
                    );
            }
        );
    }

    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            this.profile = this.googleAuth.currentUser.get().getBasicProfile();
        } else {
            this.profile = null;
        }
        this.isAuthorised = isSignedIn;
    }

    authorise() {
        return new Promise((resolve, reject) => {
            if (this.isAuthorised) {
                resolve();
            } else {
                this.googleAuth
                    .signIn({ prompt: 'select_account' })
                    .then(() => resolve())
                    .catch(response => {
                        if (response.error === 'access_denied') {
                            globalObserver.emit(
                                'ui.log.warn',
                                localize(
                                    'Please grant permission to view and manage Google Drive folders created with Binary Bot'
                                )
                            );
                        }
                        reject(response);
                    });
            }
        });
    }

    signOut() {
        if (this.isAuthorised) {
            return this.googleAuth.signOut();
        }
        return Promise.resolve();
    }

    setInfo(data) {
        const { gd: {cid, aid, api } } = data;
        this.clientId = cid;
        this.appId = aid;
        this.apiKey = api;
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

    createFilePicker() {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line consistent-return
            const userPickedFile = data => {
                if (data.action === google.picker.Action.PICKED) {
                    const fileId = data.docs[0].id;
                    gapi.client.drive.files
                        .get({
                            alt     : 'media',
                            fileId,
                            mimeType: 'text/plain',
                        })
                        .then(response => {
                            try {
                                const xmlDom = Blockly.Xml.textToDom(response.body);
                                const loadFunction =
                                    xmlDom.hasAttribute('collection') && xmlDom.getAttribute('collection') === 'true'
                                        ? loadBlocks
                                        : loadWorkspace;
                                try {
                                    loadFunction(xmlDom);
                                    resolve();
                                } catch (error) {
                                    trackAndEmitError(localize('Could not load Google Drive blocks'), error);
                                    reject(error);
                                }
                            } catch (error) {
                                trackAndEmitError(localize('Unrecognized file format'), error);
                                reject(error);
                            }
                        })
                        .catch(error => {
                            if (error.status && error.status === 401) {
                                this.signOut();
                            }
                            trackAndEmitError(localize('There was an error retrieving data from Google Drive'), error);
                            reject(error);
                        });
                } else if (data.action === google.picker.Action.CANCEL) {
                    reject();
                }
            };

            this.authorise()
                .then(() => {
                    // FilePicker open doesn't give an unauthorised error, so check if we can list files
                    // first before attempting to open it (user revoked permissions through accounts.google.com)
                    gapi.client.drive.files
                        .list()
                        .then(() => {
                            const mimeTypes = ['application/xml'];
                            const docsView = new google.picker.DocsView();
                            docsView.setMimeTypes(mimeTypes.join(','));
                            docsView.setIncludeFolders(true);
                            docsView.setOwnedByMe(true);

                            const picker = new google.picker.PickerBuilder();
                            picker
                                .setOrigin(`${window.location.protocol}//${window.location.host}`)
                                .setTitle(localize('Select a Binary Bot strategy'))
                                .setLocale(this.getPickerLanguage())
                                .setAppId(this.appId)
                                .setOAuthToken(gapi.auth.getToken().access_token)
                                .addView(docsView)
                                .setDeveloperKey(this.apiKey)
                                .setCallback(userPickedFile)
                                .build()
                                .setVisible(true);
                        })
                        .catch(error => {
                            if (error.status && error.status === 401) {
                                this.signOut();
                            }
                            trackAndEmitError(localize('There was an error listing files from Google Drive'), error);
                            reject(error);
                        });
                })
                .catch(error => reject(error));
        });
    }

    getDefaultFolderId() {
        return new Promise((resolve, reject) => {
            // Avoid duplicate auth flow by checking if user is already authed
            const authorisePromise = [];
            if (!this.isAuthorised) {
                authorisePromise.push(this.authorise);
            }
            Promise.all(authorisePromise)
                .then(() => {
                    gapi.client.drive.files
                        .list({ q: 'trashed=false' })
                        // eslint-disable-next-line consistent-return
                        .then(response => {
                            const botFolder = response.result.files.find(
                                file =>
                                    file.name === this.botFolderName &&
                                    file.mimeType === 'application/vnd.google-apps.folder'
                            );
                            if (botFolder) {
                                return resolve(botFolder.id);
                            }
                            gapi.client.drive.files
                                .create({
                                    resource: {
                                        name    : this.botFolderName,
                                        mimeType: 'application/vnd.google-apps.folder',
                                        fields  : 'id',
                                    },
                                })
                                .then(createFileResponse => resolve(createFileResponse.result.id))
                                .catch(error => {
                                    if (error.status && error.status === 401) {
                                        this.signOut();
                                    }
                                    trackAndEmitError(
                                        localize('There was an error retrieving files from Google Drive'),
                                        error
                                    );
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            if (error.status && error.status === 401) {
                                this.signOut();
                            }
                            trackAndEmitError(localize('There was an error listing files from Google Drive'), error);
                            reject(error);
                        });
                })
                .catch(() => {
                    /* Auth error, already handled in authorise()-promise */
                });
        });
    }

    saveFile(options) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line consistent-return
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
                        if (xhr.status === 200) {
                            resolve();
                        } else {
                            if (xhr.status === 401) {
                                this.signOut();
                            }
                            trackAndEmitError(localize('There was an error processing your request'), xhr.status);
                            reject();
                        }
                    };
                    xhr.send(formData);
                } else if (data.action === google.picker.Action.CANCEL) {
                    reject();
                }
            };

            this.authorise()
                .then(() => {
                    // Calling getDefaultFolderId() ensures there's at least one folder available to save to.
                    // FilePicker doesn't allow for folder creation, so a user without any folder in
                    // their drive couldn't select anything.
                    this.getDefaultFolderId()
                        .then(() => {
                            const view = new google.picker.DocsView();
                            view.setIncludeFolders(true)
                                .setSelectFolderEnabled(true)
                                .setMimeTypes('application/vnd.google-apps.folder');

                            const picker = new google.picker.PickerBuilder();
                            picker
                                .setOrigin(`${window.location.protocol}//${window.location.host}`)
                                .setTitle(localize('Select a folder'))
                                .addView(view)
                                .setLocale(this.getPickerLanguage())
                                .setAppId(this.appId)
                                .setOAuthToken(gapi.auth.getToken().access_token)
                                .setDeveloperKey(this.apiKey)
                                .setCallback(savePickerCallback)
                                .build()
                                .setVisible(true);
                        })
                        .catch(error => reject(error));
                })
                .catch(error => reject(error));
        });
    }
}

const googleDrive = new GoogleDrive();

export default googleDrive;
