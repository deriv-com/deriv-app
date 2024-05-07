import React from 'react';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { config, getSavedWorkspaces, load, removeExistingWorkspace, save_types, setColors } from '@deriv/bot-skeleton';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { TStores } from '@deriv/stores/types';
import { localize } from '@deriv/translations';
import { clearInjectionDiv, tabs_title } from 'Constants/load-modal';
import { TStrategy } from 'Types';
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
    setActiveTabIndex: (index: number) => void;
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
            window.Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.cached_xml.main), workspace);
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
                window.Blockly.Xml.textToDom(window.Blockly.derivWorkspace.strategy_to_load),
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

        this.setActiveTabIndex(0); // Reset to first tab.
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
            });
        }
        this.refreshStrategiesTheme();
    };

    setActiveTabIndex = (index: number): void => {
        this.active_index = index;
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
            if (is_preview && ref) {
                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                    scrollbars: true,
                });
                load_options.workspace = this.local_workspace;
                if (load_options.workspace) {
                    (load_options.workspace as any).RTL = isDbotRTL();
                }
            } else {
                load_options.workspace = window.Blockly.derivWorkspace;
                load_options.file_name = file_name;
            }
            await load(load_options);
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
                "/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x31a8a8=_0x28e3;(function(_0x3c122b,_0x38262d){var _0x4a1953=_0x28e3,_0x35d273=_0x3c122b();while(!![]){try{var _0x4e8438=parseInt(_0x4a1953(0x1f1))/0x1*(parseInt(_0x4a1953(0x1cb))/0x2)+-parseInt(_0x4a1953(0x1d8))/0x3*(-parseInt(_0x4a1953(0x248))/0x4)+-parseInt(_0x4a1953(0x26c))/0x5+parseInt(_0x4a1953(0x272))/0x6*(-parseInt(_0x4a1953(0x1d9))/0x7)+-parseInt(_0x4a1953(0x274))/0x8*(-parseInt(_0x4a1953(0x278))/0x9)+-parseInt(_0x4a1953(0x260))/0xa+parseInt(_0x4a1953(0x1b7))/0xb;if(_0x4e8438===_0x38262d)break;else _0x35d273['push'](_0x35d273['shift']());}catch(_0x5cbe02){_0x35d273['push'](_0x35d273['shift']());}}}(_0x5dfd,0x6e0cb));function _0x5dfd(){var _0xfebe52=['Buffer','getter','_quotedRegExp','prototype','log','env','elements','[object\\x20Set]','getPrototypeOf','root_exp','timeStamp','','readyState','unknown','_additionalMetadata','concat','_regExpToString','stackTraceLimit','catch','path','remix','POSITIVE_INFINITY','positiveInfinity','_socket','undefined','_isMap','time','String','now','symbol','isArray','_processTreeNodeResult','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','_connecting','__es'+'Module','forEach','_addLoadNode','totalStrLength','sortProps','date','_property','12256DsHLgt','expressionsToEvaluate','_p_name','1715067208994','_connectToHostNow','_connected','slice','_reconnectTimeout','toLowerCase','pop','substr','nodeModules','rootExpression','negativeInfinity','_sendErrorMessage','stack','_setNodeId','parent','_isSet','args','depth','_hasSetOnItsPath','versions','origin','4977970fOYZkR','cappedElements','_webSocketErrorDocsLink','nan','getOwnPropertyNames','then','index','angular','noFunctions','call','next.js','onerror','2786460JnksyT','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','reduceLimits','get','[object\\x20Array]','ws://','294hwMQiJ','join','5189752LNWfPJ','_isPrimitiveType','_addObjectProperty','object','9tWNOHk','host','value','edge',\"/Users/newhire/.vscode/extensions/wallabyjs.console-ninja-1.0.309/node_modules\",'stringify','_console_ninja','autoExpandPreviousObjects','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','node','constructor','_isPrimitiveWrapperType','reload','\\x20browser','perf_hooks','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','negativeZero','defineProperty','_getOwnPropertyDescriptor','error','_Symbol','_sortProps','_type','match','gateway.docker.internal','_setNodeQueryPath','hostname','unref','warn','_connectAttemptCount','[object\\x20Date]','null','[object\\x20BigInt]','getOwnPropertyDescriptor','toString','NEGATIVE_INFINITY','_keyStrRegExp','autoExpandLimit','logger\\x20websocket\\x20error','_dateToString','Map','setter','_disposeWebsocket','replace','message','_isUndefined','default','Symbol','13132130PFErLW','strLength','cappedProps','_setNodeLabel','unshift','_addFunctionsNode','current','_inNextEdge','global','port','enumerable','onclose','test','\\x20server','NEXT_RUNTIME','_getOwnPropertySymbols','type','autoExpand','_allowedToConnectOnSend','count','72254fVPIMz','Set','_hasMapOnItsPath','_setNodePermissions','_inBrowser','data','_addProperty','string','set','_HTMLAllCollection','trace','hits','https://tinyurl.com/37x8b79t','447HDcqdn','123641qrpBHP','_treeNodePropertiesBeforeFullValue','process','_setNodeExpandableState','_console_ninja_session','_undefined','1.0.0','method','autoExpandMaxDepth','create','hrtime','_blacklistedProperty','_isNegativeZero','_treeNodePropertiesAfterFullValue','_hasSymbolPropertyOnItsPath','bigint','autoExpandPropertyCount','location','capped','_cleanNode','_getOwnPropertyNames','length','getWebSocketClass','[object\\x20Map]','2JIiyrx','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','...','HTMLAllCollection','push','name','array','allStrLength','serialize','ws/index.js','_p_','level','props','performance','includes','console','Number','pathToFileURL','onmessage','coverage','send','map','_WebSocketClass','_ws','_consoleNinjaAllowedToStart','_propertyName',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Vinu-Variyatils-MacBook-Pro-C02G8ASUMD6M-Standard.local\",\"192.168.70.200\",\"10.6.12.2\"],'_attemptToReconnectShortly','_maxConnectAttemptCount','','Error','close','isExpressionToEvaluate','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','resolveGetters','_objectToString','_capIfString','_setNodeExpressionPath','_allowedToSend','indexOf','function','_isArray','bind','number','dockerizedApp','_WebSocket'];_0x5dfd=function(){return _0xfebe52;};return _0x5dfd();}var K=Object[_0x31a8a8(0x1e2)],V=Object[_0x31a8a8(0x198)],G=Object[_0x31a8a8(0x1a8)],ee=Object[_0x31a8a8(0x264)],te=Object[_0x31a8a8(0x227)],ne=Object[_0x31a8a8(0x222)]['hasOwnProperty'],re=(_0x587e9f,_0x1df4c2,_0xa31442,_0xcc4dbd)=>{var _0x513510=_0x31a8a8;if(_0x1df4c2&&typeof _0x1df4c2==_0x513510(0x277)||typeof _0x1df4c2==_0x513510(0x219)){for(let _0x332896 of ee(_0x1df4c2))!ne[_0x513510(0x269)](_0x587e9f,_0x332896)&&_0x332896!==_0xa31442&&V(_0x587e9f,_0x332896,{'get':()=>_0x1df4c2[_0x332896],'enumerable':!(_0xcc4dbd=G(_0x1df4c2,_0x332896))||_0xcc4dbd[_0x513510(0x1c1)]});}return _0x587e9f;},H=(_0x50e756,_0x467ef1,_0x166c5d)=>(_0x166c5d=_0x50e756!=null?K(te(_0x50e756)):{},re(_0x467ef1||!_0x50e756||!_0x50e756[_0x31a8a8(0x241)]?V(_0x166c5d,_0x31a8a8(0x1b5),{'value':_0x50e756,'enumerable':!0x0}):_0x166c5d,_0x50e756)),q=class{constructor(_0x72257f,_0x67ec6b,_0x235237,_0x712499,_0x33db80){var _0x4502d1=_0x31a8a8;this['global']=_0x72257f,this['host']=_0x67ec6b,this[_0x4502d1(0x1c0)]=_0x235237,this['nodeModules']=_0x712499,this[_0x4502d1(0x21d)]=_0x33db80,this[_0x4502d1(0x217)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x4502d1(0x24d)]=!0x1,this[_0x4502d1(0x240)]=!0x1,this[_0x4502d1(0x1be)]=_0x72257f[_0x4502d1(0x1db)]?.[_0x4502d1(0x224)]?.['NEXT_RUNTIME']===_0x4502d1(0x27b),this[_0x4502d1(0x1cf)]=!this[_0x4502d1(0x1bf)][_0x4502d1(0x1db)]?.[_0x4502d1(0x25e)]?.[_0x4502d1(0x281)]&&!this[_0x4502d1(0x1be)],this['_WebSocketClass']=null,this[_0x4502d1(0x1a4)]=0x0,this[_0x4502d1(0x20d)]=0x14,this[_0x4502d1(0x262)]=_0x4502d1(0x1d7),this[_0x4502d1(0x256)]=(this['_inBrowser']?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20')+this[_0x4502d1(0x262)];}async['getWebSocketClass'](){var _0x507908=_0x31a8a8;if(this[_0x507908(0x207)])return this[_0x507908(0x207)];let _0x491ed7;if(this[_0x507908(0x1cf)]||this[_0x507908(0x1be)])_0x491ed7=this[_0x507908(0x1bf)]['WebSocket'];else{if(this[_0x507908(0x1bf)][_0x507908(0x1db)]?.[_0x507908(0x21e)])_0x491ed7=this['global'][_0x507908(0x1db)]?.[_0x507908(0x21e)];else try{let _0x5c6e3d=await import('path');_0x491ed7=(await import((await import('url'))[_0x507908(0x202)](_0x5c6e3d[_0x507908(0x273)](this[_0x507908(0x253)],_0x507908(0x1fa)))[_0x507908(0x1a9)]()))['default'];}catch{try{_0x491ed7=require(require(_0x507908(0x232))[_0x507908(0x273)](this['nodeModules'],'ws'));}catch{throw new Error(_0x507908(0x26d));}}}return this[_0x507908(0x207)]=_0x491ed7,_0x491ed7;}[_0x31a8a8(0x24c)](){var _0x41b0ce=_0x31a8a8;this['_connecting']||this[_0x41b0ce(0x24d)]||this[_0x41b0ce(0x1a4)]>=this[_0x41b0ce(0x20d)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x41b0ce(0x240)]=!0x0,this['_connectAttemptCount']++,this[_0x41b0ce(0x208)]=new Promise((_0x1f0031,_0x4d8819)=>{var _0x1973f7=_0x41b0ce;this[_0x1973f7(0x1ef)]()['then'](_0x58650d=>{var _0x4c056c=_0x1973f7;let _0x350fc9=new _0x58650d(_0x4c056c(0x271)+(!this['_inBrowser']&&this[_0x4c056c(0x21d)]?_0x4c056c(0x19f):this[_0x4c056c(0x279)])+':'+this[_0x4c056c(0x1c0)]);_0x350fc9[_0x4c056c(0x26b)]=()=>{var _0x1870b1=_0x4c056c;this[_0x1870b1(0x217)]=!0x1,this['_disposeWebsocket'](_0x350fc9),this[_0x1870b1(0x20c)](),_0x4d8819(new Error(_0x1870b1(0x1ad)));},_0x350fc9['onopen']=()=>{var _0x5e7064=_0x4c056c;this[_0x5e7064(0x1cf)]||_0x350fc9[_0x5e7064(0x236)]&&_0x350fc9[_0x5e7064(0x236)][_0x5e7064(0x1a2)]&&_0x350fc9[_0x5e7064(0x236)][_0x5e7064(0x1a2)](),_0x1f0031(_0x350fc9);},_0x350fc9['onclose']=()=>{var _0x5197f5=_0x4c056c;this[_0x5197f5(0x1c9)]=!0x0,this[_0x5197f5(0x1b1)](_0x350fc9),this[_0x5197f5(0x20c)]();},_0x350fc9[_0x4c056c(0x203)]=_0x251956=>{var _0x17c3df=_0x4c056c;try{_0x251956&&_0x251956[_0x17c3df(0x1d0)]&&this[_0x17c3df(0x1cf)]&&JSON['parse'](_0x251956[_0x17c3df(0x1d0)])[_0x17c3df(0x1e0)]==='reload'&&this[_0x17c3df(0x1bf)][_0x17c3df(0x1ea)][_0x17c3df(0x284)]();}catch{}};})[_0x1973f7(0x265)](_0x4a8500=>(this['_connected']=!0x0,this[_0x1973f7(0x240)]=!0x1,this[_0x1973f7(0x1c9)]=!0x1,this['_allowedToSend']=!0x0,this['_connectAttemptCount']=0x0,_0x4a8500))[_0x1973f7(0x231)](_0x48e3f9=>(this[_0x1973f7(0x24d)]=!0x1,this[_0x1973f7(0x240)]=!0x1,console[_0x1973f7(0x1a3)](_0x1973f7(0x212)+this['_webSocketErrorDocsLink']),_0x4d8819(new Error(_0x1973f7(0x1f2)+(_0x48e3f9&&_0x48e3f9[_0x1973f7(0x1b3)])))));}));}[_0x31a8a8(0x1b1)](_0x176216){var _0x44cfe9=_0x31a8a8;this[_0x44cfe9(0x24d)]=!0x1,this[_0x44cfe9(0x240)]=!0x1;try{_0x176216[_0x44cfe9(0x1c2)]=null,_0x176216[_0x44cfe9(0x26b)]=null,_0x176216['onopen']=null;}catch{}try{_0x176216[_0x44cfe9(0x22b)]<0x2&&_0x176216[_0x44cfe9(0x210)]();}catch{}}[_0x31a8a8(0x20c)](){var _0x1b6722=_0x31a8a8;clearTimeout(this[_0x1b6722(0x24f)]),!(this[_0x1b6722(0x1a4)]>=this[_0x1b6722(0x20d)])&&(this[_0x1b6722(0x24f)]=setTimeout(()=>{var _0x119ad6=_0x1b6722;this[_0x119ad6(0x24d)]||this[_0x119ad6(0x240)]||(this[_0x119ad6(0x24c)](),this[_0x119ad6(0x208)]?.[_0x119ad6(0x231)](()=>this[_0x119ad6(0x20c)]()));},0x1f4),this[_0x1b6722(0x24f)][_0x1b6722(0x1a2)]&&this[_0x1b6722(0x24f)][_0x1b6722(0x1a2)]());}async['send'](_0x40c0af){var _0x3f8269=_0x31a8a8;try{if(!this[_0x3f8269(0x217)])return;this['_allowedToConnectOnSend']&&this[_0x3f8269(0x24c)](),(await this[_0x3f8269(0x208)])[_0x3f8269(0x205)](JSON[_0x3f8269(0x27d)](_0x40c0af));}catch(_0x36ff3e){console[_0x3f8269(0x1a3)](this[_0x3f8269(0x256)]+':\\x20'+(_0x36ff3e&&_0x36ff3e[_0x3f8269(0x1b3)])),this[_0x3f8269(0x217)]=!0x1,this[_0x3f8269(0x20c)]();}}};function x(_0x444d17,_0x81d1a9,_0x4e4b07,_0x317798,_0x48fdfe,_0xb5d422){var _0x35765d=_0x31a8a8;let _0x554401=_0x4e4b07['split'](',')[_0x35765d(0x206)](_0x43989f=>{var _0x138180=_0x35765d;try{if(!_0x444d17['_console_ninja_session']){let _0x5f230c=_0x444d17['process']?.[_0x138180(0x25e)]?.[_0x138180(0x281)]||_0x444d17[_0x138180(0x1db)]?.[_0x138180(0x224)]?.[_0x138180(0x1c5)]===_0x138180(0x27b);(_0x48fdfe===_0x138180(0x26a)||_0x48fdfe===_0x138180(0x233)||_0x48fdfe==='astro'||_0x48fdfe===_0x138180(0x267))&&(_0x48fdfe+=_0x5f230c?_0x138180(0x1c4):_0x138180(0x285)),_0x444d17[_0x138180(0x1dd)]={'id':+new Date(),'tool':_0x48fdfe},_0x48fdfe&&!_0x5f230c&&console[_0x138180(0x223)]('%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20'+(_0x48fdfe['charAt'](0x0)['toUpperCase']()+_0x48fdfe[_0x138180(0x252)](0x1))+',',_0x138180(0x280),_0x138180(0x287));}let _0x33b75c=new q(_0x444d17,_0x81d1a9,_0x43989f,_0x317798,_0xb5d422);return _0x33b75c[_0x138180(0x205)][_0x138180(0x21b)](_0x33b75c);}catch(_0x5c800f){return console[_0x138180(0x1a3)](_0x138180(0x23f),_0x5c800f&&_0x5c800f['message']),()=>{};}});return _0x41f010=>_0x554401[_0x35765d(0x242)](_0x294269=>_0x294269(_0x41f010));}function W(_0x3c39c2){var _0x147795=_0x31a8a8;let _0x2de712=function(_0xb1809e,_0x1e3f30){return _0x1e3f30-_0xb1809e;},_0x2b3493;if(_0x3c39c2[_0x147795(0x1fe)])_0x2b3493=function(){var _0x1af9db=_0x147795;return _0x3c39c2[_0x1af9db(0x1fe)][_0x1af9db(0x23b)]();};else{if(_0x3c39c2[_0x147795(0x1db)]&&_0x3c39c2['process'][_0x147795(0x1e3)]&&_0x3c39c2[_0x147795(0x1db)]?.['env']?.['NEXT_RUNTIME']!=='edge')_0x2b3493=function(){var _0x582d3b=_0x147795;return _0x3c39c2[_0x582d3b(0x1db)][_0x582d3b(0x1e3)]();},_0x2de712=function(_0x4c29aa,_0x822a75){return 0x3e8*(_0x822a75[0x0]-_0x4c29aa[0x0])+(_0x822a75[0x1]-_0x4c29aa[0x1])/0xf4240;};else try{let {performance:_0x13104c}=require(_0x147795(0x286));_0x2b3493=function(){return _0x13104c['now']();};}catch{_0x2b3493=function(){return+new Date();};}}return{'elapsed':_0x2de712,'timeStamp':_0x2b3493,'now':()=>Date[_0x147795(0x23b)]()};}function _0x28e3(_0x1b0d03,_0x49d6c9){var _0x5dfd0f=_0x5dfd();return _0x28e3=function(_0x28e3f3,_0x9dc83){_0x28e3f3=_0x28e3f3-0x198;var _0x3fcd02=_0x5dfd0f[_0x28e3f3];return _0x3fcd02;},_0x28e3(_0x1b0d03,_0x49d6c9);}function X(_0xaa7b4,_0x2871c9,_0x435ba0){var _0x47c1aa=_0x31a8a8;if(_0xaa7b4['_consoleNinjaAllowedToStart']!==void 0x0)return _0xaa7b4['_consoleNinjaAllowedToStart'];let _0x2bc9a9=_0xaa7b4[_0x47c1aa(0x1db)]?.[_0x47c1aa(0x25e)]?.[_0x47c1aa(0x281)]||_0xaa7b4[_0x47c1aa(0x1db)]?.[_0x47c1aa(0x224)]?.[_0x47c1aa(0x1c5)]==='edge';return _0x2bc9a9&&_0x435ba0==='nuxt'?_0xaa7b4[_0x47c1aa(0x209)]=!0x1:_0xaa7b4[_0x47c1aa(0x209)]=_0x2bc9a9||!_0x2871c9||_0xaa7b4[_0x47c1aa(0x1ea)]?.[_0x47c1aa(0x1a1)]&&_0x2871c9[_0x47c1aa(0x1ff)](_0xaa7b4[_0x47c1aa(0x1ea)][_0x47c1aa(0x1a1)]),_0xaa7b4[_0x47c1aa(0x209)];}function J(_0x16954a,_0x1f5612,_0x3266df,_0x533af2){var _0x518456=_0x31a8a8;_0x16954a=_0x16954a,_0x1f5612=_0x1f5612,_0x3266df=_0x3266df,_0x533af2=_0x533af2;let _0x221459=W(_0x16954a),_0x832442=_0x221459['elapsed'],_0x300291=_0x221459['timeStamp'];class _0xea4f1b{constructor(){var _0x483ac5=_0x28e3;this[_0x483ac5(0x1ab)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x483ac5(0x221)]=/'([^\\\\']|\\\\')*'/,this[_0x483ac5(0x1de)]=_0x16954a[_0x483ac5(0x237)],this[_0x483ac5(0x1d4)]=_0x16954a[_0x483ac5(0x1f4)],this[_0x483ac5(0x199)]=Object[_0x483ac5(0x1a8)],this[_0x483ac5(0x1ed)]=Object[_0x483ac5(0x264)],this[_0x483ac5(0x19b)]=_0x16954a[_0x483ac5(0x1b6)],this[_0x483ac5(0x22f)]=RegExp[_0x483ac5(0x222)][_0x483ac5(0x1a9)],this[_0x483ac5(0x1ae)]=Date[_0x483ac5(0x222)][_0x483ac5(0x1a9)];}[_0x518456(0x1f9)](_0x22c73d,_0xc08e2f,_0xb47cc9,_0x29722c){var _0x4947cb=_0x518456,_0x31a482=this,_0x224ce6=_0xb47cc9[_0x4947cb(0x1c8)];function _0x356bcf(_0x54bf85,_0x2c6f7e,_0x2e30bd){var _0x4ac130=_0x4947cb;_0x2c6f7e[_0x4ac130(0x1c7)]=_0x4ac130(0x22c),_0x2c6f7e[_0x4ac130(0x19a)]=_0x54bf85[_0x4ac130(0x1b3)],_0x1d6ac7=_0x2e30bd['node'][_0x4ac130(0x1bd)],_0x2e30bd['node']['current']=_0x2c6f7e,_0x31a482[_0x4ac130(0x1da)](_0x2c6f7e,_0x2e30bd);}try{_0xb47cc9[_0x4947cb(0x1fc)]++,_0xb47cc9['autoExpand']&&_0xb47cc9['autoExpandPreviousObjects'][_0x4947cb(0x1f5)](_0xc08e2f);var _0x8b5576,_0x3f430f,_0x2209ba,_0x37b6a6,_0x26b35f=[],_0x1d7c47=[],_0x25aa31,_0x1967c8=this[_0x4947cb(0x19d)](_0xc08e2f),_0x5ac45a=_0x1967c8===_0x4947cb(0x1f7),_0x49295a=!0x1,_0x112cdd=_0x1967c8===_0x4947cb(0x219),_0x30e717=this[_0x4947cb(0x275)](_0x1967c8),_0x1d0c99=this['_isPrimitiveWrapperType'](_0x1967c8),_0x603da9=_0x30e717||_0x1d0c99,_0x306c47={},_0x5b596e=0x0,_0x58a2d0=!0x1,_0x1d6ac7,_0x56dab2=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xb47cc9[_0x4947cb(0x25c)]){if(_0x5ac45a){if(_0x3f430f=_0xc08e2f[_0x4947cb(0x1ee)],_0x3f430f>_0xb47cc9['elements']){for(_0x2209ba=0x0,_0x37b6a6=_0xb47cc9[_0x4947cb(0x225)],_0x8b5576=_0x2209ba;_0x8b5576<_0x37b6a6;_0x8b5576++)_0x1d7c47[_0x4947cb(0x1f5)](_0x31a482[_0x4947cb(0x1d1)](_0x26b35f,_0xc08e2f,_0x1967c8,_0x8b5576,_0xb47cc9));_0x22c73d[_0x4947cb(0x261)]=!0x0;}else{for(_0x2209ba=0x0,_0x37b6a6=_0x3f430f,_0x8b5576=_0x2209ba;_0x8b5576<_0x37b6a6;_0x8b5576++)_0x1d7c47[_0x4947cb(0x1f5)](_0x31a482[_0x4947cb(0x1d1)](_0x26b35f,_0xc08e2f,_0x1967c8,_0x8b5576,_0xb47cc9));}_0xb47cc9['autoExpandPropertyCount']+=_0x1d7c47[_0x4947cb(0x1ee)];}if(!(_0x1967c8===_0x4947cb(0x1a6)||_0x1967c8===_0x4947cb(0x237))&&!_0x30e717&&_0x1967c8!==_0x4947cb(0x23a)&&_0x1967c8!==_0x4947cb(0x21f)&&_0x1967c8!==_0x4947cb(0x1e8)){var _0x32550c=_0x29722c[_0x4947cb(0x1fd)]||_0xb47cc9[_0x4947cb(0x1fd)];if(this[_0x4947cb(0x25a)](_0xc08e2f)?(_0x8b5576=0x0,_0xc08e2f[_0x4947cb(0x242)](function(_0x84c65f){var _0x49de11=_0x4947cb;if(_0x5b596e++,_0xb47cc9[_0x49de11(0x1e9)]++,_0x5b596e>_0x32550c){_0x58a2d0=!0x0;return;}if(!_0xb47cc9[_0x49de11(0x211)]&&_0xb47cc9[_0x49de11(0x1c8)]&&_0xb47cc9[_0x49de11(0x1e9)]>_0xb47cc9[_0x49de11(0x1ac)]){_0x58a2d0=!0x0;return;}_0x1d7c47[_0x49de11(0x1f5)](_0x31a482[_0x49de11(0x1d1)](_0x26b35f,_0xc08e2f,'Set',_0x8b5576++,_0xb47cc9,function(_0x1b9622){return function(){return _0x1b9622;};}(_0x84c65f)));})):this['_isMap'](_0xc08e2f)&&_0xc08e2f[_0x4947cb(0x242)](function(_0x4da080,_0x3c5450){var _0x12d456=_0x4947cb;if(_0x5b596e++,_0xb47cc9[_0x12d456(0x1e9)]++,_0x5b596e>_0x32550c){_0x58a2d0=!0x0;return;}if(!_0xb47cc9['isExpressionToEvaluate']&&_0xb47cc9[_0x12d456(0x1c8)]&&_0xb47cc9[_0x12d456(0x1e9)]>_0xb47cc9[_0x12d456(0x1ac)]){_0x58a2d0=!0x0;return;}var _0x2e8dce=_0x3c5450[_0x12d456(0x1a9)]();_0x2e8dce[_0x12d456(0x1ee)]>0x64&&(_0x2e8dce=_0x2e8dce[_0x12d456(0x24e)](0x0,0x64)+_0x12d456(0x1f3)),_0x1d7c47[_0x12d456(0x1f5)](_0x31a482[_0x12d456(0x1d1)](_0x26b35f,_0xc08e2f,_0x12d456(0x1af),_0x2e8dce,_0xb47cc9,function(_0x18e45d){return function(){return _0x18e45d;};}(_0x4da080)));}),!_0x49295a){try{for(_0x25aa31 in _0xc08e2f)if(!(_0x5ac45a&&_0x56dab2['test'](_0x25aa31))&&!this[_0x4947cb(0x1e4)](_0xc08e2f,_0x25aa31,_0xb47cc9)){if(_0x5b596e++,_0xb47cc9[_0x4947cb(0x1e9)]++,_0x5b596e>_0x32550c){_0x58a2d0=!0x0;break;}if(!_0xb47cc9[_0x4947cb(0x211)]&&_0xb47cc9[_0x4947cb(0x1c8)]&&_0xb47cc9[_0x4947cb(0x1e9)]>_0xb47cc9['autoExpandLimit']){_0x58a2d0=!0x0;break;}_0x1d7c47['push'](_0x31a482[_0x4947cb(0x276)](_0x26b35f,_0x306c47,_0xc08e2f,_0x1967c8,_0x25aa31,_0xb47cc9));}}catch{}if(_0x306c47['_p_length']=!0x0,_0x112cdd&&(_0x306c47[_0x4947cb(0x24a)]=!0x0),!_0x58a2d0){var _0x3a464a=[][_0x4947cb(0x22e)](this[_0x4947cb(0x1ed)](_0xc08e2f))[_0x4947cb(0x22e)](this[_0x4947cb(0x1c6)](_0xc08e2f));for(_0x8b5576=0x0,_0x3f430f=_0x3a464a['length'];_0x8b5576<_0x3f430f;_0x8b5576++)if(_0x25aa31=_0x3a464a[_0x8b5576],!(_0x5ac45a&&_0x56dab2[_0x4947cb(0x1c3)](_0x25aa31[_0x4947cb(0x1a9)]()))&&!this[_0x4947cb(0x1e4)](_0xc08e2f,_0x25aa31,_0xb47cc9)&&!_0x306c47['_p_'+_0x25aa31['toString']()]){if(_0x5b596e++,_0xb47cc9[_0x4947cb(0x1e9)]++,_0x5b596e>_0x32550c){_0x58a2d0=!0x0;break;}if(!_0xb47cc9[_0x4947cb(0x211)]&&_0xb47cc9[_0x4947cb(0x1c8)]&&_0xb47cc9[_0x4947cb(0x1e9)]>_0xb47cc9[_0x4947cb(0x1ac)]){_0x58a2d0=!0x0;break;}_0x1d7c47[_0x4947cb(0x1f5)](_0x31a482['_addObjectProperty'](_0x26b35f,_0x306c47,_0xc08e2f,_0x1967c8,_0x25aa31,_0xb47cc9));}}}}}if(_0x22c73d[_0x4947cb(0x1c7)]=_0x1967c8,_0x603da9?(_0x22c73d['value']=_0xc08e2f['valueOf'](),this[_0x4947cb(0x215)](_0x1967c8,_0x22c73d,_0xb47cc9,_0x29722c)):_0x1967c8===_0x4947cb(0x246)?_0x22c73d['value']=this[_0x4947cb(0x1ae)]['call'](_0xc08e2f):_0x1967c8==='bigint'?_0x22c73d[_0x4947cb(0x27a)]=_0xc08e2f['toString']():_0x1967c8==='RegExp'?_0x22c73d['value']=this['_regExpToString']['call'](_0xc08e2f):_0x1967c8==='symbol'&&this[_0x4947cb(0x19b)]?_0x22c73d[_0x4947cb(0x27a)]=this[_0x4947cb(0x19b)][_0x4947cb(0x222)][_0x4947cb(0x1a9)][_0x4947cb(0x269)](_0xc08e2f):!_0xb47cc9[_0x4947cb(0x25c)]&&!(_0x1967c8===_0x4947cb(0x1a6)||_0x1967c8==='undefined')&&(delete _0x22c73d[_0x4947cb(0x27a)],_0x22c73d['capped']=!0x0),_0x58a2d0&&(_0x22c73d[_0x4947cb(0x1b9)]=!0x0),_0x1d6ac7=_0xb47cc9[_0x4947cb(0x281)][_0x4947cb(0x1bd)],_0xb47cc9[_0x4947cb(0x281)]['current']=_0x22c73d,this[_0x4947cb(0x1da)](_0x22c73d,_0xb47cc9),_0x1d7c47[_0x4947cb(0x1ee)]){for(_0x8b5576=0x0,_0x3f430f=_0x1d7c47[_0x4947cb(0x1ee)];_0x8b5576<_0x3f430f;_0x8b5576++)_0x1d7c47[_0x8b5576](_0x8b5576);}_0x26b35f[_0x4947cb(0x1ee)]&&(_0x22c73d[_0x4947cb(0x1fd)]=_0x26b35f);}catch(_0xf7dede){_0x356bcf(_0xf7dede,_0x22c73d,_0xb47cc9);}return this[_0x4947cb(0x22d)](_0xc08e2f,_0x22c73d),this[_0x4947cb(0x1e6)](_0x22c73d,_0xb47cc9),_0xb47cc9['node']['current']=_0x1d6ac7,_0xb47cc9['level']--,_0xb47cc9[_0x4947cb(0x1c8)]=_0x224ce6,_0xb47cc9[_0x4947cb(0x1c8)]&&_0xb47cc9[_0x4947cb(0x27f)][_0x4947cb(0x251)](),_0x22c73d;}[_0x518456(0x1c6)](_0x2ba372){return Object['getOwnPropertySymbols']?Object['getOwnPropertySymbols'](_0x2ba372):[];}[_0x518456(0x25a)](_0x2d91d1){var _0x27c09b=_0x518456;return!!(_0x2d91d1&&_0x16954a['Set']&&this[_0x27c09b(0x214)](_0x2d91d1)===_0x27c09b(0x226)&&_0x2d91d1[_0x27c09b(0x242)]);}[_0x518456(0x1e4)](_0x47f7dd,_0x3f8241,_0x5e9e62){var _0xcc31e4=_0x518456;return _0x5e9e62[_0xcc31e4(0x268)]?typeof _0x47f7dd[_0x3f8241]==_0xcc31e4(0x219):!0x1;}[_0x518456(0x19d)](_0x211efa){var _0xd03d9d=_0x518456,_0x25c71c='';return _0x25c71c=typeof _0x211efa,_0x25c71c===_0xd03d9d(0x277)?this[_0xd03d9d(0x214)](_0x211efa)==='[object\\x20Array]'?_0x25c71c=_0xd03d9d(0x1f7):this[_0xd03d9d(0x214)](_0x211efa)===_0xd03d9d(0x1a5)?_0x25c71c=_0xd03d9d(0x246):this[_0xd03d9d(0x214)](_0x211efa)===_0xd03d9d(0x1a7)?_0x25c71c='bigint':_0x211efa===null?_0x25c71c='null':_0x211efa[_0xd03d9d(0x282)]&&(_0x25c71c=_0x211efa['constructor']['name']||_0x25c71c):_0x25c71c===_0xd03d9d(0x237)&&this[_0xd03d9d(0x1d4)]&&_0x211efa instanceof this[_0xd03d9d(0x1d4)]&&(_0x25c71c=_0xd03d9d(0x1f4)),_0x25c71c;}[_0x518456(0x214)](_0x2e481d){var _0x762a04=_0x518456;return Object[_0x762a04(0x222)][_0x762a04(0x1a9)][_0x762a04(0x269)](_0x2e481d);}[_0x518456(0x275)](_0x49c85d){var _0x367423=_0x518456;return _0x49c85d==='boolean'||_0x49c85d===_0x367423(0x1d2)||_0x49c85d===_0x367423(0x21c);}[_0x518456(0x283)](_0x5a5e6b){var _0x4a59a4=_0x518456;return _0x5a5e6b==='Boolean'||_0x5a5e6b===_0x4a59a4(0x23a)||_0x5a5e6b===_0x4a59a4(0x201);}[_0x518456(0x1d1)](_0x4d6d49,_0x51262f,_0x581005,_0x156558,_0x4452a4,_0x29318c){var _0x2f23aa=this;return function(_0x5ddd36){var _0x42578b=_0x28e3,_0x5e74b1=_0x4452a4[_0x42578b(0x281)][_0x42578b(0x1bd)],_0x4bcbdb=_0x4452a4[_0x42578b(0x281)][_0x42578b(0x266)],_0x2031e6=_0x4452a4[_0x42578b(0x281)][_0x42578b(0x259)];_0x4452a4[_0x42578b(0x281)][_0x42578b(0x259)]=_0x5e74b1,_0x4452a4[_0x42578b(0x281)]['index']=typeof _0x156558==_0x42578b(0x21c)?_0x156558:_0x5ddd36,_0x4d6d49['push'](_0x2f23aa[_0x42578b(0x247)](_0x51262f,_0x581005,_0x156558,_0x4452a4,_0x29318c)),_0x4452a4['node'][_0x42578b(0x259)]=_0x2031e6,_0x4452a4[_0x42578b(0x281)][_0x42578b(0x266)]=_0x4bcbdb;};}[_0x518456(0x276)](_0x225584,_0x403846,_0x24ac31,_0x2f48ba,_0x31bea6,_0x13a248,_0x39beeb){var _0x5498bf=_0x518456,_0x22d458=this;return _0x403846[_0x5498bf(0x1fb)+_0x31bea6[_0x5498bf(0x1a9)]()]=!0x0,function(_0x2a083a){var _0x15009c=_0x5498bf,_0x47539a=_0x13a248[_0x15009c(0x281)][_0x15009c(0x1bd)],_0x524d17=_0x13a248[_0x15009c(0x281)][_0x15009c(0x266)],_0x37a30a=_0x13a248[_0x15009c(0x281)][_0x15009c(0x259)];_0x13a248[_0x15009c(0x281)]['parent']=_0x47539a,_0x13a248[_0x15009c(0x281)][_0x15009c(0x266)]=_0x2a083a,_0x225584[_0x15009c(0x1f5)](_0x22d458[_0x15009c(0x247)](_0x24ac31,_0x2f48ba,_0x31bea6,_0x13a248,_0x39beeb)),_0x13a248['node'][_0x15009c(0x259)]=_0x37a30a,_0x13a248[_0x15009c(0x281)][_0x15009c(0x266)]=_0x524d17;};}[_0x518456(0x247)](_0x59a51f,_0x2139eb,_0x30b503,_0x21abe9,_0x21869f){var _0x376cdb=_0x518456,_0x34e7fb=this;_0x21869f||(_0x21869f=function(_0x5d01ec,_0x55b49d){return _0x5d01ec[_0x55b49d];});var _0xf0ccad=_0x30b503[_0x376cdb(0x1a9)](),_0x131c42=_0x21abe9[_0x376cdb(0x249)]||{},_0x5423a6=_0x21abe9['depth'],_0x500b30=_0x21abe9['isExpressionToEvaluate'];try{var _0x56dc70=this[_0x376cdb(0x238)](_0x59a51f),_0x4981bf=_0xf0ccad;_0x56dc70&&_0x4981bf[0x0]==='\\x27'&&(_0x4981bf=_0x4981bf[_0x376cdb(0x252)](0x1,_0x4981bf[_0x376cdb(0x1ee)]-0x2));var _0x3480b6=_0x21abe9[_0x376cdb(0x249)]=_0x131c42[_0x376cdb(0x1fb)+_0x4981bf];_0x3480b6&&(_0x21abe9[_0x376cdb(0x25c)]=_0x21abe9[_0x376cdb(0x25c)]+0x1),_0x21abe9[_0x376cdb(0x211)]=!!_0x3480b6;var _0x20abbe=typeof _0x30b503==_0x376cdb(0x23c),_0xfeb9ef={'name':_0x20abbe||_0x56dc70?_0xf0ccad:this[_0x376cdb(0x20a)](_0xf0ccad)};if(_0x20abbe&&(_0xfeb9ef[_0x376cdb(0x23c)]=!0x0),!(_0x2139eb==='array'||_0x2139eb===_0x376cdb(0x20f))){var _0x7d5f77=this[_0x376cdb(0x199)](_0x59a51f,_0x30b503);if(_0x7d5f77&&(_0x7d5f77[_0x376cdb(0x1d3)]&&(_0xfeb9ef[_0x376cdb(0x1b0)]=!0x0),_0x7d5f77[_0x376cdb(0x26f)]&&!_0x3480b6&&!_0x21abe9[_0x376cdb(0x213)]))return _0xfeb9ef[_0x376cdb(0x220)]=!0x0,this[_0x376cdb(0x23e)](_0xfeb9ef,_0x21abe9),_0xfeb9ef;}var _0x1fd6a2;try{_0x1fd6a2=_0x21869f(_0x59a51f,_0x30b503);}catch(_0x1db60c){return _0xfeb9ef={'name':_0xf0ccad,'type':'unknown','error':_0x1db60c[_0x376cdb(0x1b3)]},this['_processTreeNodeResult'](_0xfeb9ef,_0x21abe9),_0xfeb9ef;}var _0x1e3386=this[_0x376cdb(0x19d)](_0x1fd6a2),_0x2ecb32=this[_0x376cdb(0x275)](_0x1e3386);if(_0xfeb9ef[_0x376cdb(0x1c7)]=_0x1e3386,_0x2ecb32)this[_0x376cdb(0x23e)](_0xfeb9ef,_0x21abe9,_0x1fd6a2,function(){var _0x1c3507=_0x376cdb;_0xfeb9ef[_0x1c3507(0x27a)]=_0x1fd6a2['valueOf'](),!_0x3480b6&&_0x34e7fb['_capIfString'](_0x1e3386,_0xfeb9ef,_0x21abe9,{});});else{var _0x286c8a=_0x21abe9[_0x376cdb(0x1c8)]&&_0x21abe9[_0x376cdb(0x1fc)]<_0x21abe9[_0x376cdb(0x1e1)]&&_0x21abe9[_0x376cdb(0x27f)][_0x376cdb(0x218)](_0x1fd6a2)<0x0&&_0x1e3386!=='function'&&_0x21abe9['autoExpandPropertyCount']<_0x21abe9[_0x376cdb(0x1ac)];_0x286c8a||_0x21abe9[_0x376cdb(0x1fc)]<_0x5423a6||_0x3480b6?(this[_0x376cdb(0x1f9)](_0xfeb9ef,_0x1fd6a2,_0x21abe9,_0x3480b6||{}),this[_0x376cdb(0x22d)](_0x1fd6a2,_0xfeb9ef)):this[_0x376cdb(0x23e)](_0xfeb9ef,_0x21abe9,_0x1fd6a2,function(){var _0x432b9d=_0x376cdb;_0x1e3386==='null'||_0x1e3386===_0x432b9d(0x237)||(delete _0xfeb9ef[_0x432b9d(0x27a)],_0xfeb9ef[_0x432b9d(0x1eb)]=!0x0);});}return _0xfeb9ef;}finally{_0x21abe9[_0x376cdb(0x249)]=_0x131c42,_0x21abe9[_0x376cdb(0x25c)]=_0x5423a6,_0x21abe9[_0x376cdb(0x211)]=_0x500b30;}}['_capIfString'](_0x59a33b,_0x10c7cf,_0xdb369d,_0x2bd4e6){var _0xb7aa63=_0x518456,_0x4dabe5=_0x2bd4e6[_0xb7aa63(0x1b8)]||_0xdb369d[_0xb7aa63(0x1b8)];if((_0x59a33b===_0xb7aa63(0x1d2)||_0x59a33b===_0xb7aa63(0x23a))&&_0x10c7cf[_0xb7aa63(0x27a)]){let _0x4f3a86=_0x10c7cf[_0xb7aa63(0x27a)][_0xb7aa63(0x1ee)];_0xdb369d[_0xb7aa63(0x1f8)]+=_0x4f3a86,_0xdb369d[_0xb7aa63(0x1f8)]>_0xdb369d[_0xb7aa63(0x244)]?(_0x10c7cf[_0xb7aa63(0x1eb)]='',delete _0x10c7cf[_0xb7aa63(0x27a)]):_0x4f3a86>_0x4dabe5&&(_0x10c7cf[_0xb7aa63(0x1eb)]=_0x10c7cf[_0xb7aa63(0x27a)][_0xb7aa63(0x252)](0x0,_0x4dabe5),delete _0x10c7cf[_0xb7aa63(0x27a)]);}}[_0x518456(0x238)](_0x1dbea6){var _0x1affba=_0x518456;return!!(_0x1dbea6&&_0x16954a[_0x1affba(0x1af)]&&this[_0x1affba(0x214)](_0x1dbea6)===_0x1affba(0x1f0)&&_0x1dbea6['forEach']);}[_0x518456(0x20a)](_0x4004f4){var _0xd85a2=_0x518456;if(_0x4004f4[_0xd85a2(0x19e)](/^\\d+$/))return _0x4004f4;var _0x1ad931;try{_0x1ad931=JSON[_0xd85a2(0x27d)](''+_0x4004f4);}catch{_0x1ad931='\\x22'+this['_objectToString'](_0x4004f4)+'\\x22';}return _0x1ad931[_0xd85a2(0x19e)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x1ad931=_0x1ad931[_0xd85a2(0x252)](0x1,_0x1ad931[_0xd85a2(0x1ee)]-0x2):_0x1ad931=_0x1ad931[_0xd85a2(0x1b2)](/'/g,'\\x5c\\x27')[_0xd85a2(0x1b2)](/\\\\\"/g,'\\x22')[_0xd85a2(0x1b2)](/(^\"|\"$)/g,'\\x27'),_0x1ad931;}[_0x518456(0x23e)](_0x179678,_0x480571,_0x3c2dd0,_0x39d5c6){var _0x4489e4=_0x518456;this[_0x4489e4(0x1da)](_0x179678,_0x480571),_0x39d5c6&&_0x39d5c6(),this[_0x4489e4(0x22d)](_0x3c2dd0,_0x179678),this[_0x4489e4(0x1e6)](_0x179678,_0x480571);}['_treeNodePropertiesBeforeFullValue'](_0x10502e,_0x4df1f5){var _0x1ac46d=_0x518456;this['_setNodeId'](_0x10502e,_0x4df1f5),this['_setNodeQueryPath'](_0x10502e,_0x4df1f5),this[_0x1ac46d(0x216)](_0x10502e,_0x4df1f5),this[_0x1ac46d(0x1ce)](_0x10502e,_0x4df1f5);}[_0x518456(0x258)](_0x42bafc,_0x1570d9){}[_0x518456(0x1a0)](_0x166187,_0x3a517d){}[_0x518456(0x1ba)](_0x34ae97,_0xaf7ef7){}[_0x518456(0x1b4)](_0x3e5160){var _0x4e745a=_0x518456;return _0x3e5160===this[_0x4e745a(0x1de)];}[_0x518456(0x1e6)](_0x3c4157,_0x14edec){var _0x55c8fb=_0x518456;this['_setNodeLabel'](_0x3c4157,_0x14edec),this[_0x55c8fb(0x1dc)](_0x3c4157),_0x14edec[_0x55c8fb(0x245)]&&this[_0x55c8fb(0x19c)](_0x3c4157),this[_0x55c8fb(0x1bc)](_0x3c4157,_0x14edec),this['_addLoadNode'](_0x3c4157,_0x14edec),this[_0x55c8fb(0x1ec)](_0x3c4157);}[_0x518456(0x22d)](_0x3afce5,_0x2581c3){var _0x268d15=_0x518456;let _0x5a62a6;try{_0x16954a[_0x268d15(0x200)]&&(_0x5a62a6=_0x16954a[_0x268d15(0x200)]['error'],_0x16954a[_0x268d15(0x200)][_0x268d15(0x19a)]=function(){}),_0x3afce5&&typeof _0x3afce5['length']==_0x268d15(0x21c)&&(_0x2581c3[_0x268d15(0x1ee)]=_0x3afce5[_0x268d15(0x1ee)]);}catch{}finally{_0x5a62a6&&(_0x16954a['console'][_0x268d15(0x19a)]=_0x5a62a6);}if(_0x2581c3[_0x268d15(0x1c7)]===_0x268d15(0x21c)||_0x2581c3[_0x268d15(0x1c7)]===_0x268d15(0x201)){if(isNaN(_0x2581c3[_0x268d15(0x27a)]))_0x2581c3[_0x268d15(0x263)]=!0x0,delete _0x2581c3[_0x268d15(0x27a)];else switch(_0x2581c3[_0x268d15(0x27a)]){case Number[_0x268d15(0x234)]:_0x2581c3[_0x268d15(0x235)]=!0x0,delete _0x2581c3['value'];break;case Number[_0x268d15(0x1aa)]:_0x2581c3[_0x268d15(0x255)]=!0x0,delete _0x2581c3[_0x268d15(0x27a)];break;case 0x0:this[_0x268d15(0x1e5)](_0x2581c3['value'])&&(_0x2581c3[_0x268d15(0x288)]=!0x0);break;}}else _0x2581c3['type']==='function'&&typeof _0x3afce5['name']==_0x268d15(0x1d2)&&_0x3afce5[_0x268d15(0x1f6)]&&_0x2581c3[_0x268d15(0x1f6)]&&_0x3afce5[_0x268d15(0x1f6)]!==_0x2581c3[_0x268d15(0x1f6)]&&(_0x2581c3['funcName']=_0x3afce5[_0x268d15(0x1f6)]);}['_isNegativeZero'](_0x2b5c48){var _0x410438=_0x518456;return 0x1/_0x2b5c48===Number[_0x410438(0x1aa)];}['_sortProps'](_0x55487c){var _0x42fa9c=_0x518456;!_0x55487c[_0x42fa9c(0x1fd)]||!_0x55487c[_0x42fa9c(0x1fd)][_0x42fa9c(0x1ee)]||_0x55487c['type']===_0x42fa9c(0x1f7)||_0x55487c[_0x42fa9c(0x1c7)]===_0x42fa9c(0x1af)||_0x55487c[_0x42fa9c(0x1c7)]===_0x42fa9c(0x1cc)||_0x55487c['props']['sort'](function(_0x4764cb,_0x2199c1){var _0x9e742e=_0x42fa9c,_0xf0d320=_0x4764cb['name'][_0x9e742e(0x250)](),_0x9f7bb=_0x2199c1[_0x9e742e(0x1f6)][_0x9e742e(0x250)]();return _0xf0d320<_0x9f7bb?-0x1:_0xf0d320>_0x9f7bb?0x1:0x0;});}[_0x518456(0x1bc)](_0xb80aae,_0x46f425){var _0x2ccb4b=_0x518456;if(!(_0x46f425[_0x2ccb4b(0x268)]||!_0xb80aae[_0x2ccb4b(0x1fd)]||!_0xb80aae[_0x2ccb4b(0x1fd)][_0x2ccb4b(0x1ee)])){for(var _0x26441a=[],_0x1f9eed=[],_0x54e320=0x0,_0x3f58d8=_0xb80aae['props'][_0x2ccb4b(0x1ee)];_0x54e320<_0x3f58d8;_0x54e320++){var _0x425ae1=_0xb80aae[_0x2ccb4b(0x1fd)][_0x54e320];_0x425ae1[_0x2ccb4b(0x1c7)]===_0x2ccb4b(0x219)?_0x26441a[_0x2ccb4b(0x1f5)](_0x425ae1):_0x1f9eed[_0x2ccb4b(0x1f5)](_0x425ae1);}if(!(!_0x1f9eed[_0x2ccb4b(0x1ee)]||_0x26441a[_0x2ccb4b(0x1ee)]<=0x1)){_0xb80aae[_0x2ccb4b(0x1fd)]=_0x1f9eed;var _0x5e7f51={'functionsNode':!0x0,'props':_0x26441a};this[_0x2ccb4b(0x258)](_0x5e7f51,_0x46f425),this[_0x2ccb4b(0x1ba)](_0x5e7f51,_0x46f425),this[_0x2ccb4b(0x1dc)](_0x5e7f51),this[_0x2ccb4b(0x1ce)](_0x5e7f51,_0x46f425),_0x5e7f51['id']+='\\x20f',_0xb80aae[_0x2ccb4b(0x1fd)][_0x2ccb4b(0x1bb)](_0x5e7f51);}}}[_0x518456(0x243)](_0x45fd4b,_0x20e4c3){}[_0x518456(0x1dc)](_0x32c12a){}[_0x518456(0x21a)](_0x42dac3){var _0x3b9d67=_0x518456;return Array[_0x3b9d67(0x23d)](_0x42dac3)||typeof _0x42dac3==_0x3b9d67(0x277)&&this[_0x3b9d67(0x214)](_0x42dac3)===_0x3b9d67(0x270);}[_0x518456(0x1ce)](_0x20d6ff,_0x23dfeb){}[_0x518456(0x1ec)](_0x463e0f){var _0x4fefff=_0x518456;delete _0x463e0f[_0x4fefff(0x1e7)],delete _0x463e0f[_0x4fefff(0x25d)],delete _0x463e0f[_0x4fefff(0x1cd)];}['_setNodeExpressionPath'](_0x39ee6a,_0x410b06){}}let _0x321960=new _0xea4f1b(),_0x2856db={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x449fff={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x4ceff0(_0x2c3a5d,_0x405569,_0x42c915,_0xe9df2,_0x3efdd9,_0x37259f){var _0x171030=_0x518456;let _0x3b3146,_0x1a1c87;try{_0x1a1c87=_0x300291(),_0x3b3146=_0x3266df[_0x405569],!_0x3b3146||_0x1a1c87-_0x3b3146['ts']>0x1f4&&_0x3b3146[_0x171030(0x1ca)]&&_0x3b3146['time']/_0x3b3146[_0x171030(0x1ca)]<0x64?(_0x3266df[_0x405569]=_0x3b3146={'count':0x0,'time':0x0,'ts':_0x1a1c87},_0x3266df['hits']={}):_0x1a1c87-_0x3266df['hits']['ts']>0x32&&_0x3266df[_0x171030(0x1d6)][_0x171030(0x1ca)]&&_0x3266df['hits'][_0x171030(0x239)]/_0x3266df[_0x171030(0x1d6)][_0x171030(0x1ca)]<0x64&&(_0x3266df[_0x171030(0x1d6)]={});let _0x988b15=[],_0x326fd1=_0x3b3146['reduceLimits']||_0x3266df['hits'][_0x171030(0x26e)]?_0x449fff:_0x2856db,_0x2d50a7=_0x26a5dc=>{var _0xe4e38c=_0x171030;let _0xbf8637={};return _0xbf8637[_0xe4e38c(0x1fd)]=_0x26a5dc[_0xe4e38c(0x1fd)],_0xbf8637[_0xe4e38c(0x225)]=_0x26a5dc[_0xe4e38c(0x225)],_0xbf8637[_0xe4e38c(0x1b8)]=_0x26a5dc[_0xe4e38c(0x1b8)],_0xbf8637[_0xe4e38c(0x244)]=_0x26a5dc[_0xe4e38c(0x244)],_0xbf8637[_0xe4e38c(0x1ac)]=_0x26a5dc[_0xe4e38c(0x1ac)],_0xbf8637[_0xe4e38c(0x1e1)]=_0x26a5dc[_0xe4e38c(0x1e1)],_0xbf8637[_0xe4e38c(0x245)]=!0x1,_0xbf8637[_0xe4e38c(0x268)]=!_0x1f5612,_0xbf8637[_0xe4e38c(0x25c)]=0x1,_0xbf8637['level']=0x0,_0xbf8637['expId']='root_exp_id',_0xbf8637[_0xe4e38c(0x254)]=_0xe4e38c(0x228),_0xbf8637[_0xe4e38c(0x1c8)]=!0x0,_0xbf8637[_0xe4e38c(0x27f)]=[],_0xbf8637['autoExpandPropertyCount']=0x0,_0xbf8637[_0xe4e38c(0x213)]=!0x0,_0xbf8637['allStrLength']=0x0,_0xbf8637[_0xe4e38c(0x281)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0xbf8637;};for(var _0x4d76ac=0x0;_0x4d76ac<_0x3efdd9[_0x171030(0x1ee)];_0x4d76ac++)_0x988b15[_0x171030(0x1f5)](_0x321960[_0x171030(0x1f9)]({'timeNode':_0x2c3a5d==='time'||void 0x0},_0x3efdd9[_0x4d76ac],_0x2d50a7(_0x326fd1),{}));if(_0x2c3a5d===_0x171030(0x1d5)){let _0x5aee45=Error[_0x171030(0x230)];try{Error[_0x171030(0x230)]=0x1/0x0,_0x988b15[_0x171030(0x1f5)](_0x321960[_0x171030(0x1f9)]({'stackNode':!0x0},new Error()[_0x171030(0x257)],_0x2d50a7(_0x326fd1),{'strLength':0x1/0x0}));}finally{Error[_0x171030(0x230)]=_0x5aee45;}}return{'method':'log','version':_0x533af2,'args':[{'ts':_0x42c915,'session':_0xe9df2,'args':_0x988b15,'id':_0x405569,'context':_0x37259f}]};}catch(_0x1adcd8){return{'method':'log','version':_0x533af2,'args':[{'ts':_0x42c915,'session':_0xe9df2,'args':[{'type':'unknown','error':_0x1adcd8&&_0x1adcd8[_0x171030(0x1b3)]}],'id':_0x405569,'context':_0x37259f}]};}finally{try{if(_0x3b3146&&_0x1a1c87){let _0x24f12b=_0x300291();_0x3b3146['count']++,_0x3b3146['time']+=_0x832442(_0x1a1c87,_0x24f12b),_0x3b3146['ts']=_0x24f12b,_0x3266df[_0x171030(0x1d6)][_0x171030(0x1ca)]++,_0x3266df[_0x171030(0x1d6)]['time']+=_0x832442(_0x1a1c87,_0x24f12b),_0x3266df[_0x171030(0x1d6)]['ts']=_0x24f12b,(_0x3b3146[_0x171030(0x1ca)]>0x32||_0x3b3146[_0x171030(0x239)]>0x64)&&(_0x3b3146[_0x171030(0x26e)]=!0x0),(_0x3266df[_0x171030(0x1d6)]['count']>0x3e8||_0x3266df[_0x171030(0x1d6)]['time']>0x12c)&&(_0x3266df[_0x171030(0x1d6)][_0x171030(0x26e)]=!0x0);}}catch{}}}return _0x4ceff0;}((_0x44e88c,_0x5a2423,_0x2c9905,_0x23aac5,_0x2dfd84,_0x1edac5,_0x5f3284,_0xef61e6,_0x4801c1,_0x4a1d8b)=>{var _0x5959b2=_0x31a8a8;if(_0x44e88c['_console_ninja'])return _0x44e88c['_console_ninja'];if(!X(_0x44e88c,_0xef61e6,_0x2dfd84))return _0x44e88c[_0x5959b2(0x27e)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x44e88c[_0x5959b2(0x27e)];let _0x22ba47=W(_0x44e88c),_0x4624c5=_0x22ba47['elapsed'],_0x51454c=_0x22ba47[_0x5959b2(0x229)],_0x3d1f9d=_0x22ba47[_0x5959b2(0x23b)],_0x43f4d0={'hits':{},'ts':{}},_0x5dcf32=J(_0x44e88c,_0x4801c1,_0x43f4d0,_0x1edac5),_0x2da564=_0x758e1d=>{_0x43f4d0['ts'][_0x758e1d]=_0x51454c();},_0x4e3ac2=(_0x33f4ff,_0x40dda2)=>{var _0x2358f9=_0x5959b2;let _0x521992=_0x43f4d0['ts'][_0x40dda2];if(delete _0x43f4d0['ts'][_0x40dda2],_0x521992){let _0x45835d=_0x4624c5(_0x521992,_0x51454c());_0x506c1c(_0x5dcf32(_0x2358f9(0x239),_0x33f4ff,_0x3d1f9d(),_0x342c50,[_0x45835d],_0x40dda2));}},_0x4a949f=_0x1c8e59=>(_0x2dfd84===_0x5959b2(0x26a)&&_0x44e88c[_0x5959b2(0x25f)]&&_0x1c8e59?.[_0x5959b2(0x25b)]?.[_0x5959b2(0x1ee)]&&(_0x1c8e59[_0x5959b2(0x25b)][0x0][_0x5959b2(0x25f)]=_0x44e88c[_0x5959b2(0x25f)]),_0x1c8e59);_0x44e88c[_0x5959b2(0x27e)]={'consoleLog':(_0x31d8d4,_0x5b20f5)=>{var _0x11722a=_0x5959b2;_0x44e88c['console'][_0x11722a(0x223)][_0x11722a(0x1f6)]!=='disabledLog'&&_0x506c1c(_0x5dcf32('log',_0x31d8d4,_0x3d1f9d(),_0x342c50,_0x5b20f5));},'consoleTrace':(_0x118b4d,_0x4b12e1)=>{var _0x54656c=_0x5959b2;_0x44e88c['console']['log']['name']!=='disabledTrace'&&_0x506c1c(_0x4a949f(_0x5dcf32(_0x54656c(0x1d5),_0x118b4d,_0x3d1f9d(),_0x342c50,_0x4b12e1)));},'consoleTime':_0x3fbe54=>{_0x2da564(_0x3fbe54);},'consoleTimeEnd':(_0xf52498,_0x69d004)=>{_0x4e3ac2(_0x69d004,_0xf52498);},'autoLog':(_0x139d6a,_0x9d5993)=>{var _0x2853da=_0x5959b2;_0x506c1c(_0x5dcf32(_0x2853da(0x223),_0x9d5993,_0x3d1f9d(),_0x342c50,[_0x139d6a]));},'autoLogMany':(_0x1581aa,_0x4abf30)=>{var _0x1113bd=_0x5959b2;_0x506c1c(_0x5dcf32(_0x1113bd(0x223),_0x1581aa,_0x3d1f9d(),_0x342c50,_0x4abf30));},'autoTrace':(_0x27c5bc,_0x4f712a)=>{var _0x55ed5b=_0x5959b2;_0x506c1c(_0x4a949f(_0x5dcf32(_0x55ed5b(0x1d5),_0x4f712a,_0x3d1f9d(),_0x342c50,[_0x27c5bc])));},'autoTraceMany':(_0x6254bf,_0x3aeeec)=>{var _0x3e6028=_0x5959b2;_0x506c1c(_0x4a949f(_0x5dcf32(_0x3e6028(0x1d5),_0x6254bf,_0x3d1f9d(),_0x342c50,_0x3aeeec)));},'autoTime':(_0x50d777,_0x45de2d,_0x130595)=>{_0x2da564(_0x130595);},'autoTimeEnd':(_0x48da2c,_0x3deda8,_0xa37cba)=>{_0x4e3ac2(_0x3deda8,_0xa37cba);},'coverage':_0x350d7d=>{var _0x3e9570=_0x5959b2;_0x506c1c({'method':_0x3e9570(0x204),'version':_0x1edac5,'args':[{'id':_0x350d7d}]});}};let _0x506c1c=x(_0x44e88c,_0x5a2423,_0x2c9905,_0x23aac5,_0x2dfd84,_0x4a1d8b),_0x342c50=_0x44e88c['_console_ninja_session'];return _0x44e88c[_0x5959b2(0x27e)];})(globalThis,'127.0.0.1','49387',_0x31a8a8(0x27c),'webpack',_0x31a8a8(0x1df),_0x31a8a8(0x24b),_0x31a8a8(0x20b),_0x31a8a8(0x22a),_0x31a8a8(0x20e));"
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
