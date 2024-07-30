import React from 'react';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { config, getSavedWorkspaces, load, removeExistingWorkspace, save_types, setColors } from '@deriv/bot-skeleton';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { TStores } from '@deriv/stores/types';
import { localize } from '@deriv/translations';
import { clearInjectionDiv, tabs_title } from 'Constants/load-modal';
import { TStrategy } from 'Types';
import { rudderStackSendSwitchLoadStrategyTabEvent } from '../analytics/rudderstack-bot-builder';
import {
    rudderStackSendUploadStrategyCompletedEvent,
    rudderStackSendUploadStrategyFailedEvent,
    rudderStackSendUploadStrategyStartEvent,
} from '../analytics/rudderstack-common-events';
import { getStrategyType, LOAD_MODAL_TABS } from '../analytics/utils';
import RootStore from './root-store';

interface ILoadModalStore {
    active_index: number;
    is_load_modal_open: boolean;
    is_explanation_expand: boolean;
    is_open_button_loading: boolean;
    is_strategy_loaded: boolean;
    loaded_local_file: File | null;
    recent_strategies: TStrategy[];
    dashboard_strategies: Array<TStrategy>;
    selected_strategy_id: string | undefined;
    is_strategy_removed: boolean;
    is_delete_modal_open: boolean;
    current_workspace_id: string;
    preview_workspace: Blockly.WorkspaceSvg | null;
    selected_strategy: TStrategy;
    tab_name: string;
    setPreviewedStrategyId: (clicked_id: string) => void;
    getSelectedStrategyID: (current_workspace_id: string) => void;
    refreshStrategies: () => void;
    loadStrategyToBuilder: (param: TStrategy) => void;
    refreshStrategiesTheme: () => void;
    handleFileChange: (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body: boolean
    ) => boolean;
    loadFileFromLocal: () => void;
    onActiveIndexChange: () => void;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
    onEntered: () => void;
    onLoadModalClose: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    onZoomInOutClick: (is_zoom_in: string) => void;
    previewRecentStrategy: (workspace_id: string) => void;
    setActiveTabIndex: (index: number, is_default: boolean) => void;
    setLoadedLocalFile: (loaded_local_file: File | null) => void;
    setDashboardStrategies: (strategies: Array<TStrategy>) => void;
    setRecentStrategies: (recent_strategies: TStrategy[]) => void;
    setSelectedStrategyId: (selected_strategy_id: string) => void;
    toggleExplanationExpand: () => void;
    toggleLoadModal: () => void;
    toggleTourLoadModal: (toggle: boolean) => void;
    readFile: (is_preview: boolean, drop_event: DragEvent, file: File) => void;
    updateListStrategies: (workspaces: Array<TStrategy>) => void;
    getRecentFileIcon: (save_type: { [key: string]: string } | string) => string;
    getSaveType: (save_type: { [key: string]: string } | string) => string;
}

