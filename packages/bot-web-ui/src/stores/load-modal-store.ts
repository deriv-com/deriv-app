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
            block_string: this.selected_strategy.xml,
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
        this.is_open_button_loading = false;
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
            clearInjectionDiv('store', ref);
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
        });
        reader.readAsText(file);
    };
}
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */ function oo_cm() {
    try {
        return (
            (0, eval)('globalThis._console_ninja') ||
            (0, eval)(
                "/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x24ae32=_0xe1a3;function _0x47ba(){var _0x4d9a5e=['bind','_isSet','autoExpandMaxDepth','_type','ws/index.js','data','_inNextEdge','null','location','Set','_processTreeNodeResult','autoExpandPropertyCount','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','method','test','symbol','elapsed','unknown','next.js','_objectToString','_Symbol','getOwnPropertyDescriptor','onclose','global','setter','totalStrLength','send','prototype','edge','_getOwnPropertyNames','hasOwnProperty','includes','readyState','NEXT_RUNTIME','disabledTrace','_quotedRegExp','get','timeStamp','_webSocketErrorDocsLink','_disposeWebsocket','_addProperty','_setNodeId','_addObjectProperty','_console_ninja','_connectAttemptCount','webpack','_setNodePermissions','_isNegativeZero','gateway.docker.internal','203717gUxSbO','_setNodeLabel','onopen','_WebSocketClass','disabledLog','_connectToHostNow','join','_HTMLAllCollection','_allowedToConnectOnSend','hrtime','negativeZero',\"/Users/newhire/.vscode/extensions/wallabyjs.console-ninja-1.0.297/node_modules\",'','negativeInfinity','unshift','count','_treeNodePropertiesBeforeFullValue','[object\\x20Map]','port','_sendErrorMessage','type','4682442WbbGyT','current','_reconnectTimeout','287NLwPsb','parent','120968WxcRNU','hostname','_isMap','capped','valueOf','log','function','_addFunctionsNode','dockerizedApp','array','_getOwnPropertySymbols','funcName','process','name','stack','reload','angular','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','defineProperty','_sortProps','astro','getter','trace','bigint','pathToFileURL','_inBrowser','_connected','stringify','_propertyName','resolveGetters','replace','serialize','NEGATIVE_INFINITY','\\x20server','value','_isPrimitiveType','_dateToString','path','message','_ws','_setNodeExpandableState','_p_length','POSITIVE_INFINITY','allStrLength','_hasMapOnItsPath','error','call','env','toString','Map','_attemptToReconnectShortly','coverage','hits','14326697OpwenA','_isPrimitiveWrapperType','autoExpandLimit','nuxt','ws://','autoExpand','sortProps','now','node','_cleanNode','set','_socket','_blacklistedProperty','perf_hooks','6290InhSfe','autoExpandPreviousObjects','sort','time','substr','Number','timeEnd','WebSocket','strLength','length','props','1.0.0','cappedElements','_console_ninja_session','getOwnPropertyNames','forEach','getWebSocketClass','_treeNodePropertiesAfterFullValue','_isUndefined','1046TxPxjD','toLowerCase','then','_p_name','date','undefined','_addLoadNode','string','push','6404eXURFg','split','1395iTYYhf','HTMLAllCollection','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_allowedToSend','performance','_undefined','_additionalMetadata','object','RegExp','versions','_maxConnectAttemptCount','nan','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','warn','Error','getPrototypeOf','match','5109sYAtuQ','expressionsToEvaluate','_capIfString','_connecting','console','catch','number','_consoleNinjaAllowedToStart','slice','indexOf','constructor','noFunctions','level','unref','_property','','_setNodeExpressionPath','15048JnNmqV','127.0.0.1','concat','elements','_hasSymbolPropertyOnItsPath','__es'+'Module','depth','host','nodeModules','create','getOwnPropertySymbols','_numberRegExp','stackTraceLimit','boolean','_regExpToString','onerror','49387','_setNodeQueryPath','expId','logger\\x20websocket\\x20error','[object\\x20Array]','default','reduceLimits','index','String','isExpressionToEvaluate','_p_'];_0x47ba=function(){return _0x4d9a5e;};return _0x47ba();}(function(_0x13cea9,_0x4bbe7e){var _0x52657b=_0xe1a3,_0x4ab941=_0x13cea9();while(!![]){try{var _0x565148=parseInt(_0x52657b(0x112))/0x1+parseInt(_0x52657b(0x182))/0x2*(parseInt(_0x52657b(0x19e))/0x3)+parseInt(_0x52657b(0x18b))/0x4*(-parseInt(_0x52657b(0x18d))/0x5)+parseInt(_0x52657b(0x127))/0x6+-parseInt(_0x52657b(0x12a))/0x7*(parseInt(_0x52657b(0x12c))/0x8)+parseInt(_0x52657b(0x1af))/0x9*(parseInt(_0x52657b(0x16f))/0xa)+-parseInt(_0x52657b(0x161))/0xb;if(_0x565148===_0x4bbe7e)break;else _0x4ab941['push'](_0x4ab941['shift']());}catch(_0x421755){_0x4ab941['push'](_0x4ab941['shift']());}}}(_0x47ba,0x88166));var j=Object[_0x24ae32(0xcf)],H=Object[_0x24ae32(0x13e)],G=Object[_0x24ae32(0xf6)],ee=Object['getOwnPropertyNames'],te=Object[_0x24ae32(0x19c)],ne=Object[_0x24ae32(0xfc)][_0x24ae32(0xff)],re=(_0x4d3738,_0x236e14,_0x3098ae,_0x375e86)=>{var _0x2e9e42=_0x24ae32;if(_0x236e14&&typeof _0x236e14=='object'||typeof _0x236e14==_0x2e9e42(0x132)){for(let _0x20a893 of ee(_0x236e14))!ne['call'](_0x4d3738,_0x20a893)&&_0x20a893!==_0x3098ae&&H(_0x4d3738,_0x20a893,{'get':()=>_0x236e14[_0x20a893],'enumerable':!(_0x375e86=G(_0x236e14,_0x20a893))||_0x375e86['enumerable']});}return _0x4d3738;},x=(_0x4ceb6e,_0x1d4c6c,_0x157aca)=>(_0x157aca=_0x4ceb6e!=null?j(te(_0x4ceb6e)):{},re(_0x1d4c6c||!_0x4ceb6e||!_0x4ceb6e[_0x24ae32(0xcb)]?H(_0x157aca,_0x24ae32(0xdb),{'value':_0x4ceb6e,'enumerable':!0x0}):_0x157aca,_0x4ceb6e)),X=class{constructor(_0x259cec,_0x17e41c,_0x5f15f2,_0x5d1b89,_0x319187){var _0x2640a4=_0x24ae32;this[_0x2640a4(0xf8)]=_0x259cec,this[_0x2640a4(0xcd)]=_0x17e41c,this[_0x2640a4(0x124)]=_0x5f15f2,this[_0x2640a4(0xce)]=_0x5d1b89,this['dockerizedApp']=_0x319187,this[_0x2640a4(0x190)]=!0x0,this[_0x2640a4(0x11a)]=!0x0,this[_0x2640a4(0x146)]=!0x1,this[_0x2640a4(0x1a1)]=!0x1,this[_0x2640a4(0xe7)]=_0x259cec[_0x2640a4(0x138)]?.[_0x2640a4(0x15b)]?.[_0x2640a4(0x102)]==='edge',this['_inBrowser']=!this[_0x2640a4(0xf8)]['process']?.['versions']?.['node']&&!this['_inNextEdge'],this[_0x2640a4(0x115)]=null,this[_0x2640a4(0x10d)]=0x0,this[_0x2640a4(0x197)]=0x14,this[_0x2640a4(0x107)]='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this[_0x2640a4(0x145)]?_0x2640a4(0xed):_0x2640a4(0x18f))+this[_0x2640a4(0x107)];}async[_0x24ae32(0x17f)](){var _0x513466=_0x24ae32;if(this['_WebSocketClass'])return this[_0x513466(0x115)];let _0x547a9b;if(this['_inBrowser']||this[_0x513466(0xe7)])_0x547a9b=this[_0x513466(0xf8)][_0x513466(0x176)];else{if(this[_0x513466(0xf8)][_0x513466(0x138)]?.['_WebSocket'])_0x547a9b=this['global'][_0x513466(0x138)]?.['_WebSocket'];else try{let _0x133a32=await import(_0x513466(0x151));_0x547a9b=(await import((await import('url'))[_0x513466(0x144)](_0x133a32[_0x513466(0x118)](this['nodeModules'],_0x513466(0xe5)))['toString']()))[_0x513466(0xdb)];}catch{try{_0x547a9b=require(require(_0x513466(0x151))['join'](this['nodeModules'],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this[_0x513466(0x115)]=_0x547a9b,_0x547a9b;}[_0x24ae32(0x117)](){var _0x2c0ef5=_0x24ae32;this[_0x2c0ef5(0x1a1)]||this[_0x2c0ef5(0x146)]||this[_0x2c0ef5(0x10d)]>=this[_0x2c0ef5(0x197)]||(this[_0x2c0ef5(0x11a)]=!0x1,this[_0x2c0ef5(0x1a1)]=!0x0,this[_0x2c0ef5(0x10d)]++,this[_0x2c0ef5(0x153)]=new Promise((_0x44c1c5,_0x4c50ec)=>{var _0x4e7a9e=_0x2c0ef5;this['getWebSocketClass']()[_0x4e7a9e(0x184)](_0x1c0d89=>{var _0x18e890=_0x4e7a9e;let _0x534f30=new _0x1c0d89(_0x18e890(0x165)+(!this[_0x18e890(0x145)]&&this[_0x18e890(0x134)]?_0x18e890(0x111):this[_0x18e890(0xcd)])+':'+this['port']);_0x534f30['onerror']=()=>{var _0x29bc9f=_0x18e890;this['_allowedToSend']=!0x1,this[_0x29bc9f(0x108)](_0x534f30),this[_0x29bc9f(0x15e)](),_0x4c50ec(new Error(_0x29bc9f(0xd9)));},_0x534f30['onopen']=()=>{var _0x58424d=_0x18e890;this[_0x58424d(0x145)]||_0x534f30[_0x58424d(0x16c)]&&_0x534f30[_0x58424d(0x16c)][_0x58424d(0x1ab)]&&_0x534f30[_0x58424d(0x16c)][_0x58424d(0x1ab)](),_0x44c1c5(_0x534f30);},_0x534f30[_0x18e890(0xf7)]=()=>{var _0x136633=_0x18e890;this[_0x136633(0x11a)]=!0x0,this[_0x136633(0x108)](_0x534f30),this[_0x136633(0x15e)]();},_0x534f30['onmessage']=_0x1ca84d=>{var _0x397b0c=_0x18e890;try{_0x1ca84d&&_0x1ca84d[_0x397b0c(0xe6)]&&this[_0x397b0c(0x145)]&&JSON['parse'](_0x1ca84d[_0x397b0c(0xe6)])[_0x397b0c(0xee)]===_0x397b0c(0x13b)&&this[_0x397b0c(0xf8)][_0x397b0c(0xe9)][_0x397b0c(0x13b)]();}catch{}};})[_0x4e7a9e(0x184)](_0x481d4f=>(this['_connected']=!0x0,this[_0x4e7a9e(0x1a1)]=!0x1,this[_0x4e7a9e(0x11a)]=!0x1,this[_0x4e7a9e(0x190)]=!0x0,this[_0x4e7a9e(0x10d)]=0x0,_0x481d4f))[_0x4e7a9e(0x1a3)](_0x404cdc=>(this[_0x4e7a9e(0x146)]=!0x1,this['_connecting']=!0x1,console[_0x4e7a9e(0x19a)](_0x4e7a9e(0x199)+this[_0x4e7a9e(0x107)]),_0x4c50ec(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x404cdc&&_0x404cdc['message'])))));}));}[_0x24ae32(0x108)](_0x2e3168){var _0x17cffd=_0x24ae32;this['_connected']=!0x1,this[_0x17cffd(0x1a1)]=!0x1;try{_0x2e3168[_0x17cffd(0xf7)]=null,_0x2e3168[_0x17cffd(0xd5)]=null,_0x2e3168[_0x17cffd(0x114)]=null;}catch{}try{_0x2e3168[_0x17cffd(0x101)]<0x2&&_0x2e3168['close']();}catch{}}[_0x24ae32(0x15e)](){var _0xcfd15=_0x24ae32;clearTimeout(this['_reconnectTimeout']),!(this[_0xcfd15(0x10d)]>=this[_0xcfd15(0x197)])&&(this[_0xcfd15(0x129)]=setTimeout(()=>{var _0x6ff8c5=_0xcfd15;this['_connected']||this[_0x6ff8c5(0x1a1)]||(this['_connectToHostNow'](),this[_0x6ff8c5(0x153)]?.[_0x6ff8c5(0x1a3)](()=>this[_0x6ff8c5(0x15e)]()));},0x1f4),this['_reconnectTimeout'][_0xcfd15(0x1ab)]&&this[_0xcfd15(0x129)][_0xcfd15(0x1ab)]());}async[_0x24ae32(0xfb)](_0x51551d){var _0xe92bc5=_0x24ae32;try{if(!this[_0xe92bc5(0x190)])return;this[_0xe92bc5(0x11a)]&&this[_0xe92bc5(0x117)](),(await this[_0xe92bc5(0x153)])[_0xe92bc5(0xfb)](JSON[_0xe92bc5(0x147)](_0x51551d));}catch(_0x3b4c8c){console[_0xe92bc5(0x19a)](this[_0xe92bc5(0x125)]+':\\x20'+(_0x3b4c8c&&_0x3b4c8c['message'])),this[_0xe92bc5(0x190)]=!0x1,this[_0xe92bc5(0x15e)]();}}};function b(_0x2dcc3d,_0x1258f7,_0x28783a,_0x47a70c,_0x49f016,_0x585b74){var _0x4feb5e=_0x24ae32;let _0x4094ff=_0x28783a[_0x4feb5e(0x18c)](',')['map'](_0x398903=>{var _0x4ef02e=_0x4feb5e;try{_0x2dcc3d[_0x4ef02e(0x17c)]||((_0x49f016===_0x4ef02e(0xf3)||_0x49f016==='remix'||_0x49f016===_0x4ef02e(0x140)||_0x49f016===_0x4ef02e(0x13c))&&(_0x49f016+=!_0x2dcc3d[_0x4ef02e(0x138)]?.[_0x4ef02e(0x196)]?.[_0x4ef02e(0x169)]&&_0x2dcc3d[_0x4ef02e(0x138)]?.['env']?.['NEXT_RUNTIME']!==_0x4ef02e(0xfd)?'\\x20browser':_0x4ef02e(0x14d)),_0x2dcc3d[_0x4ef02e(0x17c)]={'id':+new Date(),'tool':_0x49f016});let _0x53ac87=new X(_0x2dcc3d,_0x1258f7,_0x398903,_0x47a70c,_0x585b74);return _0x53ac87[_0x4ef02e(0xfb)][_0x4ef02e(0xe1)](_0x53ac87);}catch(_0x3f7983){return console['warn'](_0x4ef02e(0x13d),_0x3f7983&&_0x3f7983[_0x4ef02e(0x152)]),()=>{};}});return _0x3f96b9=>_0x4094ff[_0x4feb5e(0x17e)](_0x537d76=>_0x537d76(_0x3f96b9));}function _0xe1a3(_0xab75e0,_0x53896b){var _0x47bab1=_0x47ba();return _0xe1a3=function(_0xe1a3e7,_0xd8e4f){_0xe1a3e7=_0xe1a3e7-0xca;var _0xf783d=_0x47bab1[_0xe1a3e7];return _0xf783d;},_0xe1a3(_0xab75e0,_0x53896b);}function W(_0x51ea05){var _0x292973=_0x24ae32;let _0x4c170d=function(_0x215ce1,_0xe9963b){return _0xe9963b-_0x215ce1;},_0x3e5eb9;if(_0x51ea05[_0x292973(0x191)])_0x3e5eb9=function(){var _0x4fd952=_0x292973;return _0x51ea05[_0x4fd952(0x191)][_0x4fd952(0x168)]();};else{if(_0x51ea05[_0x292973(0x138)]&&_0x51ea05[_0x292973(0x138)][_0x292973(0x11b)]&&_0x51ea05['process']?.['env']?.[_0x292973(0x102)]!==_0x292973(0xfd))_0x3e5eb9=function(){var _0x39f8d9=_0x292973;return _0x51ea05['process'][_0x39f8d9(0x11b)]();},_0x4c170d=function(_0x2273d6,_0x1c1932){return 0x3e8*(_0x1c1932[0x0]-_0x2273d6[0x0])+(_0x1c1932[0x1]-_0x2273d6[0x1])/0xf4240;};else try{let {performance:_0x10dace}=require(_0x292973(0x16e));_0x3e5eb9=function(){var _0xb586d7=_0x292973;return _0x10dace[_0xb586d7(0x168)]();};}catch{_0x3e5eb9=function(){return+new Date();};}}return{'elapsed':_0x4c170d,'timeStamp':_0x3e5eb9,'now':()=>Date['now']()};}function J(_0x4cdc41,_0x1eb45c,_0x32e2ae){var _0x2d39c3=_0x24ae32;if(_0x4cdc41[_0x2d39c3(0x1a5)]!==void 0x0)return _0x4cdc41[_0x2d39c3(0x1a5)];let _0x59979b=_0x4cdc41[_0x2d39c3(0x138)]?.[_0x2d39c3(0x196)]?.['node']||_0x4cdc41['process']?.[_0x2d39c3(0x15b)]?.[_0x2d39c3(0x102)]===_0x2d39c3(0xfd);return _0x59979b&&_0x32e2ae===_0x2d39c3(0x164)?_0x4cdc41[_0x2d39c3(0x1a5)]=!0x1:_0x4cdc41[_0x2d39c3(0x1a5)]=_0x59979b||!_0x1eb45c||_0x4cdc41[_0x2d39c3(0xe9)]?.[_0x2d39c3(0x12d)]&&_0x1eb45c[_0x2d39c3(0x100)](_0x4cdc41[_0x2d39c3(0xe9)][_0x2d39c3(0x12d)]),_0x4cdc41[_0x2d39c3(0x1a5)];}function Y(_0x269569,_0xb6c728,_0x309406,_0x583925){var _0x4ff05d=_0x24ae32;_0x269569=_0x269569,_0xb6c728=_0xb6c728,_0x309406=_0x309406,_0x583925=_0x583925;let _0x37f334=W(_0x269569),_0x50d7d1=_0x37f334[_0x4ff05d(0xf1)],_0x41cee5=_0x37f334[_0x4ff05d(0x106)];class _0x4bec75{constructor(){var _0x3f8b65=_0x4ff05d;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x3f8b65(0xd1)]=/^(0|[1-9][0-9]*)$/,this[_0x3f8b65(0x104)]=/'([^\\\\']|\\\\')*'/,this[_0x3f8b65(0x192)]=_0x269569[_0x3f8b65(0x187)],this[_0x3f8b65(0x119)]=_0x269569[_0x3f8b65(0x18e)],this['_getOwnPropertyDescriptor']=Object[_0x3f8b65(0xf6)],this[_0x3f8b65(0xfe)]=Object[_0x3f8b65(0x17d)],this['_Symbol']=_0x269569['Symbol'],this['_regExpToString']=RegExp[_0x3f8b65(0xfc)]['toString'],this[_0x3f8b65(0x150)]=Date[_0x3f8b65(0xfc)]['toString'];}[_0x4ff05d(0x14b)](_0x3ac2d4,_0x4a4d37,_0x51a527,_0x3adf91){var _0xb164cb=_0x4ff05d,_0x3ebdcd=this,_0x9246a9=_0x51a527[_0xb164cb(0x166)];function _0x3b1f57(_0x4f1712,_0x3b8cad,_0x2f1b1c){var _0x494e5a=_0xb164cb;_0x3b8cad[_0x494e5a(0x126)]='unknown',_0x3b8cad['error']=_0x4f1712[_0x494e5a(0x152)],_0x21d03e=_0x2f1b1c[_0x494e5a(0x169)][_0x494e5a(0x128)],_0x2f1b1c['node']['current']=_0x3b8cad,_0x3ebdcd[_0x494e5a(0x122)](_0x3b8cad,_0x2f1b1c);}try{_0x51a527[_0xb164cb(0x1aa)]++,_0x51a527[_0xb164cb(0x166)]&&_0x51a527['autoExpandPreviousObjects']['push'](_0x4a4d37);var _0x24d749,_0x78e3cb,_0x5ccb05,_0x2e0a3c,_0x3d1eb8=[],_0x4f51de=[],_0x4cabfa,_0x22bc10=this[_0xb164cb(0xe4)](_0x4a4d37),_0x5420bc=_0x22bc10===_0xb164cb(0x135),_0x5dfa74=!0x1,_0x2ee57e=_0x22bc10===_0xb164cb(0x132),_0x4ab493=this[_0xb164cb(0x14f)](_0x22bc10),_0x3cb7f6=this[_0xb164cb(0x162)](_0x22bc10),_0x4a8e0f=_0x4ab493||_0x3cb7f6,_0x42d6f6={},_0xfab32f=0x0,_0x3830ac=!0x1,_0x21d03e,_0x36c761=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x51a527[_0xb164cb(0xcc)]){if(_0x5420bc){if(_0x78e3cb=_0x4a4d37[_0xb164cb(0x178)],_0x78e3cb>_0x51a527[_0xb164cb(0x1b2)]){for(_0x5ccb05=0x0,_0x2e0a3c=_0x51a527[_0xb164cb(0x1b2)],_0x24d749=_0x5ccb05;_0x24d749<_0x2e0a3c;_0x24d749++)_0x4f51de['push'](_0x3ebdcd['_addProperty'](_0x3d1eb8,_0x4a4d37,_0x22bc10,_0x24d749,_0x51a527));_0x3ac2d4[_0xb164cb(0x17b)]=!0x0;}else{for(_0x5ccb05=0x0,_0x2e0a3c=_0x78e3cb,_0x24d749=_0x5ccb05;_0x24d749<_0x2e0a3c;_0x24d749++)_0x4f51de[_0xb164cb(0x18a)](_0x3ebdcd['_addProperty'](_0x3d1eb8,_0x4a4d37,_0x22bc10,_0x24d749,_0x51a527));}_0x51a527[_0xb164cb(0xec)]+=_0x4f51de[_0xb164cb(0x178)];}if(!(_0x22bc10===_0xb164cb(0xe8)||_0x22bc10===_0xb164cb(0x187))&&!_0x4ab493&&_0x22bc10!==_0xb164cb(0xde)&&_0x22bc10!=='Buffer'&&_0x22bc10!=='bigint'){var _0x8450a5=_0x3adf91[_0xb164cb(0x179)]||_0x51a527[_0xb164cb(0x179)];if(this['_isSet'](_0x4a4d37)?(_0x24d749=0x0,_0x4a4d37[_0xb164cb(0x17e)](function(_0x368387){var _0x265c23=_0xb164cb;if(_0xfab32f++,_0x51a527['autoExpandPropertyCount']++,_0xfab32f>_0x8450a5){_0x3830ac=!0x0;return;}if(!_0x51a527[_0x265c23(0xdf)]&&_0x51a527[_0x265c23(0x166)]&&_0x51a527[_0x265c23(0xec)]>_0x51a527[_0x265c23(0x163)]){_0x3830ac=!0x0;return;}_0x4f51de[_0x265c23(0x18a)](_0x3ebdcd['_addProperty'](_0x3d1eb8,_0x4a4d37,_0x265c23(0xea),_0x24d749++,_0x51a527,function(_0x473455){return function(){return _0x473455;};}(_0x368387)));})):this[_0xb164cb(0x12e)](_0x4a4d37)&&_0x4a4d37[_0xb164cb(0x17e)](function(_0x26888d,_0x1fb8b2){var _0x53b543=_0xb164cb;if(_0xfab32f++,_0x51a527[_0x53b543(0xec)]++,_0xfab32f>_0x8450a5){_0x3830ac=!0x0;return;}if(!_0x51a527[_0x53b543(0xdf)]&&_0x51a527[_0x53b543(0x166)]&&_0x51a527[_0x53b543(0xec)]>_0x51a527[_0x53b543(0x163)]){_0x3830ac=!0x0;return;}var _0x41288f=_0x1fb8b2[_0x53b543(0x15c)]();_0x41288f[_0x53b543(0x178)]>0x64&&(_0x41288f=_0x41288f[_0x53b543(0x1a6)](0x0,0x64)+'...'),_0x4f51de[_0x53b543(0x18a)](_0x3ebdcd['_addProperty'](_0x3d1eb8,_0x4a4d37,_0x53b543(0x15d),_0x41288f,_0x51a527,function(_0x9d4cd6){return function(){return _0x9d4cd6;};}(_0x26888d)));}),!_0x5dfa74){try{for(_0x4cabfa in _0x4a4d37)if(!(_0x5420bc&&_0x36c761[_0xb164cb(0xef)](_0x4cabfa))&&!this[_0xb164cb(0x16d)](_0x4a4d37,_0x4cabfa,_0x51a527)){if(_0xfab32f++,_0x51a527[_0xb164cb(0xec)]++,_0xfab32f>_0x8450a5){_0x3830ac=!0x0;break;}if(!_0x51a527[_0xb164cb(0xdf)]&&_0x51a527[_0xb164cb(0x166)]&&_0x51a527[_0xb164cb(0xec)]>_0x51a527[_0xb164cb(0x163)]){_0x3830ac=!0x0;break;}_0x4f51de['push'](_0x3ebdcd['_addObjectProperty'](_0x3d1eb8,_0x42d6f6,_0x4a4d37,_0x22bc10,_0x4cabfa,_0x51a527));}}catch{}if(_0x42d6f6[_0xb164cb(0x155)]=!0x0,_0x2ee57e&&(_0x42d6f6[_0xb164cb(0x185)]=!0x0),!_0x3830ac){var _0x3a6f04=[][_0xb164cb(0x1b1)](this[_0xb164cb(0xfe)](_0x4a4d37))['concat'](this[_0xb164cb(0x136)](_0x4a4d37));for(_0x24d749=0x0,_0x78e3cb=_0x3a6f04[_0xb164cb(0x178)];_0x24d749<_0x78e3cb;_0x24d749++)if(_0x4cabfa=_0x3a6f04[_0x24d749],!(_0x5420bc&&_0x36c761[_0xb164cb(0xef)](_0x4cabfa[_0xb164cb(0x15c)]()))&&!this[_0xb164cb(0x16d)](_0x4a4d37,_0x4cabfa,_0x51a527)&&!_0x42d6f6['_p_'+_0x4cabfa[_0xb164cb(0x15c)]()]){if(_0xfab32f++,_0x51a527['autoExpandPropertyCount']++,_0xfab32f>_0x8450a5){_0x3830ac=!0x0;break;}if(!_0x51a527['isExpressionToEvaluate']&&_0x51a527[_0xb164cb(0x166)]&&_0x51a527[_0xb164cb(0xec)]>_0x51a527[_0xb164cb(0x163)]){_0x3830ac=!0x0;break;}_0x4f51de[_0xb164cb(0x18a)](_0x3ebdcd['_addObjectProperty'](_0x3d1eb8,_0x42d6f6,_0x4a4d37,_0x22bc10,_0x4cabfa,_0x51a527));}}}}}if(_0x3ac2d4[_0xb164cb(0x126)]=_0x22bc10,_0x4a8e0f?(_0x3ac2d4[_0xb164cb(0x14e)]=_0x4a4d37['valueOf'](),this[_0xb164cb(0x1a0)](_0x22bc10,_0x3ac2d4,_0x51a527,_0x3adf91)):_0x22bc10===_0xb164cb(0x186)?_0x3ac2d4[_0xb164cb(0x14e)]=this[_0xb164cb(0x150)][_0xb164cb(0x15a)](_0x4a4d37):_0x22bc10===_0xb164cb(0x143)?_0x3ac2d4[_0xb164cb(0x14e)]=_0x4a4d37['toString']():_0x22bc10===_0xb164cb(0x195)?_0x3ac2d4[_0xb164cb(0x14e)]=this[_0xb164cb(0xd4)][_0xb164cb(0x15a)](_0x4a4d37):_0x22bc10===_0xb164cb(0xf0)&&this[_0xb164cb(0xf5)]?_0x3ac2d4[_0xb164cb(0x14e)]=this['_Symbol'][_0xb164cb(0xfc)][_0xb164cb(0x15c)][_0xb164cb(0x15a)](_0x4a4d37):!_0x51a527[_0xb164cb(0xcc)]&&!(_0x22bc10==='null'||_0x22bc10===_0xb164cb(0x187))&&(delete _0x3ac2d4[_0xb164cb(0x14e)],_0x3ac2d4[_0xb164cb(0x12f)]=!0x0),_0x3830ac&&(_0x3ac2d4['cappedProps']=!0x0),_0x21d03e=_0x51a527['node'][_0xb164cb(0x128)],_0x51a527[_0xb164cb(0x169)][_0xb164cb(0x128)]=_0x3ac2d4,this[_0xb164cb(0x122)](_0x3ac2d4,_0x51a527),_0x4f51de[_0xb164cb(0x178)]){for(_0x24d749=0x0,_0x78e3cb=_0x4f51de[_0xb164cb(0x178)];_0x24d749<_0x78e3cb;_0x24d749++)_0x4f51de[_0x24d749](_0x24d749);}_0x3d1eb8[_0xb164cb(0x178)]&&(_0x3ac2d4[_0xb164cb(0x179)]=_0x3d1eb8);}catch(_0x29e7fc){_0x3b1f57(_0x29e7fc,_0x3ac2d4,_0x51a527);}return this[_0xb164cb(0x193)](_0x4a4d37,_0x3ac2d4),this[_0xb164cb(0x180)](_0x3ac2d4,_0x51a527),_0x51a527[_0xb164cb(0x169)][_0xb164cb(0x128)]=_0x21d03e,_0x51a527[_0xb164cb(0x1aa)]--,_0x51a527['autoExpand']=_0x9246a9,_0x51a527[_0xb164cb(0x166)]&&_0x51a527[_0xb164cb(0x170)]['pop'](),_0x3ac2d4;}['_getOwnPropertySymbols'](_0x1d7ad1){var _0x16fe03=_0x4ff05d;return Object['getOwnPropertySymbols']?Object[_0x16fe03(0xd0)](_0x1d7ad1):[];}[_0x4ff05d(0xe2)](_0x44560b){var _0x4e04b3=_0x4ff05d;return!!(_0x44560b&&_0x269569['Set']&&this['_objectToString'](_0x44560b)==='[object\\x20Set]'&&_0x44560b[_0x4e04b3(0x17e)]);}['_blacklistedProperty'](_0x36f520,_0x132978,_0x152c3c){var _0x16ccd1=_0x4ff05d;return _0x152c3c[_0x16ccd1(0x1a9)]?typeof _0x36f520[_0x132978]==_0x16ccd1(0x132):!0x1;}[_0x4ff05d(0xe4)](_0x50500e){var _0x842566=_0x4ff05d,_0x37f656='';return _0x37f656=typeof _0x50500e,_0x37f656===_0x842566(0x194)?this[_0x842566(0xf4)](_0x50500e)==='[object\\x20Array]'?_0x37f656=_0x842566(0x135):this[_0x842566(0xf4)](_0x50500e)==='[object\\x20Date]'?_0x37f656=_0x842566(0x186):this[_0x842566(0xf4)](_0x50500e)==='[object\\x20BigInt]'?_0x37f656=_0x842566(0x143):_0x50500e===null?_0x37f656=_0x842566(0xe8):_0x50500e[_0x842566(0x1a8)]&&(_0x37f656=_0x50500e[_0x842566(0x1a8)]['name']||_0x37f656):_0x37f656===_0x842566(0x187)&&this['_HTMLAllCollection']&&_0x50500e instanceof this[_0x842566(0x119)]&&(_0x37f656=_0x842566(0x18e)),_0x37f656;}['_objectToString'](_0x45dc58){var _0x41ebef=_0x4ff05d;return Object['prototype'][_0x41ebef(0x15c)]['call'](_0x45dc58);}[_0x4ff05d(0x14f)](_0xcfc0be){var _0x2a8ca4=_0x4ff05d;return _0xcfc0be===_0x2a8ca4(0xd3)||_0xcfc0be===_0x2a8ca4(0x189)||_0xcfc0be==='number';}['_isPrimitiveWrapperType'](_0x10c5f5){var _0x44359b=_0x4ff05d;return _0x10c5f5==='Boolean'||_0x10c5f5===_0x44359b(0xde)||_0x10c5f5===_0x44359b(0x174);}[_0x4ff05d(0x109)](_0x1dd1f9,_0x38aa69,_0x5f01b6,_0x255f5c,_0x2760ad,_0x562ad8){var _0x53308e=this;return function(_0xb79a60){var _0x9980df=_0xe1a3,_0x339b50=_0x2760ad[_0x9980df(0x169)][_0x9980df(0x128)],_0x4a5b55=_0x2760ad[_0x9980df(0x169)][_0x9980df(0xdd)],_0x28a58e=_0x2760ad[_0x9980df(0x169)][_0x9980df(0x12b)];_0x2760ad[_0x9980df(0x169)][_0x9980df(0x12b)]=_0x339b50,_0x2760ad['node'][_0x9980df(0xdd)]=typeof _0x255f5c=='number'?_0x255f5c:_0xb79a60,_0x1dd1f9[_0x9980df(0x18a)](_0x53308e[_0x9980df(0x1ac)](_0x38aa69,_0x5f01b6,_0x255f5c,_0x2760ad,_0x562ad8)),_0x2760ad[_0x9980df(0x169)][_0x9980df(0x12b)]=_0x28a58e,_0x2760ad['node'][_0x9980df(0xdd)]=_0x4a5b55;};}[_0x4ff05d(0x10b)](_0x4fc405,_0x8cf334,_0x56595e,_0x14108a,_0xbed4a,_0x459da6,_0x4c58e7){var _0x376bbd=_0x4ff05d,_0x22da77=this;return _0x8cf334[_0x376bbd(0xe0)+_0xbed4a[_0x376bbd(0x15c)]()]=!0x0,function(_0x2fef76){var _0x437d6a=_0x376bbd,_0x8e1756=_0x459da6[_0x437d6a(0x169)][_0x437d6a(0x128)],_0x1da2e3=_0x459da6[_0x437d6a(0x169)][_0x437d6a(0xdd)],_0x2e3aed=_0x459da6[_0x437d6a(0x169)][_0x437d6a(0x12b)];_0x459da6[_0x437d6a(0x169)][_0x437d6a(0x12b)]=_0x8e1756,_0x459da6[_0x437d6a(0x169)][_0x437d6a(0xdd)]=_0x2fef76,_0x4fc405['push'](_0x22da77[_0x437d6a(0x1ac)](_0x56595e,_0x14108a,_0xbed4a,_0x459da6,_0x4c58e7)),_0x459da6[_0x437d6a(0x169)][_0x437d6a(0x12b)]=_0x2e3aed,_0x459da6['node'][_0x437d6a(0xdd)]=_0x1da2e3;};}[_0x4ff05d(0x1ac)](_0x1da41f,_0x5119e8,_0x3ce2bc,_0x322d92,_0x15fd3a){var _0x49306f=_0x4ff05d,_0x187f22=this;_0x15fd3a||(_0x15fd3a=function(_0x2acb8d,_0x3b5007){return _0x2acb8d[_0x3b5007];});var _0x1c5a8b=_0x3ce2bc[_0x49306f(0x15c)](),_0x2059df=_0x322d92['expressionsToEvaluate']||{},_0x1cddee=_0x322d92[_0x49306f(0xcc)],_0x2f4613=_0x322d92[_0x49306f(0xdf)];try{var _0x256760=this[_0x49306f(0x12e)](_0x1da41f),_0x5464e8=_0x1c5a8b;_0x256760&&_0x5464e8[0x0]==='\\x27'&&(_0x5464e8=_0x5464e8[_0x49306f(0x173)](0x1,_0x5464e8['length']-0x2));var _0x21ea7f=_0x322d92[_0x49306f(0x19f)]=_0x2059df[_0x49306f(0xe0)+_0x5464e8];_0x21ea7f&&(_0x322d92[_0x49306f(0xcc)]=_0x322d92[_0x49306f(0xcc)]+0x1),_0x322d92[_0x49306f(0xdf)]=!!_0x21ea7f;var _0x57543e=typeof _0x3ce2bc==_0x49306f(0xf0),_0x3da362={'name':_0x57543e||_0x256760?_0x1c5a8b:this[_0x49306f(0x148)](_0x1c5a8b)};if(_0x57543e&&(_0x3da362[_0x49306f(0xf0)]=!0x0),!(_0x5119e8===_0x49306f(0x135)||_0x5119e8===_0x49306f(0x19b))){var _0x1a4702=this['_getOwnPropertyDescriptor'](_0x1da41f,_0x3ce2bc);if(_0x1a4702&&(_0x1a4702[_0x49306f(0x16b)]&&(_0x3da362[_0x49306f(0xf9)]=!0x0),_0x1a4702[_0x49306f(0x105)]&&!_0x21ea7f&&!_0x322d92[_0x49306f(0x149)]))return _0x3da362[_0x49306f(0x141)]=!0x0,this[_0x49306f(0xeb)](_0x3da362,_0x322d92),_0x3da362;}var _0x508291;try{_0x508291=_0x15fd3a(_0x1da41f,_0x3ce2bc);}catch(_0x290d66){return _0x3da362={'name':_0x1c5a8b,'type':'unknown','error':_0x290d66['message']},this[_0x49306f(0xeb)](_0x3da362,_0x322d92),_0x3da362;}var _0x1aa7dc=this[_0x49306f(0xe4)](_0x508291),_0x5bdfaa=this[_0x49306f(0x14f)](_0x1aa7dc);if(_0x3da362[_0x49306f(0x126)]=_0x1aa7dc,_0x5bdfaa)this[_0x49306f(0xeb)](_0x3da362,_0x322d92,_0x508291,function(){var _0x5e824a=_0x49306f;_0x3da362['value']=_0x508291[_0x5e824a(0x130)](),!_0x21ea7f&&_0x187f22[_0x5e824a(0x1a0)](_0x1aa7dc,_0x3da362,_0x322d92,{});});else{var _0x32c361=_0x322d92[_0x49306f(0x166)]&&_0x322d92[_0x49306f(0x1aa)]<_0x322d92[_0x49306f(0xe3)]&&_0x322d92[_0x49306f(0x170)][_0x49306f(0x1a7)](_0x508291)<0x0&&_0x1aa7dc!==_0x49306f(0x132)&&_0x322d92[_0x49306f(0xec)]<_0x322d92[_0x49306f(0x163)];_0x32c361||_0x322d92[_0x49306f(0x1aa)]<_0x1cddee||_0x21ea7f?(this[_0x49306f(0x14b)](_0x3da362,_0x508291,_0x322d92,_0x21ea7f||{}),this['_additionalMetadata'](_0x508291,_0x3da362)):this['_processTreeNodeResult'](_0x3da362,_0x322d92,_0x508291,function(){var _0x57c377=_0x49306f;_0x1aa7dc==='null'||_0x1aa7dc===_0x57c377(0x187)||(delete _0x3da362[_0x57c377(0x14e)],_0x3da362[_0x57c377(0x12f)]=!0x0);});}return _0x3da362;}finally{_0x322d92['expressionsToEvaluate']=_0x2059df,_0x322d92[_0x49306f(0xcc)]=_0x1cddee,_0x322d92[_0x49306f(0xdf)]=_0x2f4613;}}[_0x4ff05d(0x1a0)](_0x1f840b,_0x47afb5,_0x1bd95a,_0x411db7){var _0x3d88c7=_0x4ff05d,_0x5d3807=_0x411db7['strLength']||_0x1bd95a['strLength'];if((_0x1f840b===_0x3d88c7(0x189)||_0x1f840b==='String')&&_0x47afb5[_0x3d88c7(0x14e)]){let _0x9cbb4=_0x47afb5['value'][_0x3d88c7(0x178)];_0x1bd95a[_0x3d88c7(0x157)]+=_0x9cbb4,_0x1bd95a[_0x3d88c7(0x157)]>_0x1bd95a['totalStrLength']?(_0x47afb5[_0x3d88c7(0x12f)]='',delete _0x47afb5[_0x3d88c7(0x14e)]):_0x9cbb4>_0x5d3807&&(_0x47afb5[_0x3d88c7(0x12f)]=_0x47afb5[_0x3d88c7(0x14e)]['substr'](0x0,_0x5d3807),delete _0x47afb5['value']);}}['_isMap'](_0x22eda0){var _0x228921=_0x4ff05d;return!!(_0x22eda0&&_0x269569[_0x228921(0x15d)]&&this[_0x228921(0xf4)](_0x22eda0)===_0x228921(0x123)&&_0x22eda0[_0x228921(0x17e)]);}[_0x4ff05d(0x148)](_0x3ecb1a){var _0x3146de=_0x4ff05d;if(_0x3ecb1a[_0x3146de(0x19d)](/^\\d+$/))return _0x3ecb1a;var _0x28e676;try{_0x28e676=JSON[_0x3146de(0x147)](''+_0x3ecb1a);}catch{_0x28e676='\\x22'+this[_0x3146de(0xf4)](_0x3ecb1a)+'\\x22';}return _0x28e676[_0x3146de(0x19d)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x28e676=_0x28e676[_0x3146de(0x173)](0x1,_0x28e676[_0x3146de(0x178)]-0x2):_0x28e676=_0x28e676['replace'](/'/g,'\\x5c\\x27')[_0x3146de(0x14a)](/\\\\\"/g,'\\x22')[_0x3146de(0x14a)](/(^\"|\"$)/g,'\\x27'),_0x28e676;}[_0x4ff05d(0xeb)](_0x4ce195,_0x4122a6,_0x1d510f,_0x18ed5f){var _0x2ee252=_0x4ff05d;this['_treeNodePropertiesBeforeFullValue'](_0x4ce195,_0x4122a6),_0x18ed5f&&_0x18ed5f(),this['_additionalMetadata'](_0x1d510f,_0x4ce195),this[_0x2ee252(0x180)](_0x4ce195,_0x4122a6);}[_0x4ff05d(0x122)](_0x4309aa,_0x43ca8b){var _0x317ae6=_0x4ff05d;this[_0x317ae6(0x10a)](_0x4309aa,_0x43ca8b),this[_0x317ae6(0xd7)](_0x4309aa,_0x43ca8b),this[_0x317ae6(0x1ae)](_0x4309aa,_0x43ca8b),this[_0x317ae6(0x10f)](_0x4309aa,_0x43ca8b);}[_0x4ff05d(0x10a)](_0xa533dd,_0x4418e6){}[_0x4ff05d(0xd7)](_0x2f284d,_0xbe983c){}[_0x4ff05d(0x113)](_0x25f09c,_0x2a92c3){}[_0x4ff05d(0x181)](_0x54d912){var _0x1a4d36=_0x4ff05d;return _0x54d912===this[_0x1a4d36(0x192)];}[_0x4ff05d(0x180)](_0x401b38,_0x3bcc58){var _0x3e560b=_0x4ff05d;this[_0x3e560b(0x113)](_0x401b38,_0x3bcc58),this[_0x3e560b(0x154)](_0x401b38),_0x3bcc58[_0x3e560b(0x167)]&&this[_0x3e560b(0x13f)](_0x401b38),this['_addFunctionsNode'](_0x401b38,_0x3bcc58),this['_addLoadNode'](_0x401b38,_0x3bcc58),this[_0x3e560b(0x16a)](_0x401b38);}[_0x4ff05d(0x193)](_0x1a9892,_0x4eb3ac){var _0x445444=_0x4ff05d;let _0x1eac7b;try{_0x269569[_0x445444(0x1a2)]&&(_0x1eac7b=_0x269569[_0x445444(0x1a2)][_0x445444(0x159)],_0x269569[_0x445444(0x1a2)][_0x445444(0x159)]=function(){}),_0x1a9892&&typeof _0x1a9892[_0x445444(0x178)]==_0x445444(0x1a4)&&(_0x4eb3ac[_0x445444(0x178)]=_0x1a9892[_0x445444(0x178)]);}catch{}finally{_0x1eac7b&&(_0x269569[_0x445444(0x1a2)][_0x445444(0x159)]=_0x1eac7b);}if(_0x4eb3ac['type']===_0x445444(0x1a4)||_0x4eb3ac['type']==='Number'){if(isNaN(_0x4eb3ac['value']))_0x4eb3ac[_0x445444(0x198)]=!0x0,delete _0x4eb3ac[_0x445444(0x14e)];else switch(_0x4eb3ac[_0x445444(0x14e)]){case Number[_0x445444(0x156)]:_0x4eb3ac['positiveInfinity']=!0x0,delete _0x4eb3ac[_0x445444(0x14e)];break;case Number[_0x445444(0x14c)]:_0x4eb3ac[_0x445444(0x11f)]=!0x0,delete _0x4eb3ac['value'];break;case 0x0:this['_isNegativeZero'](_0x4eb3ac[_0x445444(0x14e)])&&(_0x4eb3ac[_0x445444(0x11c)]=!0x0);break;}}else _0x4eb3ac[_0x445444(0x126)]===_0x445444(0x132)&&typeof _0x1a9892[_0x445444(0x139)]==_0x445444(0x189)&&_0x1a9892['name']&&_0x4eb3ac[_0x445444(0x139)]&&_0x1a9892[_0x445444(0x139)]!==_0x4eb3ac[_0x445444(0x139)]&&(_0x4eb3ac[_0x445444(0x137)]=_0x1a9892['name']);}[_0x4ff05d(0x110)](_0x35fc99){var _0x2cdb7d=_0x4ff05d;return 0x1/_0x35fc99===Number[_0x2cdb7d(0x14c)];}[_0x4ff05d(0x13f)](_0x36a950){var _0x369f6e=_0x4ff05d;!_0x36a950['props']||!_0x36a950['props'][_0x369f6e(0x178)]||_0x36a950[_0x369f6e(0x126)]===_0x369f6e(0x135)||_0x36a950[_0x369f6e(0x126)]==='Map'||_0x36a950[_0x369f6e(0x126)]===_0x369f6e(0xea)||_0x36a950['props'][_0x369f6e(0x171)](function(_0x3f86f5,_0x311f76){var _0x236385=_0x369f6e,_0x35b404=_0x3f86f5[_0x236385(0x139)][_0x236385(0x183)](),_0x650156=_0x311f76[_0x236385(0x139)]['toLowerCase']();return _0x35b404<_0x650156?-0x1:_0x35b404>_0x650156?0x1:0x0;});}[_0x4ff05d(0x133)](_0x2f1ebc,_0x50105a){var _0xbfcd7d=_0x4ff05d;if(!(_0x50105a[_0xbfcd7d(0x1a9)]||!_0x2f1ebc[_0xbfcd7d(0x179)]||!_0x2f1ebc[_0xbfcd7d(0x179)]['length'])){for(var _0x253a6a=[],_0x2102b6=[],_0x2bb908=0x0,_0x546f89=_0x2f1ebc[_0xbfcd7d(0x179)][_0xbfcd7d(0x178)];_0x2bb908<_0x546f89;_0x2bb908++){var _0x1cbd3e=_0x2f1ebc['props'][_0x2bb908];_0x1cbd3e['type']==='function'?_0x253a6a[_0xbfcd7d(0x18a)](_0x1cbd3e):_0x2102b6[_0xbfcd7d(0x18a)](_0x1cbd3e);}if(!(!_0x2102b6['length']||_0x253a6a[_0xbfcd7d(0x178)]<=0x1)){_0x2f1ebc[_0xbfcd7d(0x179)]=_0x2102b6;var _0x1a40f3={'functionsNode':!0x0,'props':_0x253a6a};this['_setNodeId'](_0x1a40f3,_0x50105a),this[_0xbfcd7d(0x113)](_0x1a40f3,_0x50105a),this[_0xbfcd7d(0x154)](_0x1a40f3),this[_0xbfcd7d(0x10f)](_0x1a40f3,_0x50105a),_0x1a40f3['id']+='\\x20f',_0x2f1ebc[_0xbfcd7d(0x179)][_0xbfcd7d(0x120)](_0x1a40f3);}}}[_0x4ff05d(0x188)](_0x46e259,_0x47f4eb){}[_0x4ff05d(0x154)](_0x1d9f64){}['_isArray'](_0xda35a3){var _0x2a28dd=_0x4ff05d;return Array['isArray'](_0xda35a3)||typeof _0xda35a3=='object'&&this[_0x2a28dd(0xf4)](_0xda35a3)===_0x2a28dd(0xda);}[_0x4ff05d(0x10f)](_0x2ad62b,_0x3d8b5c){}['_cleanNode'](_0x125644){var _0x1573c2=_0x4ff05d;delete _0x125644[_0x1573c2(0xca)],delete _0x125644['_hasSetOnItsPath'],delete _0x125644[_0x1573c2(0x158)];}['_setNodeExpressionPath'](_0x23066f,_0x31c14e){}}let _0x530de9=new _0x4bec75(),_0x5bb14b={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x462f4d={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x5439d6(_0x453dfa,_0x415706,_0x2d7675,_0x22037c,_0x43ea92,_0x50f5f6){var _0x27b06c=_0x4ff05d;let _0x4f017d,_0x4782f7;try{_0x4782f7=_0x41cee5(),_0x4f017d=_0x309406[_0x415706],!_0x4f017d||_0x4782f7-_0x4f017d['ts']>0x1f4&&_0x4f017d[_0x27b06c(0x121)]&&_0x4f017d['time']/_0x4f017d[_0x27b06c(0x121)]<0x64?(_0x309406[_0x415706]=_0x4f017d={'count':0x0,'time':0x0,'ts':_0x4782f7},_0x309406['hits']={}):_0x4782f7-_0x309406['hits']['ts']>0x32&&_0x309406[_0x27b06c(0x160)][_0x27b06c(0x121)]&&_0x309406['hits']['time']/_0x309406['hits'][_0x27b06c(0x121)]<0x64&&(_0x309406[_0x27b06c(0x160)]={});let _0xe784a6=[],_0x375cac=_0x4f017d[_0x27b06c(0xdc)]||_0x309406['hits']['reduceLimits']?_0x462f4d:_0x5bb14b,_0x351b28=_0x59669e=>{var _0x5be152=_0x27b06c;let _0x21cc5c={};return _0x21cc5c['props']=_0x59669e[_0x5be152(0x179)],_0x21cc5c[_0x5be152(0x1b2)]=_0x59669e[_0x5be152(0x1b2)],_0x21cc5c['strLength']=_0x59669e[_0x5be152(0x177)],_0x21cc5c['totalStrLength']=_0x59669e[_0x5be152(0xfa)],_0x21cc5c[_0x5be152(0x163)]=_0x59669e[_0x5be152(0x163)],_0x21cc5c[_0x5be152(0xe3)]=_0x59669e[_0x5be152(0xe3)],_0x21cc5c[_0x5be152(0x167)]=!0x1,_0x21cc5c[_0x5be152(0x1a9)]=!_0xb6c728,_0x21cc5c[_0x5be152(0xcc)]=0x1,_0x21cc5c[_0x5be152(0x1aa)]=0x0,_0x21cc5c[_0x5be152(0xd8)]='root_exp_id',_0x21cc5c['rootExpression']='root_exp',_0x21cc5c[_0x5be152(0x166)]=!0x0,_0x21cc5c['autoExpandPreviousObjects']=[],_0x21cc5c[_0x5be152(0xec)]=0x0,_0x21cc5c['resolveGetters']=!0x0,_0x21cc5c[_0x5be152(0x157)]=0x0,_0x21cc5c[_0x5be152(0x169)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x21cc5c;};for(var _0x5659d5=0x0;_0x5659d5<_0x43ea92[_0x27b06c(0x178)];_0x5659d5++)_0xe784a6[_0x27b06c(0x18a)](_0x530de9[_0x27b06c(0x14b)]({'timeNode':_0x453dfa===_0x27b06c(0x172)||void 0x0},_0x43ea92[_0x5659d5],_0x351b28(_0x375cac),{}));if(_0x453dfa===_0x27b06c(0x142)){let _0x3d506b=Error[_0x27b06c(0xd2)];try{Error[_0x27b06c(0xd2)]=0x1/0x0,_0xe784a6['push'](_0x530de9['serialize']({'stackNode':!0x0},new Error()[_0x27b06c(0x13a)],_0x351b28(_0x375cac),{'strLength':0x1/0x0}));}finally{Error[_0x27b06c(0xd2)]=_0x3d506b;}}return{'method':_0x27b06c(0x131),'version':_0x583925,'args':[{'ts':_0x2d7675,'session':_0x22037c,'args':_0xe784a6,'id':_0x415706,'context':_0x50f5f6}]};}catch(_0x50b21c){return{'method':_0x27b06c(0x131),'version':_0x583925,'args':[{'ts':_0x2d7675,'session':_0x22037c,'args':[{'type':_0x27b06c(0xf2),'error':_0x50b21c&&_0x50b21c[_0x27b06c(0x152)]}],'id':_0x415706,'context':_0x50f5f6}]};}finally{try{if(_0x4f017d&&_0x4782f7){let _0x6e3f50=_0x41cee5();_0x4f017d[_0x27b06c(0x121)]++,_0x4f017d[_0x27b06c(0x172)]+=_0x50d7d1(_0x4782f7,_0x6e3f50),_0x4f017d['ts']=_0x6e3f50,_0x309406[_0x27b06c(0x160)][_0x27b06c(0x121)]++,_0x309406['hits'][_0x27b06c(0x172)]+=_0x50d7d1(_0x4782f7,_0x6e3f50),_0x309406[_0x27b06c(0x160)]['ts']=_0x6e3f50,(_0x4f017d[_0x27b06c(0x121)]>0x32||_0x4f017d[_0x27b06c(0x172)]>0x64)&&(_0x4f017d[_0x27b06c(0xdc)]=!0x0),(_0x309406['hits']['count']>0x3e8||_0x309406[_0x27b06c(0x160)][_0x27b06c(0x172)]>0x12c)&&(_0x309406[_0x27b06c(0x160)][_0x27b06c(0xdc)]=!0x0);}}catch{}}}return _0x5439d6;}((_0x436b2f,_0x5e9e68,_0x739f51,_0x200859,_0x5ade45,_0x3c0c4a,_0x2e9ef4,_0x52f7b9,_0x489bcc,_0x4b0904)=>{var _0x3eb34b=_0x24ae32;if(_0x436b2f['_console_ninja'])return _0x436b2f[_0x3eb34b(0x10c)];if(!J(_0x436b2f,_0x52f7b9,_0x5ade45))return _0x436b2f['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x436b2f['_console_ninja'];let _0x17ed1e=W(_0x436b2f),_0x5b8aae=_0x17ed1e[_0x3eb34b(0xf1)],_0x358f86=_0x17ed1e[_0x3eb34b(0x106)],_0x1db0c7=_0x17ed1e[_0x3eb34b(0x168)],_0x5edab2={'hits':{},'ts':{}},_0x2306a6=Y(_0x436b2f,_0x489bcc,_0x5edab2,_0x3c0c4a),_0x5c2099=_0x39c657=>{_0x5edab2['ts'][_0x39c657]=_0x358f86();},_0x3a97e3=(_0x231603,_0x32531e)=>{var _0x2a1511=_0x3eb34b;let _0x5019aa=_0x5edab2['ts'][_0x32531e];if(delete _0x5edab2['ts'][_0x32531e],_0x5019aa){let _0x26ffff=_0x5b8aae(_0x5019aa,_0x358f86());_0x482728(_0x2306a6(_0x2a1511(0x172),_0x231603,_0x1db0c7(),_0x109c4f,[_0x26ffff],_0x32531e));}},_0x160f42=_0x40a389=>_0x174f3e=>{var _0x581236=_0x3eb34b;try{_0x5c2099(_0x174f3e),_0x40a389(_0x174f3e);}finally{_0x436b2f[_0x581236(0x1a2)][_0x581236(0x172)]=_0x40a389;}},_0x46bc9a=_0x8b78e8=>_0x4c80fe=>{var _0x44e4b4=_0x3eb34b;try{let [_0x285c7c,_0x16c463]=_0x4c80fe[_0x44e4b4(0x18c)](':logPointId:');_0x3a97e3(_0x16c463,_0x285c7c),_0x8b78e8(_0x285c7c);}finally{_0x436b2f[_0x44e4b4(0x1a2)]['timeEnd']=_0x8b78e8;}};_0x436b2f[_0x3eb34b(0x10c)]={'consoleLog':(_0x1bc2ea,_0x3f3e00)=>{var _0x4b6724=_0x3eb34b;_0x436b2f['console'][_0x4b6724(0x131)]['name']!==_0x4b6724(0x116)&&_0x482728(_0x2306a6('log',_0x1bc2ea,_0x1db0c7(),_0x109c4f,_0x3f3e00));},'consoleTrace':(_0x1fa5f1,_0x122566)=>{var _0x122607=_0x3eb34b;_0x436b2f[_0x122607(0x1a2)][_0x122607(0x131)]['name']!==_0x122607(0x103)&&_0x482728(_0x2306a6(_0x122607(0x142),_0x1fa5f1,_0x1db0c7(),_0x109c4f,_0x122566));},'consoleTime':()=>{var _0x4d68d2=_0x3eb34b;_0x436b2f[_0x4d68d2(0x1a2)][_0x4d68d2(0x172)]=_0x160f42(_0x436b2f['console']['time']);},'consoleTimeEnd':()=>{var _0x3453b4=_0x3eb34b;_0x436b2f[_0x3453b4(0x1a2)][_0x3453b4(0x175)]=_0x46bc9a(_0x436b2f[_0x3453b4(0x1a2)][_0x3453b4(0x175)]);},'autoLog':(_0x449076,_0x2e7866)=>{var _0x5828ec=_0x3eb34b;_0x482728(_0x2306a6(_0x5828ec(0x131),_0x2e7866,_0x1db0c7(),_0x109c4f,[_0x449076]));},'autoLogMany':(_0x53314b,_0x42a9f5)=>{var _0x13e6ec=_0x3eb34b;_0x482728(_0x2306a6(_0x13e6ec(0x131),_0x53314b,_0x1db0c7(),_0x109c4f,_0x42a9f5));},'autoTrace':(_0x564590,_0x101283)=>{var _0x223bdf=_0x3eb34b;_0x482728(_0x2306a6(_0x223bdf(0x142),_0x101283,_0x1db0c7(),_0x109c4f,[_0x564590]));},'autoTraceMany':(_0x553423,_0x3690e0)=>{var _0x35ab7e=_0x3eb34b;_0x482728(_0x2306a6(_0x35ab7e(0x142),_0x553423,_0x1db0c7(),_0x109c4f,_0x3690e0));},'autoTime':(_0x2540cc,_0x2ad40f,_0x2cc138)=>{_0x5c2099(_0x2cc138);},'autoTimeEnd':(_0x30e6d3,_0x4c710,_0x38d515)=>{_0x3a97e3(_0x4c710,_0x38d515);},'coverage':_0x6611fa=>{var _0x55a654=_0x3eb34b;_0x482728({'method':_0x55a654(0x15f),'version':_0x3c0c4a,'args':[{'id':_0x6611fa}]});}};let _0x482728=b(_0x436b2f,_0x5e9e68,_0x739f51,_0x200859,_0x5ade45,_0x4b0904),_0x109c4f=_0x436b2f[_0x3eb34b(0x17c)];return _0x436b2f['_console_ninja'];})(globalThis,_0x24ae32(0x1b0),_0x24ae32(0xd6),_0x24ae32(0x11d),_0x24ae32(0x10e),_0x24ae32(0x17a),'1712513090327',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Vinu-Variyatils-MacBook-Pro-C02G8ASUMD6M-Standard.local\",\"192.168.70.200\"],_0x24ae32(0x1ad),_0x24ae32(0x11e));"
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
/* istanbul ignore next */ function oo_ts() {
    try {
        oo_cm().consoleTime();
    } catch (e) {}
}
oo_ts;
/* istanbul ignore next */ function oo_te() {
    try {
        oo_cm().consoleTimeEnd();
    } catch (e) {}
}
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/