export default class LoadModalStore implements ILoadModalStore {
    root_store: RootStore;
    core: TStores;
    previewed_strategy_id = '';
    imported_strategy_type = 'pending';

    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            active_index: observable,
            previewed_strategy_id: observable,
            is_load_modal_open: observable,
            is_explanation_expand: observable,
            is_open_button_loading: observable,
            is_strategy_loaded: observable,
            is_delete_modal_open: observable,
            is_strategy_removed: observable,
            loaded_local_file: observable,
            recent_strategies: observable,
            dashboard_strategies: observable,
            selected_strategy_id: observable,
            current_workspace_id: observable,
            upload_id: observable,
            preview_workspace: computed,
            selected_strategy: computed,
            tab_name: computed,
            setPreviewedStrategyId: action.bound,
            getSelectedStrategyID: action.bound,
            refreshStrategies: action.bound,
            loadStrategyToBuilder: action.bound,
            refreshStrategiesTheme: action.bound,
            handleFileChange: action.bound,
            loadFileFromRecent: action.bound,
            loadFileFromLocal: action.bound,
            imported_strategy_type: observable,
            onActiveIndexChange: action.bound,
            onDriveConnect: action.bound,
            onDriveOpen: action.bound,
            onEntered: action.bound,
            onLoadModalClose: action.bound,
            onZoomInOutClick: action.bound,
            previewRecentStrategy: action.bound,
            setActiveTabIndex: action.bound,
            setLoadedLocalFile: action.bound,
            setRecentStrategies: action.bound,
            setSelectedStrategyId: action.bound,
            toggleExplanationExpand: action.bound,
            toggleLoadModal: action.bound,
            toggleTourLoadModal: action.bound,
            readFile: action.bound,
            resetBotBuilderStrategy: action.bound,
            setDashboardStrategies: action.bound,
            updateListStrategies: action.bound,
            onToggleDeleteDialog: action,
        });

        this.root_store = root_store;
        this.core = core;

        reaction(
            () => this.active_index,
            () => this.onActiveIndexChange()
        );
        reaction(
            () => this.is_load_modal_open,
            async is_load_modal_open => {
                if (is_load_modal_open) {
                    this.setRecentStrategies((await getSavedWorkspaces()) || []);
                } else {
                    this.onLoadModalClose();
                }
            }
        );
    }

    recent_workspace: Blockly.WorkspaceSvg | null = null;
    local_workspace: Blockly.WorkspaceSvg | null = null;
    drop_zone: unknown;

    active_index = 0;
    is_load_modal_open = false;
    is_explanation_expand = false;
    is_open_button_loading = false;
    loaded_local_file: File | null = null;
    recent_strategies: Array<TStrategy> = [];
    dashboard_strategies: Array<TStrategy> | [] = [];
    selected_strategy_id = '';
    is_strategy_loaded = false;
    is_delete_modal_open = false;
    is_strategy_removed = false;
    current_workspace_id = '';
    upload_id = '';

    get preview_workspace(): Blockly.WorkspaceSvg | null {
        if (this.tab_name === tabs_title.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === tabs_title.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    get selected_strategy(): TStrategy {
        return (
            this.dashboard_strategies.find((ws: { id: string }) => ws.id === this.selected_strategy_id) ??
            this.dashboard_strategies[0]
        );
    }

    get tab_name(): string {
        if (this.core.ui.is_mobile) {
            if (this.active_index === 0) return tabs_title.TAB_LOCAL;
            if (this.active_index === 1) return tabs_title.TAB_GOOGLE;
        }
        if (this.active_index === 0) return tabs_title.TAB_RECENT;
        if (this.active_index === 1) return tabs_title.TAB_LOCAL;
        if (this.active_index === 2) return tabs_title.TAB_GOOGLE;
        return '';
    }

    setPreviewedStrategyId = (clicked_id: string) => {
        this.previewed_strategy_id = clicked_id;
    };

    getSelectedStrategyID = (current_workspace_id: string) => {
        this.current_workspace_id = current_workspace_id;
    };

    setDashboardStrategies = (strategies: Array<TStrategy>) => {
        this.dashboard_strategies = strategies;
        if (!strategies.length) {
            this.selected_strategy_id = '';
        }
    };

    getDashboardStrategies = async () => {
        const recent_strategies = await getSavedWorkspaces();
        this.dashboard_strategies = recent_strategies;
    };

    handleFileChange = (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body = true
    ): boolean => {
        this.imported_strategy_type = 'pending';
        this.upload_id = uuidv4();
        let files;
        if (event.type === 'drop') {
            event.stopPropagation();
            event.preventDefault();

            ({ files } = event.dataTransfer);
        } else {
            ({ files } = event.target);
        }

        const [file] = files;

        if (!is_body) {
            if (file.name.includes('xml')) {
                this.setLoadedLocalFile(file);
                this.getDashboardStrategies();
            } else {
                return false;
            }
        }
        this.readFile(!is_body, event, file);
        event.target.value = '';
        return true;
    };

    resetBotBuilderStrategy = () => {
        const workspace = window.Blockly.derivWorkspace;
        if (workspace) {
            window.Blockly.derivWorkspace.asyncClear();
            window.Blockly.Xml.domToWorkspace(window.Blockly.utils.xml.textToDom(workspace.cached_xml.main), workspace);
            window.Blockly.derivWorkspace.strategy_to_load = workspace.cached_xml.main;
        }
    };

    loadStrategyToBuilder = async (strategy: TStrategy) => {
        if (strategy?.id) {
            await load({
                block_string: strategy.xml,
                strategy_id: strategy.id,
                file_name: strategy.name,
                workspace: window.Blockly?.derivWorkspace,
                from: strategy.save_type,
                drop_event: {},
                showIncompatibleStrategyDialog: false,
            });
            window.Blockly.derivWorkspace.strategy_to_load = strategy.xml;
        }
    };

    refreshStrategiesTheme = async () => {
        if (this.recent_workspace) {
            (this.recent_workspace as any).RTL = isDbotRTL();
        }
        await load({
            block_string: this.selected_strategy?.xml,
            drop_event: {},
            workspace: this.recent_workspace,
            file_name: this.selected_strategy?.name,
            strategy_id: this.selected_strategy?.id,
            from: this.selected_strategy?.save_type,
            showIncompatibleStrategyDialog: false,
        });
    };

    loadFileFromRecent = async () => {
        this.is_open_button_loading = true;
        if (!this.selected_strategy) {
            window.Blockly.derivWorkspace.asyncClear();
            window.Blockly.Xml.domToWorkspace(
                window.Blockly.utils.xml.textToDom(window.Blockly.derivWorkspace.strategy_to_load),
                window.Blockly.derivWorkspace
            );
            this.is_open_button_loading = false;
            return;
        }

        removeExistingWorkspace(this.selected_strategy.id);
        await load({
            block_string: this.selected_strategy?.xml,
            strategy_id: this.selected_strategy.id,
            file_name: this.selected_strategy.name,
            workspace: window.Blockly.derivWorkspace,
            from: this.selected_strategy.save_type,
            drop_event: {},
            showIncompatibleStrategyDialog: false,
        });
        const recent_files = await getSavedWorkspaces();
        recent_files.map((strategy: TStrategy) => {
            const { xml, id } = strategy;
            if (this.selected_strategy.id === id) {
                window.Blockly.derivWorkspace.strategy_to_load = xml;
            }
        });
        this.is_open_button_loading = false;
    };

    loadFileFromLocal = (): void => {
        this.is_open_button_loading = true;
        if (this.loaded_local_file) {
            this.readFile(false, {} as DragEvent, this.loaded_local_file);
        }
    };

    onActiveIndexChange = (): void => {
        if (this.tab_name === tabs_title.TAB_RECENT) {
            this.previewRecentStrategy(this.selected_strategy_id);
        } else if (this.recent_workspace) {
            setTimeout(() => {
                // Dispose of recent workspace when switching away from Recent tab.
                // Process in next cycle so user doesn't have to wait.
                this.recent_workspace?.dispose();
                this.recent_workspace = null;
            });
        }

        if (this.tab_name === tabs_title.TAB_LOCAL) {
            if (!this.drop_zone) {
                this.drop_zone = document.querySelector('load-strategy__local-dropzone-area');

                if (this.drop_zone) {
                    this.drop_zone.addEventListener('drop', event => this.handleFileChange(event, false));
                }
            }
        }

        // Dispose of local workspace when switching away from Local tab.
        else if (this.local_workspace) {
            setTimeout(() => {
                this.local_workspace?.dispose();
                this.local_workspace = null;
                this.setLoadedLocalFile(null);
            }, 0);
        }

        // Forget about drop zone when not on Local tab.
        if (this.tab_name !== tabs_title.TAB_LOCAL && this.drop_zone) {
            this.drop_zone.removeEventListener('drop', event => this.handleFileChange(event, false));
        }
    };

    onDriveConnect = (): void => {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    };

    onDriveOpen = async () => {
        const { google_drive } = this.root_store;
        if (google_drive) {
            google_drive.upload_id = uuidv4();
        }
        rudderStackSendUploadStrategyStartEvent({ upload_provider: 'google_drive', upload_id: google_drive.upload_id });
        const { loadFile } = this.root_store.google_drive;
        const { xml_doc, file_name } = await loadFile();
        await load({
            block_string: xml_doc,
            file_name,
            workspace: window.Blockly.derivWorkspace,
            from: save_types.GOOGLE_DRIVE,
            drop_event: null,
            strategy_id: null,
            showIncompatibleStrategyDialog: null,
        });

        const { active_tab } = this.root_store.dashboard;
        if (active_tab === 1) this.toggleLoadModal();

        this.root_store.dashboard.is_dialog_open = false;
    };

    onEntered = (): void => {
        this.previewRecentStrategy(this.selected_strategy_id);
    };

    onLoadModalClose = (): void => {
        if (this.recent_workspace) {
            this.recent_workspace = null;
        }
        if (this.local_workspace) {
            this.local_workspace = null;
        }

        this.setActiveTabIndex(0, true); // Reset to first tab.
        this.setLoadedLocalFile(null);
    };

    onZoomInOutClick = (is_zoom_in: string): void => {
        if (this.preview_workspace) {
            this.preview_workspace.zoomCenter(is_zoom_in ? 1 : -1);
        }
    };

    previewRecentStrategy = (workspace_id: string): void => {
        if (!workspace_id) this.setSelectedStrategyId(this.current_workspace_id);
        else this.setSelectedStrategyId(workspace_id);
        if (!this.selected_strategy) {
            return;
        }
        const {
            dashboard: { active_tab },
        } = this.root_store;
        //removed the dispose here so on switch of tab it does not
        //throw xml error
        if (active_tab === 1 && !this.is_load_modal_open) {
            this.recent_workspace = null;
            this.setLoadedLocalFile(null);
        }

        const dark_mode = document.body.classList.contains('theme--dark');
        setColors(dark_mode);

        //to load the bot on first load
        const ref = document.getElementById('load-strategy__blockly-container');
        if (!ref) {
            // eslint-disable-next-line no-console
            console.warn('Could not find preview workspace element.');
            return;
        }
        if (this.tab_name !== tabs_title.TAB_LOCAL && this.recent_workspace) {
            clearInjectionDiv(ref);
            this.recent_workspace.dispose();
            this.recent_workspace = null;
        }
        if (!this.recent_workspace?.rendered) {
            this.recent_workspace = window.Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`,
                zoom: {
                    wheel: true,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
                scrollbars: true,
                renderer: 'zelos',
                theme: window?.Blockly?.Themes?.zelos_renderer,
            });
        }
        this.refreshStrategiesTheme();
    };

    setActiveTabIndex = (index: number, is_default: boolean): void => {
        this.active_index = index;
        if (!is_default) {
            const { ui } = this.core;
            const { is_mobile } = ui;
            rudderStackSendSwitchLoadStrategyTabEvent({
                load_strategy_tab: LOAD_MODAL_TABS[index + (is_mobile ? 1 : 0)],
            });
        }
    };

    setLoadedLocalFile = (loaded_local_file: File | null): void => {
        this.loaded_local_file = loaded_local_file;
    };

    setRecentStrategies = (recent_strategies: TStrategy[]): void => {
        this.recent_strategies = recent_strategies;
    };

    refreshStrategies = (): void => {
        this.setRecentStrategies(this.recent_strategies);
    };

    setSelectedStrategyId = (selected_strategy_id: string): void => {
        this.selected_strategy_id = selected_strategy_id;
    };

    toggleExplanationExpand = (): void => {
        this.is_explanation_expand = !this.is_explanation_expand;
    };

    toggleLoadModal = (): void => {
        this.is_load_modal_open = !this.is_load_modal_open;
        if (this.selected_strategy_id) this.previewRecentStrategy(this.selected_strategy_id);
        this.setLoadedLocalFile(null);
    };

    toggleTourLoadModal = (toggle = !this.is_load_modal_open) => {
        this.is_load_modal_open = toggle;
    };

    updateListStrategies = (workspaces: Array<TStrategy>): void => {
        if (workspaces) {
            (this.dashboard_strategies as Array<TStrategy>) = workspaces;
        }
    };

    getRecentFileIcon = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return 'IcReports';
            case save_types.LOCAL:
                return 'IcMyComputer';
            case save_types.GOOGLE_DRIVE:
                return 'IcGoogleDrive';
            default:
                return 'IcReports';
        }
    };

    getSaveType = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return localize('Unsaved');
            case save_types.LOCAL:
                return localize('Local');
            case save_types.GOOGLE_DRIVE:
                return localize('Google Drive');
            default:
                return localize('Unsaved');
        }
    };

    onToggleDeleteDialog = (is_delete_modal_open: boolean): void => {
        this.is_delete_modal_open = is_delete_modal_open;
    };

    readFile = (is_preview: boolean, drop_event: DragEvent, file: File): void => {
        if (this.upload_id && is_preview) {
            rudderStackSendUploadStrategyStartEvent({ upload_provider: 'my_computer', upload_id: this.upload_id });
        }
        const file_name = file?.name.replace(/\.[^/.]+$/, '');
        const reader = new FileReader();

        reader.onload = action(async e => {
            const load_options = {
                block_string: e?.target?.result,
                drop_event,
                from: save_types.LOCAL,
                workspace: null as Blockly.WorkspaceSvg | null,
                file_name: '',
                strategy_id: '',
                showIncompatibleStrategyDialog: false,
            };
            const ref = document?.getElementById('load-strategy__blockly-container');
            const upload_type = getStrategyType(load_options?.block_string ?? '');
            if (is_preview && ref) {
                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                    scrollbars: true,
                    renderer: 'zelos',
                    theme: window?.Blockly?.Themes?.zelos_renderer,
                });
                load_options.workspace = this.local_workspace;
                if (load_options.workspace) {
                    (load_options.workspace as any).RTL = isDbotRTL();
                }
                this.imported_strategy_type = upload_type;
            } else {
                load_options.workspace = window.Blockly.derivWorkspace;
                load_options.file_name = file_name;
            }

            const result = await load(load_options);
            if (!is_preview && !result?.error) {
                rudderStackSendUploadStrategyCompletedEvent({
                    upload_provider: 'my_computer',
                    upload_type,
                    upload_id: this.upload_id,
                });
            } else if (!is_preview && result?.error) {
                rudderStackSendUploadStrategyFailedEvent({
                    upload_provider: 'my_computer',
                    upload_id: this.upload_id,
                    upload_type,
                    error_message: result.error,
                });
            }
            this.is_open_button_loading = false;
        });

        reader.readAsText(file);
    };
}
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ function oo_cm() {
    try {
        return (
            (0, eval)('globalThis._console_ninja') ||
            (0, eval)(
                "/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x56c922=_0x3b3b;function _0x3724(){var _0x452956=['default','performance','getOwnPropertySymbols','totalStrLength','toString','error','_p_name','edge','expId','valueOf','unknown','onclose','getWebSocketClass','_dateToString','','hasOwnProperty','capped','reduceLimits','noFunctions','elapsed','_isArray','hostname','set','autoExpandMaxDepth','funcName','path','_isNegativeZero','_cleanNode','21HbYcbi','_propertyName','2691chkCSw','message','serialize','_HTMLAllCollection','props','toUpperCase','[object\\x20Set]','','root_exp','value','_objectToString','setter','__es'+'Module','logger\\x20websocket\\x20error','allStrLength','1111bHnbpv','_treeNodePropertiesAfterFullValue','perf_hooks','call','cappedProps','toLowerCase','_sortProps','NEGATIVE_INFINITY','name','_addProperty','[object\\x20Date]','NEXT_RUNTIME','count','port','_setNodeExpressionPath','enumerable','_socket','onerror','22764FhTwCC','61340mRPwQL','\\x20server','_addLoadNode','date','autoExpandPreviousObjects','_inBrowser','expressionsToEvaluate','time','symbol','warn','onmessage','RegExp','_numberRegExp','readyState','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_hasSetOnItsPath','_sendErrorMessage','bigint','type','sortProps','_ws','_setNodePermissions','autoExpandPropertyCount','_hasSymbolPropertyOnItsPath','_isUndefined','_keyStrRegExp','eventReceivedCallback','then','astro','_WebSocketClass','_additionalMetadata','bind','pathToFileURL','_getOwnPropertyDescriptor','pop','level','method','dockerizedApp','nuxt','coverage','current','args','7298MsGDKO','substr','trace',\"/Users/abuhasan/.vscode/extensions/wallabyjs.console-ninja-1.0.333/node_modules\",'1','_type','host','_undefined','_setNodeLabel','autoExpand','\\x20browser','node','_allowedToConnectOnSend','_p_','_hasMapOnItsPath','HTMLAllCollection','unref','17AKcVHJ','_blacklistedProperty','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_addObjectProperty','number','stringify','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','_getOwnPropertySymbols','positiveInfinity','...','_connecting','prototype','Map','_addFunctionsNode','24tBozSC','autoExpandLimit','1722322956255','data','Buffer','location','disabledTrace','url','send','resolveGetters','_allowedToSend','strLength','env','test','_isPrimitiveType','close','forEach','hits','map','_disposeWebsocket','hrtime','_processTreeNodeResult','[object\\x20Map]','console','_isPrimitiveWrapperType','stackTraceLimit','null','global','timeStamp','string','_connected','replace','catch','Number','getter','10CEfuEn','depth','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','sort','_webSocketErrorDocsLink','get','_maxConnectAttemptCount','index','_setNodeId','stack','getPrototypeOf','6CfPYzO','nan','_regExpToString','undefined','now','_console_ninja_session','getOwnPropertyNames','log','_isSet','parent','isExpressionToEvaluate','_reconnectTimeout','121910MFdrSP','_console_ninja','getOwnPropertyDescriptor','9254zBoMab','reload','process','168248AszMMW','elements','array','_getOwnPropertyNames','isArray','onopen','_Symbol','Symbol','Set','defineProperty','push','next.js','49153','function','versions','String','negativeInfinity','_connectToHostNow','disabledLog','rootExpression','negativeZero','split','length','_setNodeQueryPath','_property','_isMap','concat','_WebSocket','angular','_connectAttemptCount','indexOf','charAt','nodeModules','_attemptToReconnectShortly','_setNodeExpandableState','origin','object','ws://','_consoleNinjaAllowedToStart','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','WebSocket','remix',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Abu-Mobarak-P0XW9K7GJ0\",\"10.10.25.189\"],'_treeNodePropertiesBeforeFullValue','1070748hIRGCa','constructor','_capIfString','gateway.docker.internal','_inNextEdge'];_0x3724=function(){return _0x452956;};return _0x3724();}(function(_0x3b2e75,_0x100eef){var _0xaae758=_0x3b3b,_0x39a003=_0x3b2e75();while(!![]){try{var _0x213834=-parseInt(_0xaae758(0x29a))/0x1*(parseInt(_0xaae758(0x289))/0x2)+parseInt(_0xaae758(0x2d6))/0x3*(-parseInt(_0xaae758(0x25f))/0x4)+parseInt(_0xaae758(0x1e8))/0x5*(parseInt(_0xaae758(0x2a8))/0x6)+-parseInt(_0xaae758(0x23b))/0x7*(parseInt(_0xaae758(0x1ee))/0x8)+parseInt(_0xaae758(0x21a))/0x9*(parseInt(_0xaae758(0x2cb))/0xa)+parseInt(_0xaae758(0x24c))/0xb*(parseInt(_0xaae758(0x25e))/0xc)+parseInt(_0xaae758(0x23d))/0xd*(-parseInt(_0xaae758(0x1eb))/0xe);if(_0x213834===_0x100eef)break;else _0x39a003['push'](_0x39a003['shift']());}catch(_0x19d61e){_0x39a003['push'](_0x39a003['shift']());}}}(_0x3724,0x1c312));function _0x3b3b(_0xa5dd9b,_0x1fc6e7){var _0x37245e=_0x3724();return _0x3b3b=function(_0x3b3b1d,_0x3d24fd){_0x3b3b1d=_0x3b3b1d-0x1e3;var _0x474789=_0x37245e[_0x3b3b1d];return _0x474789;},_0x3b3b(_0xa5dd9b,_0x1fc6e7);}var K=Object['create'],Q=Object[_0x56c922(0x1f7)],G=Object[_0x56c922(0x1ea)],ee=Object[_0x56c922(0x2dc)],te=Object[_0x56c922(0x2d5)],ne=Object['prototype'][_0x56c922(0x22e)],re=(_0x1648d2,_0x564d56,_0x234acc,_0x5da36c)=>{var _0x3ca27e=_0x56c922;if(_0x564d56&&typeof _0x564d56==_0x3ca27e(0x212)||typeof _0x564d56==_0x3ca27e(0x1fb)){for(let _0x312ec2 of ee(_0x564d56))!ne['call'](_0x1648d2,_0x312ec2)&&_0x312ec2!==_0x234acc&&Q(_0x1648d2,_0x312ec2,{'get':()=>_0x564d56[_0x312ec2],'enumerable':!(_0x5da36c=G(_0x564d56,_0x312ec2))||_0x5da36c[_0x3ca27e(0x25b)]});}return _0x1648d2;},V=(_0xacd33,_0x2ce21e,_0x24be20)=>(_0x24be20=_0xacd33!=null?K(te(_0xacd33)):{},re(_0x2ce21e||!_0xacd33||!_0xacd33[_0x56c922(0x249)]?Q(_0x24be20,_0x56c922(0x21f),{'value':_0xacd33,'enumerable':!0x0}):_0x24be20,_0xacd33)),x=class{constructor(_0x205320,_0x10ea65,_0x34e838,_0x454d2d,_0x40c019,_0x4eedd9){var _0x1bc9ba=_0x56c922,_0x3b5bf5,_0x2cd30b,_0x365841,_0x101bf4;this[_0x1bc9ba(0x2c3)]=_0x205320,this[_0x1bc9ba(0x28f)]=_0x10ea65,this['port']=_0x34e838,this[_0x1bc9ba(0x20e)]=_0x454d2d,this[_0x1bc9ba(0x284)]=_0x40c019,this[_0x1bc9ba(0x279)]=_0x4eedd9,this[_0x1bc9ba(0x2b2)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x1bc9ba(0x2c6)]=!0x1,this[_0x1bc9ba(0x2a4)]=!0x1,this[_0x1bc9ba(0x21e)]=((_0x2cd30b=(_0x3b5bf5=_0x205320[_0x1bc9ba(0x1ed)])==null?void 0x0:_0x3b5bf5[_0x1bc9ba(0x2b4)])==null?void 0x0:_0x2cd30b[_0x1bc9ba(0x257)])==='edge',this[_0x1bc9ba(0x264)]=!((_0x101bf4=(_0x365841=this[_0x1bc9ba(0x2c3)][_0x1bc9ba(0x1ed)])==null?void 0x0:_0x365841[_0x1bc9ba(0x1fc)])!=null&&_0x101bf4['node'])&&!this[_0x1bc9ba(0x21e)],this[_0x1bc9ba(0x27c)]=null,this['_connectAttemptCount']=0x0,this[_0x1bc9ba(0x2d1)]=0x14,this[_0x1bc9ba(0x2cf)]='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this[_0x1bc9ba(0x264)]?_0x1bc9ba(0x29c):_0x1bc9ba(0x26d))+this[_0x1bc9ba(0x2cf)];}async['getWebSocketClass'](){var _0x4471e7=_0x56c922,_0x5a8fa0,_0x134343;if(this[_0x4471e7(0x27c)])return this[_0x4471e7(0x27c)];let _0x21ed31;if(this['_inBrowser']||this[_0x4471e7(0x21e)])_0x21ed31=this[_0x4471e7(0x2c3)][_0x4471e7(0x216)];else{if((_0x5a8fa0=this['global'][_0x4471e7(0x1ed)])!=null&&_0x5a8fa0[_0x4471e7(0x209)])_0x21ed31=(_0x134343=this[_0x4471e7(0x2c3)][_0x4471e7(0x1ed)])==null?void 0x0:_0x134343[_0x4471e7(0x209)];else try{let _0x527bf0=await import('path');_0x21ed31=(await import((await import(_0x4471e7(0x2af)))[_0x4471e7(0x27f)](_0x527bf0['join'](this[_0x4471e7(0x20e)],'ws/index.js'))[_0x4471e7(0x223)]()))[_0x4471e7(0x21f)];}catch{try{_0x21ed31=require(require(_0x4471e7(0x238))['join'](this[_0x4471e7(0x20e)],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this['_WebSocketClass']=_0x21ed31,_0x21ed31;}[_0x56c922(0x1ff)](){var _0x245f66=_0x56c922;this[_0x245f66(0x2a4)]||this[_0x245f66(0x2c6)]||this[_0x245f66(0x20b)]>=this[_0x245f66(0x2d1)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x245f66(0x2a4)]=!0x0,this['_connectAttemptCount']++,this[_0x245f66(0x273)]=new Promise((_0xb8e14b,_0xbb343)=>{var _0x1823e9=_0x245f66;this[_0x1823e9(0x22b)]()[_0x1823e9(0x27a)](_0x260908=>{var _0x337f7b=_0x1823e9;let _0x343294=new _0x260908(_0x337f7b(0x213)+(!this[_0x337f7b(0x264)]&&this[_0x337f7b(0x284)]?_0x337f7b(0x21d):this['host'])+':'+this[_0x337f7b(0x259)]);_0x343294[_0x337f7b(0x25d)]=()=>{var _0x3737d5=_0x337f7b;this[_0x3737d5(0x2b2)]=!0x1,this[_0x3737d5(0x2bb)](_0x343294),this[_0x3737d5(0x20f)](),_0xbb343(new Error(_0x3737d5(0x24a)));},_0x343294[_0x337f7b(0x1f3)]=()=>{var _0x457f56=_0x337f7b;this[_0x457f56(0x264)]||_0x343294['_socket']&&_0x343294['_socket'][_0x457f56(0x299)]&&_0x343294[_0x457f56(0x25c)][_0x457f56(0x299)](),_0xb8e14b(_0x343294);},_0x343294[_0x337f7b(0x22a)]=()=>{var _0x23b861=_0x337f7b;this[_0x23b861(0x295)]=!0x0,this[_0x23b861(0x2bb)](_0x343294),this[_0x23b861(0x20f)]();},_0x343294[_0x337f7b(0x269)]=_0x43ba5d=>{var _0x240c42=_0x337f7b;try{if(!(_0x43ba5d!=null&&_0x43ba5d[_0x240c42(0x2ab)])||!this[_0x240c42(0x279)])return;let _0x4ba88e=JSON['parse'](_0x43ba5d[_0x240c42(0x2ab)]);this[_0x240c42(0x279)](_0x4ba88e[_0x240c42(0x283)],_0x4ba88e['args'],this['global'],this[_0x240c42(0x264)]);}catch{}};})[_0x1823e9(0x27a)](_0x443b92=>(this[_0x1823e9(0x2c6)]=!0x0,this['_connecting']=!0x1,this[_0x1823e9(0x295)]=!0x1,this[_0x1823e9(0x2b2)]=!0x0,this[_0x1823e9(0x20b)]=0x0,_0x443b92))['catch'](_0x1b7f09=>(this[_0x1823e9(0x2c6)]=!0x1,this['_connecting']=!0x1,console[_0x1823e9(0x268)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20'+this[_0x1823e9(0x2cf)]),_0xbb343(new Error(_0x1823e9(0x2cd)+(_0x1b7f09&&_0x1b7f09['message'])))));}));}[_0x56c922(0x2bb)](_0x46c93f){var _0x48f3d8=_0x56c922;this[_0x48f3d8(0x2c6)]=!0x1,this['_connecting']=!0x1;try{_0x46c93f[_0x48f3d8(0x22a)]=null,_0x46c93f[_0x48f3d8(0x25d)]=null,_0x46c93f[_0x48f3d8(0x1f3)]=null;}catch{}try{_0x46c93f[_0x48f3d8(0x26c)]<0x2&&_0x46c93f[_0x48f3d8(0x2b7)]();}catch{}}[_0x56c922(0x20f)](){var _0x8bd8cf=_0x56c922;clearTimeout(this['_reconnectTimeout']),!(this['_connectAttemptCount']>=this[_0x8bd8cf(0x2d1)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x108b4=_0x8bd8cf,_0x25b436;this[_0x108b4(0x2c6)]||this[_0x108b4(0x2a4)]||(this[_0x108b4(0x1ff)](),(_0x25b436=this[_0x108b4(0x273)])==null||_0x25b436[_0x108b4(0x2c8)](()=>this[_0x108b4(0x20f)]()));},0x1f4),this[_0x8bd8cf(0x1e7)][_0x8bd8cf(0x299)]&&this[_0x8bd8cf(0x1e7)][_0x8bd8cf(0x299)]());}async[_0x56c922(0x2b0)](_0x572f8a){var _0x4d8305=_0x56c922;try{if(!this[_0x4d8305(0x2b2)])return;this[_0x4d8305(0x295)]&&this['_connectToHostNow'](),(await this[_0x4d8305(0x273)])[_0x4d8305(0x2b0)](JSON[_0x4d8305(0x29f)](_0x572f8a));}catch(_0x58e704){console['warn'](this[_0x4d8305(0x26f)]+':\\x20'+(_0x58e704&&_0x58e704[_0x4d8305(0x23e)])),this['_allowedToSend']=!0x1,this[_0x4d8305(0x20f)]();}}};function q(_0x17bd1a,_0x58b458,_0x1c19fa,_0x12f945,_0x54be69,_0x3c3b0c,_0x499c56,_0x31081b=ie){var _0x1641dd=_0x56c922;let _0xb38646=_0x1c19fa[_0x1641dd(0x203)](',')[_0x1641dd(0x2ba)](_0x4b50d9=>{var _0x2195a2=_0x1641dd,_0x1aff5c,_0x26da47,_0x2d4c39,_0x1ba2b8;try{if(!_0x17bd1a['_console_ninja_session']){let _0x130c77=((_0x26da47=(_0x1aff5c=_0x17bd1a[_0x2195a2(0x1ed)])==null?void 0x0:_0x1aff5c[_0x2195a2(0x1fc)])==null?void 0x0:_0x26da47[_0x2195a2(0x294)])||((_0x1ba2b8=(_0x2d4c39=_0x17bd1a[_0x2195a2(0x1ed)])==null?void 0x0:_0x2d4c39[_0x2195a2(0x2b4)])==null?void 0x0:_0x1ba2b8[_0x2195a2(0x257)])==='edge';(_0x54be69===_0x2195a2(0x1f9)||_0x54be69===_0x2195a2(0x217)||_0x54be69===_0x2195a2(0x27b)||_0x54be69===_0x2195a2(0x20a))&&(_0x54be69+=_0x130c77?_0x2195a2(0x260):_0x2195a2(0x293)),_0x17bd1a[_0x2195a2(0x2db)]={'id':+new Date(),'tool':_0x54be69},_0x499c56&&_0x54be69&&!_0x130c77&&console[_0x2195a2(0x1e3)](_0x2195a2(0x215)+(_0x54be69[_0x2195a2(0x20d)](0x0)[_0x2195a2(0x242)]()+_0x54be69['substr'](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)',_0x2195a2(0x2a0));}let _0x4ba1cc=new x(_0x17bd1a,_0x58b458,_0x4b50d9,_0x12f945,_0x3c3b0c,_0x31081b);return _0x4ba1cc[_0x2195a2(0x2b0)][_0x2195a2(0x27e)](_0x4ba1cc);}catch(_0x59f9f4){return console[_0x2195a2(0x268)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x59f9f4&&_0x59f9f4[_0x2195a2(0x23e)]),()=>{};}});return _0x1a1675=>_0xb38646[_0x1641dd(0x2b8)](_0x1cf109=>_0x1cf109(_0x1a1675));}function ie(_0x590047,_0xf0409d,_0x3f99bf,_0xdf4b64){var _0x2eea14=_0x56c922;_0xdf4b64&&_0x590047===_0x2eea14(0x1ec)&&_0x3f99bf['location'][_0x2eea14(0x1ec)]();}function b(_0x3a4e3e){var _0x3d75e9=_0x56c922,_0xe6e3e0,_0x39c1b2;let _0x5537b6=function(_0x895c6d,_0x5f092b){return _0x5f092b-_0x895c6d;},_0x5bb5f0;if(_0x3a4e3e[_0x3d75e9(0x220)])_0x5bb5f0=function(){var _0x4d5deb=_0x3d75e9;return _0x3a4e3e[_0x4d5deb(0x220)]['now']();};else{if(_0x3a4e3e[_0x3d75e9(0x1ed)]&&_0x3a4e3e[_0x3d75e9(0x1ed)][_0x3d75e9(0x2bc)]&&((_0x39c1b2=(_0xe6e3e0=_0x3a4e3e[_0x3d75e9(0x1ed)])==null?void 0x0:_0xe6e3e0['env'])==null?void 0x0:_0x39c1b2[_0x3d75e9(0x257)])!=='edge')_0x5bb5f0=function(){return _0x3a4e3e['process']['hrtime']();},_0x5537b6=function(_0x597c1e,_0x28d2e7){return 0x3e8*(_0x28d2e7[0x0]-_0x597c1e[0x0])+(_0x28d2e7[0x1]-_0x597c1e[0x1])/0xf4240;};else try{let {performance:_0x79ef46}=require(_0x3d75e9(0x24e));_0x5bb5f0=function(){var _0x1fc306=_0x3d75e9;return _0x79ef46[_0x1fc306(0x2da)]();};}catch{_0x5bb5f0=function(){return+new Date();};}}return{'elapsed':_0x5537b6,'timeStamp':_0x5bb5f0,'now':()=>Date['now']()};}function X(_0x339b3b,_0x5efa14,_0x5738d7){var _0x5048e5=_0x56c922,_0x148843,_0x3facf7,_0xbb5221,_0x12f32b,_0x421ffb;if(_0x339b3b[_0x5048e5(0x214)]!==void 0x0)return _0x339b3b['_consoleNinjaAllowedToStart'];let _0x150bc8=((_0x3facf7=(_0x148843=_0x339b3b[_0x5048e5(0x1ed)])==null?void 0x0:_0x148843[_0x5048e5(0x1fc)])==null?void 0x0:_0x3facf7['node'])||((_0x12f32b=(_0xbb5221=_0x339b3b[_0x5048e5(0x1ed)])==null?void 0x0:_0xbb5221['env'])==null?void 0x0:_0x12f32b[_0x5048e5(0x257)])===_0x5048e5(0x226);return _0x150bc8&&_0x5738d7===_0x5048e5(0x285)?_0x339b3b[_0x5048e5(0x214)]=!0x1:_0x339b3b[_0x5048e5(0x214)]=_0x150bc8||!_0x5efa14||((_0x421ffb=_0x339b3b[_0x5048e5(0x2ad)])==null?void 0x0:_0x421ffb[_0x5048e5(0x234)])&&_0x5efa14['includes'](_0x339b3b[_0x5048e5(0x2ad)][_0x5048e5(0x234)]),_0x339b3b[_0x5048e5(0x214)];}function H(_0x4c4abf,_0x5f4d5b,_0x4fb570,_0xd186fc){var _0x2aa996=_0x56c922;_0x4c4abf=_0x4c4abf,_0x5f4d5b=_0x5f4d5b,_0x4fb570=_0x4fb570,_0xd186fc=_0xd186fc;let _0x474813=b(_0x4c4abf),_0x1ac05c=_0x474813[_0x2aa996(0x232)],_0x4cbcec=_0x474813[_0x2aa996(0x2c4)];class _0x108064{constructor(){var _0x25579d=_0x2aa996;this[_0x25579d(0x278)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x25579d(0x26b)]=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this[_0x25579d(0x290)]=_0x4c4abf[_0x25579d(0x2d9)],this[_0x25579d(0x240)]=_0x4c4abf[_0x25579d(0x298)],this[_0x25579d(0x280)]=Object['getOwnPropertyDescriptor'],this[_0x25579d(0x1f1)]=Object['getOwnPropertyNames'],this['_Symbol']=_0x4c4abf[_0x25579d(0x1f5)],this[_0x25579d(0x2d8)]=RegExp[_0x25579d(0x2a5)]['toString'],this[_0x25579d(0x22c)]=Date[_0x25579d(0x2a5)][_0x25579d(0x223)];}[_0x2aa996(0x23f)](_0x6662ff,_0x4e89cb,_0x3e27b4,_0x45ba5e){var _0x1b3004=_0x2aa996,_0x49945b=this,_0x13d07c=_0x3e27b4[_0x1b3004(0x292)];function _0x52181a(_0x3099b0,_0x312272,_0x5ee119){var _0x46ce11=_0x1b3004;_0x312272['type']=_0x46ce11(0x229),_0x312272['error']=_0x3099b0[_0x46ce11(0x23e)],_0x232efd=_0x5ee119[_0x46ce11(0x294)]['current'],_0x5ee119['node'][_0x46ce11(0x287)]=_0x312272,_0x49945b['_treeNodePropertiesBeforeFullValue'](_0x312272,_0x5ee119);}try{_0x3e27b4[_0x1b3004(0x282)]++,_0x3e27b4[_0x1b3004(0x292)]&&_0x3e27b4['autoExpandPreviousObjects'][_0x1b3004(0x1f8)](_0x4e89cb);var _0x5ed6a3,_0x30ad8c,_0x1d45cd,_0x2162a6,_0x4a37bc=[],_0x22eee1=[],_0x4e6283,_0x5854ca=this['_type'](_0x4e89cb),_0x210782=_0x5854ca===_0x1b3004(0x1f0),_0x334395=!0x1,_0x31e9cc=_0x5854ca===_0x1b3004(0x1fb),_0x27d99f=this['_isPrimitiveType'](_0x5854ca),_0x1f86f6=this[_0x1b3004(0x2c0)](_0x5854ca),_0x1b9b8d=_0x27d99f||_0x1f86f6,_0xffa004={},_0x4136c2=0x0,_0x1f02fb=!0x1,_0x232efd,_0x58fc0c=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3e27b4[_0x1b3004(0x2cc)]){if(_0x210782){if(_0x30ad8c=_0x4e89cb['length'],_0x30ad8c>_0x3e27b4['elements']){for(_0x1d45cd=0x0,_0x2162a6=_0x3e27b4[_0x1b3004(0x1ef)],_0x5ed6a3=_0x1d45cd;_0x5ed6a3<_0x2162a6;_0x5ed6a3++)_0x22eee1[_0x1b3004(0x1f8)](_0x49945b[_0x1b3004(0x255)](_0x4a37bc,_0x4e89cb,_0x5854ca,_0x5ed6a3,_0x3e27b4));_0x6662ff['cappedElements']=!0x0;}else{for(_0x1d45cd=0x0,_0x2162a6=_0x30ad8c,_0x5ed6a3=_0x1d45cd;_0x5ed6a3<_0x2162a6;_0x5ed6a3++)_0x22eee1[_0x1b3004(0x1f8)](_0x49945b['_addProperty'](_0x4a37bc,_0x4e89cb,_0x5854ca,_0x5ed6a3,_0x3e27b4));}_0x3e27b4['autoExpandPropertyCount']+=_0x22eee1[_0x1b3004(0x204)];}if(!(_0x5854ca===_0x1b3004(0x2c2)||_0x5854ca===_0x1b3004(0x2d9))&&!_0x27d99f&&_0x5854ca!==_0x1b3004(0x1fd)&&_0x5854ca!==_0x1b3004(0x2ac)&&_0x5854ca!==_0x1b3004(0x270)){var _0x40bf98=_0x45ba5e[_0x1b3004(0x241)]||_0x3e27b4[_0x1b3004(0x241)];if(this[_0x1b3004(0x1e4)](_0x4e89cb)?(_0x5ed6a3=0x0,_0x4e89cb[_0x1b3004(0x2b8)](function(_0x4e4dc6){var _0x21e8bb=_0x1b3004;if(_0x4136c2++,_0x3e27b4[_0x21e8bb(0x275)]++,_0x4136c2>_0x40bf98){_0x1f02fb=!0x0;return;}if(!_0x3e27b4[_0x21e8bb(0x1e6)]&&_0x3e27b4[_0x21e8bb(0x292)]&&_0x3e27b4['autoExpandPropertyCount']>_0x3e27b4['autoExpandLimit']){_0x1f02fb=!0x0;return;}_0x22eee1[_0x21e8bb(0x1f8)](_0x49945b[_0x21e8bb(0x255)](_0x4a37bc,_0x4e89cb,_0x21e8bb(0x1f6),_0x5ed6a3++,_0x3e27b4,function(_0x4ebc43){return function(){return _0x4ebc43;};}(_0x4e4dc6)));})):this[_0x1b3004(0x207)](_0x4e89cb)&&_0x4e89cb[_0x1b3004(0x2b8)](function(_0x21dea7,_0x12aff4){var _0x5ddb0d=_0x1b3004;if(_0x4136c2++,_0x3e27b4[_0x5ddb0d(0x275)]++,_0x4136c2>_0x40bf98){_0x1f02fb=!0x0;return;}if(!_0x3e27b4[_0x5ddb0d(0x1e6)]&&_0x3e27b4[_0x5ddb0d(0x292)]&&_0x3e27b4['autoExpandPropertyCount']>_0x3e27b4[_0x5ddb0d(0x2a9)]){_0x1f02fb=!0x0;return;}var _0x1580c5=_0x12aff4[_0x5ddb0d(0x223)]();_0x1580c5['length']>0x64&&(_0x1580c5=_0x1580c5['slice'](0x0,0x64)+_0x5ddb0d(0x2a3)),_0x22eee1['push'](_0x49945b['_addProperty'](_0x4a37bc,_0x4e89cb,_0x5ddb0d(0x2a6),_0x1580c5,_0x3e27b4,function(_0x39f255){return function(){return _0x39f255;};}(_0x21dea7)));}),!_0x334395){try{for(_0x4e6283 in _0x4e89cb)if(!(_0x210782&&_0x58fc0c[_0x1b3004(0x2b5)](_0x4e6283))&&!this[_0x1b3004(0x29b)](_0x4e89cb,_0x4e6283,_0x3e27b4)){if(_0x4136c2++,_0x3e27b4[_0x1b3004(0x275)]++,_0x4136c2>_0x40bf98){_0x1f02fb=!0x0;break;}if(!_0x3e27b4[_0x1b3004(0x1e6)]&&_0x3e27b4[_0x1b3004(0x292)]&&_0x3e27b4[_0x1b3004(0x275)]>_0x3e27b4[_0x1b3004(0x2a9)]){_0x1f02fb=!0x0;break;}_0x22eee1[_0x1b3004(0x1f8)](_0x49945b[_0x1b3004(0x29d)](_0x4a37bc,_0xffa004,_0x4e89cb,_0x5854ca,_0x4e6283,_0x3e27b4));}}catch{}if(_0xffa004['_p_length']=!0x0,_0x31e9cc&&(_0xffa004[_0x1b3004(0x225)]=!0x0),!_0x1f02fb){var _0x3269da=[][_0x1b3004(0x208)](this[_0x1b3004(0x1f1)](_0x4e89cb))[_0x1b3004(0x208)](this[_0x1b3004(0x2a1)](_0x4e89cb));for(_0x5ed6a3=0x0,_0x30ad8c=_0x3269da[_0x1b3004(0x204)];_0x5ed6a3<_0x30ad8c;_0x5ed6a3++)if(_0x4e6283=_0x3269da[_0x5ed6a3],!(_0x210782&&_0x58fc0c[_0x1b3004(0x2b5)](_0x4e6283[_0x1b3004(0x223)]()))&&!this[_0x1b3004(0x29b)](_0x4e89cb,_0x4e6283,_0x3e27b4)&&!_0xffa004['_p_'+_0x4e6283['toString']()]){if(_0x4136c2++,_0x3e27b4['autoExpandPropertyCount']++,_0x4136c2>_0x40bf98){_0x1f02fb=!0x0;break;}if(!_0x3e27b4['isExpressionToEvaluate']&&_0x3e27b4[_0x1b3004(0x292)]&&_0x3e27b4['autoExpandPropertyCount']>_0x3e27b4[_0x1b3004(0x2a9)]){_0x1f02fb=!0x0;break;}_0x22eee1['push'](_0x49945b[_0x1b3004(0x29d)](_0x4a37bc,_0xffa004,_0x4e89cb,_0x5854ca,_0x4e6283,_0x3e27b4));}}}}}if(_0x6662ff[_0x1b3004(0x271)]=_0x5854ca,_0x1b9b8d?(_0x6662ff['value']=_0x4e89cb[_0x1b3004(0x228)](),this[_0x1b3004(0x21c)](_0x5854ca,_0x6662ff,_0x3e27b4,_0x45ba5e)):_0x5854ca===_0x1b3004(0x262)?_0x6662ff[_0x1b3004(0x246)]=this[_0x1b3004(0x22c)]['call'](_0x4e89cb):_0x5854ca===_0x1b3004(0x270)?_0x6662ff[_0x1b3004(0x246)]=_0x4e89cb['toString']():_0x5854ca===_0x1b3004(0x26a)?_0x6662ff[_0x1b3004(0x246)]=this[_0x1b3004(0x2d8)][_0x1b3004(0x24f)](_0x4e89cb):_0x5854ca===_0x1b3004(0x267)&&this[_0x1b3004(0x1f4)]?_0x6662ff[_0x1b3004(0x246)]=this['_Symbol'][_0x1b3004(0x2a5)][_0x1b3004(0x223)]['call'](_0x4e89cb):!_0x3e27b4['depth']&&!(_0x5854ca===_0x1b3004(0x2c2)||_0x5854ca==='undefined')&&(delete _0x6662ff[_0x1b3004(0x246)],_0x6662ff[_0x1b3004(0x22f)]=!0x0),_0x1f02fb&&(_0x6662ff[_0x1b3004(0x250)]=!0x0),_0x232efd=_0x3e27b4[_0x1b3004(0x294)][_0x1b3004(0x287)],_0x3e27b4['node'][_0x1b3004(0x287)]=_0x6662ff,this[_0x1b3004(0x219)](_0x6662ff,_0x3e27b4),_0x22eee1[_0x1b3004(0x204)]){for(_0x5ed6a3=0x0,_0x30ad8c=_0x22eee1[_0x1b3004(0x204)];_0x5ed6a3<_0x30ad8c;_0x5ed6a3++)_0x22eee1[_0x5ed6a3](_0x5ed6a3);}_0x4a37bc[_0x1b3004(0x204)]&&(_0x6662ff[_0x1b3004(0x241)]=_0x4a37bc);}catch(_0x22ab22){_0x52181a(_0x22ab22,_0x6662ff,_0x3e27b4);}return this[_0x1b3004(0x27d)](_0x4e89cb,_0x6662ff),this['_treeNodePropertiesAfterFullValue'](_0x6662ff,_0x3e27b4),_0x3e27b4['node']['current']=_0x232efd,_0x3e27b4['level']--,_0x3e27b4[_0x1b3004(0x292)]=_0x13d07c,_0x3e27b4[_0x1b3004(0x292)]&&_0x3e27b4['autoExpandPreviousObjects'][_0x1b3004(0x281)](),_0x6662ff;}[_0x2aa996(0x2a1)](_0x18e844){var _0x39487e=_0x2aa996;return Object[_0x39487e(0x221)]?Object[_0x39487e(0x221)](_0x18e844):[];}[_0x2aa996(0x1e4)](_0x5d2595){var _0x2d861a=_0x2aa996;return!!(_0x5d2595&&_0x4c4abf[_0x2d861a(0x1f6)]&&this['_objectToString'](_0x5d2595)===_0x2d861a(0x243)&&_0x5d2595[_0x2d861a(0x2b8)]);}[_0x2aa996(0x29b)](_0x1c858a,_0xdea40,_0x1acb4e){var _0xdb824=_0x2aa996;return _0x1acb4e[_0xdb824(0x231)]?typeof _0x1c858a[_0xdea40]==_0xdb824(0x1fb):!0x1;}['_type'](_0x26fa30){var _0x497158=_0x2aa996,_0x247bb8='';return _0x247bb8=typeof _0x26fa30,_0x247bb8===_0x497158(0x212)?this['_objectToString'](_0x26fa30)==='[object\\x20Array]'?_0x247bb8=_0x497158(0x1f0):this[_0x497158(0x247)](_0x26fa30)===_0x497158(0x256)?_0x247bb8=_0x497158(0x262):this[_0x497158(0x247)](_0x26fa30)==='[object\\x20BigInt]'?_0x247bb8=_0x497158(0x270):_0x26fa30===null?_0x247bb8='null':_0x26fa30['constructor']&&(_0x247bb8=_0x26fa30[_0x497158(0x21b)][_0x497158(0x254)]||_0x247bb8):_0x247bb8==='undefined'&&this['_HTMLAllCollection']&&_0x26fa30 instanceof this[_0x497158(0x240)]&&(_0x247bb8='HTMLAllCollection'),_0x247bb8;}[_0x2aa996(0x247)](_0x1e5629){var _0x44a087=_0x2aa996;return Object[_0x44a087(0x2a5)][_0x44a087(0x223)]['call'](_0x1e5629);}[_0x2aa996(0x2b6)](_0x34ef4a){return _0x34ef4a==='boolean'||_0x34ef4a==='string'||_0x34ef4a==='number';}['_isPrimitiveWrapperType'](_0x3ba480){var _0x943ac8=_0x2aa996;return _0x3ba480==='Boolean'||_0x3ba480==='String'||_0x3ba480===_0x943ac8(0x2c9);}[_0x2aa996(0x255)](_0x5c575e,_0x5e9063,_0x2a5b0d,_0x4e4808,_0x167cba,_0x42595f){var _0xf1b72c=this;return function(_0x3e5425){var _0x50a36a=_0x3b3b,_0x1712b5=_0x167cba[_0x50a36a(0x294)]['current'],_0x509f70=_0x167cba[_0x50a36a(0x294)][_0x50a36a(0x2d2)],_0x35683a=_0x167cba[_0x50a36a(0x294)]['parent'];_0x167cba[_0x50a36a(0x294)][_0x50a36a(0x1e5)]=_0x1712b5,_0x167cba['node'][_0x50a36a(0x2d2)]=typeof _0x4e4808==_0x50a36a(0x29e)?_0x4e4808:_0x3e5425,_0x5c575e[_0x50a36a(0x1f8)](_0xf1b72c[_0x50a36a(0x206)](_0x5e9063,_0x2a5b0d,_0x4e4808,_0x167cba,_0x42595f)),_0x167cba['node'][_0x50a36a(0x1e5)]=_0x35683a,_0x167cba[_0x50a36a(0x294)][_0x50a36a(0x2d2)]=_0x509f70;};}[_0x2aa996(0x29d)](_0x2c1d76,_0x57f004,_0x4fef64,_0x2af40a,_0xdc8558,_0xf70408,_0x4ec593){var _0x7a6ab7=_0x2aa996,_0x5c8714=this;return _0x57f004[_0x7a6ab7(0x296)+_0xdc8558['toString']()]=!0x0,function(_0xf61cb3){var _0x3fec7=_0x7a6ab7,_0x32e0af=_0xf70408[_0x3fec7(0x294)]['current'],_0x107512=_0xf70408[_0x3fec7(0x294)][_0x3fec7(0x2d2)],_0xd05bb4=_0xf70408['node']['parent'];_0xf70408[_0x3fec7(0x294)][_0x3fec7(0x1e5)]=_0x32e0af,_0xf70408['node'][_0x3fec7(0x2d2)]=_0xf61cb3,_0x2c1d76[_0x3fec7(0x1f8)](_0x5c8714[_0x3fec7(0x206)](_0x4fef64,_0x2af40a,_0xdc8558,_0xf70408,_0x4ec593)),_0xf70408['node'][_0x3fec7(0x1e5)]=_0xd05bb4,_0xf70408[_0x3fec7(0x294)][_0x3fec7(0x2d2)]=_0x107512;};}[_0x2aa996(0x206)](_0x50a44e,_0x58d8b6,_0x438a1c,_0x245b3f,_0x52207a){var _0x5e8a72=_0x2aa996,_0x4cb1d5=this;_0x52207a||(_0x52207a=function(_0x1b5bfd,_0x4e22eb){return _0x1b5bfd[_0x4e22eb];});var _0x84fc43=_0x438a1c['toString'](),_0x429c49=_0x245b3f['expressionsToEvaluate']||{},_0x2e99c2=_0x245b3f[_0x5e8a72(0x2cc)],_0x10b300=_0x245b3f[_0x5e8a72(0x1e6)];try{var _0x79ea6c=this['_isMap'](_0x50a44e),_0x3126c0=_0x84fc43;_0x79ea6c&&_0x3126c0[0x0]==='\\x27'&&(_0x3126c0=_0x3126c0[_0x5e8a72(0x28a)](0x1,_0x3126c0[_0x5e8a72(0x204)]-0x2));var _0x5131d5=_0x245b3f[_0x5e8a72(0x265)]=_0x429c49['_p_'+_0x3126c0];_0x5131d5&&(_0x245b3f[_0x5e8a72(0x2cc)]=_0x245b3f['depth']+0x1),_0x245b3f[_0x5e8a72(0x1e6)]=!!_0x5131d5;var _0x4f05fa=typeof _0x438a1c==_0x5e8a72(0x267),_0x43e85f={'name':_0x4f05fa||_0x79ea6c?_0x84fc43:this[_0x5e8a72(0x23c)](_0x84fc43)};if(_0x4f05fa&&(_0x43e85f[_0x5e8a72(0x267)]=!0x0),!(_0x58d8b6==='array'||_0x58d8b6==='Error')){var _0xab02ef=this['_getOwnPropertyDescriptor'](_0x50a44e,_0x438a1c);if(_0xab02ef&&(_0xab02ef[_0x5e8a72(0x235)]&&(_0x43e85f[_0x5e8a72(0x248)]=!0x0),_0xab02ef[_0x5e8a72(0x2d0)]&&!_0x5131d5&&!_0x245b3f[_0x5e8a72(0x2b1)]))return _0x43e85f[_0x5e8a72(0x2ca)]=!0x0,this[_0x5e8a72(0x2bd)](_0x43e85f,_0x245b3f),_0x43e85f;}var _0x47cc93;try{_0x47cc93=_0x52207a(_0x50a44e,_0x438a1c);}catch(_0x4d8119){return _0x43e85f={'name':_0x84fc43,'type':_0x5e8a72(0x229),'error':_0x4d8119[_0x5e8a72(0x23e)]},this[_0x5e8a72(0x2bd)](_0x43e85f,_0x245b3f),_0x43e85f;}var _0x4b725b=this[_0x5e8a72(0x28e)](_0x47cc93),_0x355d64=this[_0x5e8a72(0x2b6)](_0x4b725b);if(_0x43e85f[_0x5e8a72(0x271)]=_0x4b725b,_0x355d64)this[_0x5e8a72(0x2bd)](_0x43e85f,_0x245b3f,_0x47cc93,function(){var _0x56215c=_0x5e8a72;_0x43e85f[_0x56215c(0x246)]=_0x47cc93['valueOf'](),!_0x5131d5&&_0x4cb1d5[_0x56215c(0x21c)](_0x4b725b,_0x43e85f,_0x245b3f,{});});else{var _0x507903=_0x245b3f['autoExpand']&&_0x245b3f[_0x5e8a72(0x282)]<_0x245b3f[_0x5e8a72(0x236)]&&_0x245b3f[_0x5e8a72(0x263)][_0x5e8a72(0x20c)](_0x47cc93)<0x0&&_0x4b725b!==_0x5e8a72(0x1fb)&&_0x245b3f['autoExpandPropertyCount']<_0x245b3f[_0x5e8a72(0x2a9)];_0x507903||_0x245b3f[_0x5e8a72(0x282)]<_0x2e99c2||_0x5131d5?(this['serialize'](_0x43e85f,_0x47cc93,_0x245b3f,_0x5131d5||{}),this['_additionalMetadata'](_0x47cc93,_0x43e85f)):this[_0x5e8a72(0x2bd)](_0x43e85f,_0x245b3f,_0x47cc93,function(){var _0x3522e7=_0x5e8a72;_0x4b725b===_0x3522e7(0x2c2)||_0x4b725b===_0x3522e7(0x2d9)||(delete _0x43e85f['value'],_0x43e85f['capped']=!0x0);});}return _0x43e85f;}finally{_0x245b3f[_0x5e8a72(0x265)]=_0x429c49,_0x245b3f[_0x5e8a72(0x2cc)]=_0x2e99c2,_0x245b3f[_0x5e8a72(0x1e6)]=_0x10b300;}}[_0x2aa996(0x21c)](_0x53baf8,_0x2b7f5e,_0x44e2eb,_0x103772){var _0x1b88c9=_0x2aa996,_0x6a632b=_0x103772[_0x1b88c9(0x2b3)]||_0x44e2eb[_0x1b88c9(0x2b3)];if((_0x53baf8==='string'||_0x53baf8===_0x1b88c9(0x1fd))&&_0x2b7f5e['value']){let _0x447dc7=_0x2b7f5e[_0x1b88c9(0x246)][_0x1b88c9(0x204)];_0x44e2eb[_0x1b88c9(0x24b)]+=_0x447dc7,_0x44e2eb[_0x1b88c9(0x24b)]>_0x44e2eb[_0x1b88c9(0x222)]?(_0x2b7f5e['capped']='',delete _0x2b7f5e[_0x1b88c9(0x246)]):_0x447dc7>_0x6a632b&&(_0x2b7f5e['capped']=_0x2b7f5e['value'][_0x1b88c9(0x28a)](0x0,_0x6a632b),delete _0x2b7f5e[_0x1b88c9(0x246)]);}}[_0x2aa996(0x207)](_0x546a01){var _0x30c5b9=_0x2aa996;return!!(_0x546a01&&_0x4c4abf[_0x30c5b9(0x2a6)]&&this['_objectToString'](_0x546a01)===_0x30c5b9(0x2be)&&_0x546a01[_0x30c5b9(0x2b8)]);}[_0x2aa996(0x23c)](_0x5c084b){var _0x351ae0=_0x2aa996;if(_0x5c084b['match'](/^\\d+$/))return _0x5c084b;var _0x1ccca1;try{_0x1ccca1=JSON[_0x351ae0(0x29f)](''+_0x5c084b);}catch{_0x1ccca1='\\x22'+this['_objectToString'](_0x5c084b)+'\\x22';}return _0x1ccca1['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x1ccca1=_0x1ccca1['substr'](0x1,_0x1ccca1[_0x351ae0(0x204)]-0x2):_0x1ccca1=_0x1ccca1[_0x351ae0(0x2c7)](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')[_0x351ae0(0x2c7)](/(^\"|\"$)/g,'\\x27'),_0x1ccca1;}[_0x2aa996(0x2bd)](_0x279611,_0x4965ad,_0x3e9453,_0x32ee5c){var _0x4def28=_0x2aa996;this[_0x4def28(0x219)](_0x279611,_0x4965ad),_0x32ee5c&&_0x32ee5c(),this['_additionalMetadata'](_0x3e9453,_0x279611),this['_treeNodePropertiesAfterFullValue'](_0x279611,_0x4965ad);}[_0x2aa996(0x219)](_0x4f82da,_0x35f604){var _0xbdd0d6=_0x2aa996;this[_0xbdd0d6(0x2d3)](_0x4f82da,_0x35f604),this[_0xbdd0d6(0x205)](_0x4f82da,_0x35f604),this[_0xbdd0d6(0x25a)](_0x4f82da,_0x35f604),this[_0xbdd0d6(0x274)](_0x4f82da,_0x35f604);}[_0x2aa996(0x2d3)](_0x58bd6e,_0x43323a){}[_0x2aa996(0x205)](_0x1ce6c1,_0x534a90){}[_0x2aa996(0x291)](_0x39d62d,_0x369185){}[_0x2aa996(0x277)](_0x59968b){var _0x546ae1=_0x2aa996;return _0x59968b===this[_0x546ae1(0x290)];}[_0x2aa996(0x24d)](_0x1e21db,_0x721af6){var _0x29921d=_0x2aa996;this[_0x29921d(0x291)](_0x1e21db,_0x721af6),this[_0x29921d(0x210)](_0x1e21db),_0x721af6['sortProps']&&this[_0x29921d(0x252)](_0x1e21db),this[_0x29921d(0x2a7)](_0x1e21db,_0x721af6),this['_addLoadNode'](_0x1e21db,_0x721af6),this[_0x29921d(0x23a)](_0x1e21db);}[_0x2aa996(0x27d)](_0x198ccf,_0xcfd433){var _0x3aabf4=_0x2aa996;let _0x3d4d9e;try{_0x4c4abf[_0x3aabf4(0x2bf)]&&(_0x3d4d9e=_0x4c4abf[_0x3aabf4(0x2bf)][_0x3aabf4(0x224)],_0x4c4abf[_0x3aabf4(0x2bf)][_0x3aabf4(0x224)]=function(){}),_0x198ccf&&typeof _0x198ccf[_0x3aabf4(0x204)]=='number'&&(_0xcfd433[_0x3aabf4(0x204)]=_0x198ccf[_0x3aabf4(0x204)]);}catch{}finally{_0x3d4d9e&&(_0x4c4abf[_0x3aabf4(0x2bf)][_0x3aabf4(0x224)]=_0x3d4d9e);}if(_0xcfd433[_0x3aabf4(0x271)]===_0x3aabf4(0x29e)||_0xcfd433['type']==='Number'){if(isNaN(_0xcfd433[_0x3aabf4(0x246)]))_0xcfd433[_0x3aabf4(0x2d7)]=!0x0,delete _0xcfd433['value'];else switch(_0xcfd433['value']){case Number['POSITIVE_INFINITY']:_0xcfd433[_0x3aabf4(0x2a2)]=!0x0,delete _0xcfd433[_0x3aabf4(0x246)];break;case Number[_0x3aabf4(0x253)]:_0xcfd433[_0x3aabf4(0x1fe)]=!0x0,delete _0xcfd433[_0x3aabf4(0x246)];break;case 0x0:this[_0x3aabf4(0x239)](_0xcfd433[_0x3aabf4(0x246)])&&(_0xcfd433[_0x3aabf4(0x202)]=!0x0);break;}}else _0xcfd433[_0x3aabf4(0x271)]==='function'&&typeof _0x198ccf[_0x3aabf4(0x254)]==_0x3aabf4(0x2c5)&&_0x198ccf[_0x3aabf4(0x254)]&&_0xcfd433[_0x3aabf4(0x254)]&&_0x198ccf['name']!==_0xcfd433[_0x3aabf4(0x254)]&&(_0xcfd433[_0x3aabf4(0x237)]=_0x198ccf[_0x3aabf4(0x254)]);}['_isNegativeZero'](_0x4e9ba4){return 0x1/_0x4e9ba4===Number['NEGATIVE_INFINITY'];}['_sortProps'](_0x4a7bc5){var _0x4022ea=_0x2aa996;!_0x4a7bc5[_0x4022ea(0x241)]||!_0x4a7bc5[_0x4022ea(0x241)][_0x4022ea(0x204)]||_0x4a7bc5[_0x4022ea(0x271)]===_0x4022ea(0x1f0)||_0x4a7bc5[_0x4022ea(0x271)]==='Map'||_0x4a7bc5[_0x4022ea(0x271)]===_0x4022ea(0x1f6)||_0x4a7bc5['props'][_0x4022ea(0x2ce)](function(_0x1bbef5,_0x1b167a){var _0x148adf=_0x4022ea,_0x4e2aa1=_0x1bbef5[_0x148adf(0x254)][_0x148adf(0x251)](),_0x1936ce=_0x1b167a[_0x148adf(0x254)][_0x148adf(0x251)]();return _0x4e2aa1<_0x1936ce?-0x1:_0x4e2aa1>_0x1936ce?0x1:0x0;});}['_addFunctionsNode'](_0x444f3c,_0x26b0b8){var _0x3e82ac=_0x2aa996;if(!(_0x26b0b8['noFunctions']||!_0x444f3c[_0x3e82ac(0x241)]||!_0x444f3c['props']['length'])){for(var _0x1f0497=[],_0x274f24=[],_0x10e055=0x0,_0x3be9a1=_0x444f3c[_0x3e82ac(0x241)][_0x3e82ac(0x204)];_0x10e055<_0x3be9a1;_0x10e055++){var _0x3eb15a=_0x444f3c[_0x3e82ac(0x241)][_0x10e055];_0x3eb15a[_0x3e82ac(0x271)]===_0x3e82ac(0x1fb)?_0x1f0497['push'](_0x3eb15a):_0x274f24['push'](_0x3eb15a);}if(!(!_0x274f24[_0x3e82ac(0x204)]||_0x1f0497['length']<=0x1)){_0x444f3c[_0x3e82ac(0x241)]=_0x274f24;var _0x334441={'functionsNode':!0x0,'props':_0x1f0497};this[_0x3e82ac(0x2d3)](_0x334441,_0x26b0b8),this[_0x3e82ac(0x291)](_0x334441,_0x26b0b8),this[_0x3e82ac(0x210)](_0x334441),this[_0x3e82ac(0x274)](_0x334441,_0x26b0b8),_0x334441['id']+='\\x20f',_0x444f3c[_0x3e82ac(0x241)]['unshift'](_0x334441);}}}[_0x2aa996(0x261)](_0x3d12b6,_0x131e00){}['_setNodeExpandableState'](_0x14b669){}[_0x2aa996(0x233)](_0x57a09d){var _0x2549de=_0x2aa996;return Array[_0x2549de(0x1f2)](_0x57a09d)||typeof _0x57a09d==_0x2549de(0x212)&&this['_objectToString'](_0x57a09d)==='[object\\x20Array]';}[_0x2aa996(0x274)](_0x11b45a,_0x10d591){}[_0x2aa996(0x23a)](_0x1e290f){var _0xe8d511=_0x2aa996;delete _0x1e290f[_0xe8d511(0x276)],delete _0x1e290f[_0xe8d511(0x26e)],delete _0x1e290f[_0xe8d511(0x297)];}[_0x2aa996(0x25a)](_0x17a883,_0x57ad42){}}let _0x21f4f2=new _0x108064(),_0x2d5033={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x4fb984={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x4078d4(_0x165397,_0x388b31,_0x578543,_0x53a38a,_0x4d70bb,_0x4c9c62){var _0x574dab=_0x2aa996;let _0x40a684,_0x1a3c68;try{_0x1a3c68=_0x4cbcec(),_0x40a684=_0x4fb570[_0x388b31],!_0x40a684||_0x1a3c68-_0x40a684['ts']>0x1f4&&_0x40a684[_0x574dab(0x258)]&&_0x40a684[_0x574dab(0x266)]/_0x40a684[_0x574dab(0x258)]<0x64?(_0x4fb570[_0x388b31]=_0x40a684={'count':0x0,'time':0x0,'ts':_0x1a3c68},_0x4fb570[_0x574dab(0x2b9)]={}):_0x1a3c68-_0x4fb570[_0x574dab(0x2b9)]['ts']>0x32&&_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x258)]&&_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x266)]/_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x258)]<0x64&&(_0x4fb570[_0x574dab(0x2b9)]={});let _0x13694b=[],_0x3fb0a1=_0x40a684[_0x574dab(0x230)]||_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x230)]?_0x4fb984:_0x2d5033,_0x3da449=_0x46ea86=>{var _0x1c251a=_0x574dab;let _0x1315be={};return _0x1315be['props']=_0x46ea86[_0x1c251a(0x241)],_0x1315be['elements']=_0x46ea86[_0x1c251a(0x1ef)],_0x1315be[_0x1c251a(0x2b3)]=_0x46ea86[_0x1c251a(0x2b3)],_0x1315be['totalStrLength']=_0x46ea86[_0x1c251a(0x222)],_0x1315be[_0x1c251a(0x2a9)]=_0x46ea86['autoExpandLimit'],_0x1315be[_0x1c251a(0x236)]=_0x46ea86[_0x1c251a(0x236)],_0x1315be[_0x1c251a(0x272)]=!0x1,_0x1315be[_0x1c251a(0x231)]=!_0x5f4d5b,_0x1315be[_0x1c251a(0x2cc)]=0x1,_0x1315be[_0x1c251a(0x282)]=0x0,_0x1315be[_0x1c251a(0x227)]='root_exp_id',_0x1315be[_0x1c251a(0x201)]=_0x1c251a(0x245),_0x1315be[_0x1c251a(0x292)]=!0x0,_0x1315be[_0x1c251a(0x263)]=[],_0x1315be[_0x1c251a(0x275)]=0x0,_0x1315be[_0x1c251a(0x2b1)]=!0x0,_0x1315be[_0x1c251a(0x24b)]=0x0,_0x1315be[_0x1c251a(0x294)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x1315be;};for(var _0x55471d=0x0;_0x55471d<_0x4d70bb[_0x574dab(0x204)];_0x55471d++)_0x13694b[_0x574dab(0x1f8)](_0x21f4f2[_0x574dab(0x23f)]({'timeNode':_0x165397===_0x574dab(0x266)||void 0x0},_0x4d70bb[_0x55471d],_0x3da449(_0x3fb0a1),{}));if(_0x165397===_0x574dab(0x28b)){let _0x335318=Error[_0x574dab(0x2c1)];try{Error[_0x574dab(0x2c1)]=0x1/0x0,_0x13694b[_0x574dab(0x1f8)](_0x21f4f2[_0x574dab(0x23f)]({'stackNode':!0x0},new Error()[_0x574dab(0x2d4)],_0x3da449(_0x3fb0a1),{'strLength':0x1/0x0}));}finally{Error[_0x574dab(0x2c1)]=_0x335318;}}return{'method':'log','version':_0xd186fc,'args':[{'ts':_0x578543,'session':_0x53a38a,'args':_0x13694b,'id':_0x388b31,'context':_0x4c9c62}]};}catch(_0x121f0c){return{'method':_0x574dab(0x1e3),'version':_0xd186fc,'args':[{'ts':_0x578543,'session':_0x53a38a,'args':[{'type':'unknown','error':_0x121f0c&&_0x121f0c[_0x574dab(0x23e)]}],'id':_0x388b31,'context':_0x4c9c62}]};}finally{try{if(_0x40a684&&_0x1a3c68){let _0xfb3e07=_0x4cbcec();_0x40a684['count']++,_0x40a684['time']+=_0x1ac05c(_0x1a3c68,_0xfb3e07),_0x40a684['ts']=_0xfb3e07,_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x258)]++,_0x4fb570['hits'][_0x574dab(0x266)]+=_0x1ac05c(_0x1a3c68,_0xfb3e07),_0x4fb570[_0x574dab(0x2b9)]['ts']=_0xfb3e07,(_0x40a684[_0x574dab(0x258)]>0x32||_0x40a684['time']>0x64)&&(_0x40a684[_0x574dab(0x230)]=!0x0),(_0x4fb570[_0x574dab(0x2b9)]['count']>0x3e8||_0x4fb570[_0x574dab(0x2b9)]['time']>0x12c)&&(_0x4fb570[_0x574dab(0x2b9)][_0x574dab(0x230)]=!0x0);}}catch{}}}return _0x4078d4;}((_0x1bc240,_0x587fa5,_0x115d4d,_0x2e86b0,_0x5979fc,_0x285b10,_0x1cd90c,_0xd18e44,_0x359b94,_0x236b9c,_0x5b8c4e)=>{var _0x182bfb=_0x56c922;if(_0x1bc240[_0x182bfb(0x1e9)])return _0x1bc240[_0x182bfb(0x1e9)];if(!X(_0x1bc240,_0xd18e44,_0x5979fc))return _0x1bc240['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1bc240[_0x182bfb(0x1e9)];let _0x541303=b(_0x1bc240),_0x467f54=_0x541303['elapsed'],_0x8d6c78=_0x541303['timeStamp'],_0x1e74be=_0x541303[_0x182bfb(0x2da)],_0x37c7fa={'hits':{},'ts':{}},_0x352b13=H(_0x1bc240,_0x359b94,_0x37c7fa,_0x285b10),_0x44bd89=_0x29c382=>{_0x37c7fa['ts'][_0x29c382]=_0x8d6c78();},_0xb5c5dd=(_0x5e67d4,_0x52e328)=>{var _0x1b3d2c=_0x182bfb;let _0x495942=_0x37c7fa['ts'][_0x52e328];if(delete _0x37c7fa['ts'][_0x52e328],_0x495942){let _0x46aae6=_0x467f54(_0x495942,_0x8d6c78());_0x3fb1c2(_0x352b13(_0x1b3d2c(0x266),_0x5e67d4,_0x1e74be(),_0x5d76e0,[_0x46aae6],_0x52e328));}},_0x529e90=_0x566d9c=>{var _0x257592=_0x182bfb,_0x5e4ff7;return _0x5979fc==='next.js'&&_0x1bc240[_0x257592(0x211)]&&((_0x5e4ff7=_0x566d9c==null?void 0x0:_0x566d9c[_0x257592(0x288)])==null?void 0x0:_0x5e4ff7[_0x257592(0x204)])&&(_0x566d9c[_0x257592(0x288)][0x0][_0x257592(0x211)]=_0x1bc240['origin']),_0x566d9c;};_0x1bc240[_0x182bfb(0x1e9)]={'consoleLog':(_0x423533,_0x700b02)=>{var _0x481dcb=_0x182bfb;_0x1bc240[_0x481dcb(0x2bf)][_0x481dcb(0x1e3)][_0x481dcb(0x254)]!==_0x481dcb(0x200)&&_0x3fb1c2(_0x352b13('log',_0x423533,_0x1e74be(),_0x5d76e0,_0x700b02));},'consoleTrace':(_0x451592,_0x42df36)=>{var _0x3dde74=_0x182bfb;_0x1bc240['console']['log'][_0x3dde74(0x254)]!==_0x3dde74(0x2ae)&&_0x3fb1c2(_0x529e90(_0x352b13(_0x3dde74(0x28b),_0x451592,_0x1e74be(),_0x5d76e0,_0x42df36)));},'consoleTime':_0x11f338=>{_0x44bd89(_0x11f338);},'consoleTimeEnd':(_0x1fcefb,_0x3fdac2)=>{_0xb5c5dd(_0x3fdac2,_0x1fcefb);},'autoLog':(_0x969633,_0x2d774c)=>{_0x3fb1c2(_0x352b13('log',_0x2d774c,_0x1e74be(),_0x5d76e0,[_0x969633]));},'autoLogMany':(_0x125b5d,_0x1223c0)=>{var _0x4f386b=_0x182bfb;_0x3fb1c2(_0x352b13(_0x4f386b(0x1e3),_0x125b5d,_0x1e74be(),_0x5d76e0,_0x1223c0));},'autoTrace':(_0x1eff13,_0x1eee3f)=>{_0x3fb1c2(_0x529e90(_0x352b13('trace',_0x1eee3f,_0x1e74be(),_0x5d76e0,[_0x1eff13])));},'autoTraceMany':(_0x19f883,_0x2fab40)=>{var _0x514fce=_0x182bfb;_0x3fb1c2(_0x529e90(_0x352b13(_0x514fce(0x28b),_0x19f883,_0x1e74be(),_0x5d76e0,_0x2fab40)));},'autoTime':(_0x1a7f82,_0x5c829c,_0x17c4f8)=>{_0x44bd89(_0x17c4f8);},'autoTimeEnd':(_0x5a7040,_0x33de4f,_0x36c8ab)=>{_0xb5c5dd(_0x33de4f,_0x36c8ab);},'coverage':_0x45e47b=>{var _0x42a44e=_0x182bfb;_0x3fb1c2({'method':_0x42a44e(0x286),'version':_0x285b10,'args':[{'id':_0x45e47b}]});}};let _0x3fb1c2=q(_0x1bc240,_0x587fa5,_0x115d4d,_0x2e86b0,_0x5979fc,_0x236b9c,_0x5b8c4e),_0x5d76e0=_0x1bc240['_console_ninja_session'];return _0x1bc240[_0x182bfb(0x1e9)];})(globalThis,'127.0.0.1',_0x56c922(0x1fa),_0x56c922(0x28c),'webpack','1.0.0',_0x56c922(0x2aa),_0x56c922(0x218),_0x56c922(0x22d),_0x56c922(0x244),_0x56c922(0x28d));"
            )
        );
    } catch (e) {}
}
/* istanbul ignore next */ function oo_oo(i: string, ...v: any[]) {
    try {
        oo_cm().consoleLog(i, v);
    } catch (e) {}
    return v;
}
oo_oo;
/* istanbul ignore next */ function oo_tr(i: string, ...v: any[]) {
    try {
        oo_cm().consoleTrace(i, v);
    } catch (e) {}
    return v;
}
oo_tr;
/* istanbul ignore next */ function oo_ts(v?: string): string {
    try {
        oo_cm().consoleTime(v);
    } catch (e) {}
    return v as string;
}
oo_ts;
/* istanbul ignore next */ function oo_te(v: string | undefined, i: string): string {
    try {
        oo_cm().consoleTimeEnd(v, i);
    } catch (e) {}
    return v as string;
}
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/
