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
                "/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x5ae6(_0xe59250,_0x3558db){var _0x207829=_0x2078();return _0x5ae6=function(_0x5ae68f,_0x3d71d3){_0x5ae68f=_0x5ae68f-0x79;var _0x29003a=_0x207829[_0x5ae68f];return _0x29003a;},_0x5ae6(_0xe59250,_0x3558db);}var _0x33751d=_0x5ae6;(function(_0x1580d3,_0x530235){var _0x2d62ab=_0x5ae6,_0x59bf7e=_0x1580d3();while(!![]){try{var _0x4c04e2=-parseInt(_0x2d62ab(0xab))/0x1+parseInt(_0x2d62ab(0x12a))/0x2*(-parseInt(_0x2d62ab(0x126))/0x3)+-parseInt(_0x2d62ab(0x15c))/0x4+parseInt(_0x2d62ab(0x10b))/0x5+parseInt(_0x2d62ab(0xf6))/0x6*(-parseInt(_0x2d62ab(0xd1))/0x7)+parseInt(_0x2d62ab(0x156))/0x8+parseInt(_0x2d62ab(0x164))/0x9;if(_0x4c04e2===_0x530235)break;else _0x59bf7e['push'](_0x59bf7e['shift']());}catch(_0x49e475){_0x59bf7e['push'](_0x59bf7e['shift']());}}}(_0x2078,0xbf608));var K=Object[_0x33751d(0x13b)],Q=Object['defineProperty'],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x33751d(0x15f)],te=Object[_0x33751d(0x13a)],ne=Object[_0x33751d(0x117)]['hasOwnProperty'],re=(_0x378a0b,_0x5be43b,_0x4141ab,_0x5534d0)=>{var _0x1d91a9=_0x33751d;if(_0x5be43b&&typeof _0x5be43b=='object'||typeof _0x5be43b==_0x1d91a9(0x136)){for(let _0x43300f of ee(_0x5be43b))!ne[_0x1d91a9(0x120)](_0x378a0b,_0x43300f)&&_0x43300f!==_0x4141ab&&Q(_0x378a0b,_0x43300f,{'get':()=>_0x5be43b[_0x43300f],'enumerable':!(_0x5534d0=G(_0x5be43b,_0x43300f))||_0x5534d0[_0x1d91a9(0xf0)]});}return _0x378a0b;},V=(_0x1572c3,_0x1a5973,_0xb2e110)=>(_0xb2e110=_0x1572c3!=null?K(te(_0x1572c3)):{},re(_0x1a5973||!_0x1572c3||!_0x1572c3['__es'+'Module']?Q(_0xb2e110,'default',{'value':_0x1572c3,'enumerable':!0x0}):_0xb2e110,_0x1572c3)),x=class{constructor(_0x14c988,_0x3f5869,_0x487fcd,_0xdc6ff5,_0x490feb,_0x3149b4){var _0x3900c8=_0x33751d,_0x1814a9,_0x13a7ce,_0x3692d0,_0x3e7d20;this[_0x3900c8(0x119)]=_0x14c988,this[_0x3900c8(0x11c)]=_0x3f5869,this[_0x3900c8(0xb9)]=_0x487fcd,this[_0x3900c8(0x104)]=_0xdc6ff5,this['dockerizedApp']=_0x490feb,this['eventReceivedCallback']=_0x3149b4,this[_0x3900c8(0x9e)]=!0x0,this[_0x3900c8(0xd2)]=!0x0,this['_connected']=!0x1,this['_connecting']=!0x1,this[_0x3900c8(0x91)]=((_0x13a7ce=(_0x1814a9=_0x14c988[_0x3900c8(0x95)])==null?void 0x0:_0x1814a9[_0x3900c8(0xd3)])==null?void 0x0:_0x13a7ce[_0x3900c8(0xda)])==='edge',this[_0x3900c8(0x7b)]=!((_0x3e7d20=(_0x3692d0=this['global'][_0x3900c8(0x95)])==null?void 0x0:_0x3692d0[_0x3900c8(0xa6)])!=null&&_0x3e7d20[_0x3900c8(0xcf)])&&!this['_inNextEdge'],this[_0x3900c8(0x9f)]=null,this[_0x3900c8(0x9b)]=0x0,this[_0x3900c8(0x101)]=0x14,this[_0x3900c8(0xee)]=_0x3900c8(0xff),this[_0x3900c8(0xdf)]=(this[_0x3900c8(0x7b)]?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x3900c8(0x102))+this[_0x3900c8(0xee)];}async[_0x33751d(0x113)](){var _0x459110=_0x33751d,_0x438d68,_0x4e623f;if(this[_0x459110(0x9f)])return this[_0x459110(0x9f)];let _0x409225;if(this[_0x459110(0x7b)]||this[_0x459110(0x91)])_0x409225=this[_0x459110(0x119)][_0x459110(0x108)];else{if((_0x438d68=this[_0x459110(0x119)][_0x459110(0x95)])!=null&&_0x438d68['_WebSocket'])_0x409225=(_0x4e623f=this[_0x459110(0x119)][_0x459110(0x95)])==null?void 0x0:_0x4e623f['_WebSocket'];else try{let _0x3e2c3a=await import('path');_0x409225=(await import((await import(_0x459110(0x87)))[_0x459110(0xbc)](_0x3e2c3a[_0x459110(0xae)](this[_0x459110(0x104)],_0x459110(0xd5)))[_0x459110(0x94)]()))[_0x459110(0xc2)];}catch{try{_0x409225=require(require(_0x459110(0xcc))['join'](this['nodeModules'],'ws'));}catch{throw new Error(_0x459110(0x8d));}}}return this[_0x459110(0x9f)]=_0x409225,_0x409225;}['_connectToHostNow'](){var _0x4a8d79=_0x33751d;this[_0x4a8d79(0x141)]||this['_connected']||this[_0x4a8d79(0x9b)]>=this['_maxConnectAttemptCount']||(this[_0x4a8d79(0xd2)]=!0x1,this['_connecting']=!0x0,this['_connectAttemptCount']++,this['_ws']=new Promise((_0x3cbe4d,_0x2e3ad8)=>{var _0x204198=_0x4a8d79;this[_0x204198(0x113)]()[_0x204198(0x85)](_0x3af9a3=>{var _0x5c60f2=_0x204198;let _0xe9f012=new _0x3af9a3(_0x5c60f2(0xeb)+(!this['_inBrowser']&&this[_0x5c60f2(0x7f)]?'gateway.docker.internal':this[_0x5c60f2(0x11c)])+':'+this[_0x5c60f2(0xb9)]);_0xe9f012[_0x5c60f2(0x15b)]=()=>{var _0xda8f41=_0x5c60f2;this[_0xda8f41(0x9e)]=!0x1,this[_0xda8f41(0x137)](_0xe9f012),this['_attemptToReconnectShortly'](),_0x2e3ad8(new Error('logger\\x20websocket\\x20error'));},_0xe9f012[_0x5c60f2(0xf2)]=()=>{var _0x17936b=_0x5c60f2;this[_0x17936b(0x7b)]||_0xe9f012['_socket']&&_0xe9f012[_0x17936b(0xfb)]['unref']&&_0xe9f012['_socket']['unref'](),_0x3cbe4d(_0xe9f012);},_0xe9f012[_0x5c60f2(0xb0)]=()=>{var _0x180c04=_0x5c60f2;this[_0x180c04(0xd2)]=!0x0,this[_0x180c04(0x137)](_0xe9f012),this[_0x180c04(0xa0)]();},_0xe9f012[_0x5c60f2(0x103)]=_0x14a9c0=>{var _0x21a770=_0x5c60f2;try{if(!(_0x14a9c0!=null&&_0x14a9c0[_0x21a770(0x11f)])||!this[_0x21a770(0xc8)])return;let _0x43e137=JSON['parse'](_0x14a9c0['data']);this[_0x21a770(0xc8)](_0x43e137[_0x21a770(0x14f)],_0x43e137[_0x21a770(0x149)],this[_0x21a770(0x119)],this['_inBrowser']);}catch{}};})[_0x204198(0x85)](_0x16cd61=>(this[_0x204198(0xd7)]=!0x0,this[_0x204198(0x141)]=!0x1,this[_0x204198(0xd2)]=!0x1,this[_0x204198(0x9e)]=!0x0,this[_0x204198(0x9b)]=0x0,_0x16cd61))[_0x204198(0x100)](_0x2d78fa=>(this[_0x204198(0xd7)]=!0x1,this[_0x204198(0x141)]=!0x1,console[_0x204198(0x158)](_0x204198(0x161)+this['_webSocketErrorDocsLink']),_0x2e3ad8(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x2d78fa&&_0x2d78fa['message'])))));}));}['_disposeWebsocket'](_0x517ffa){var _0x25991d=_0x33751d;this[_0x25991d(0xd7)]=!0x1,this[_0x25991d(0x141)]=!0x1;try{_0x517ffa['onclose']=null,_0x517ffa[_0x25991d(0x15b)]=null,_0x517ffa[_0x25991d(0xf2)]=null;}catch{}try{_0x517ffa[_0x25991d(0x138)]<0x2&&_0x517ffa[_0x25991d(0xaf)]();}catch{}}['_attemptToReconnectShortly'](){var _0x1a2f4c=_0x33751d;clearTimeout(this[_0x1a2f4c(0x8b)]),!(this[_0x1a2f4c(0x9b)]>=this[_0x1a2f4c(0x101)])&&(this[_0x1a2f4c(0x8b)]=setTimeout(()=>{var _0x4b103d=_0x1a2f4c,_0x5bc6bb;this[_0x4b103d(0xd7)]||this[_0x4b103d(0x141)]||(this[_0x4b103d(0x14b)](),(_0x5bc6bb=this[_0x4b103d(0x107)])==null||_0x5bc6bb[_0x4b103d(0x100)](()=>this[_0x4b103d(0xa0)]()));},0x1f4),this[_0x1a2f4c(0x8b)]['unref']&&this['_reconnectTimeout'][_0x1a2f4c(0x153)]());}async[_0x33751d(0xed)](_0x169a71){var _0x1691d8=_0x33751d;try{if(!this[_0x1691d8(0x9e)])return;this['_allowedToConnectOnSend']&&this[_0x1691d8(0x14b)](),(await this['_ws'])[_0x1691d8(0xed)](JSON[_0x1691d8(0xe0)](_0x169a71));}catch(_0x4c2811){console[_0x1691d8(0x158)](this[_0x1691d8(0xdf)]+':\\x20'+(_0x4c2811&&_0x4c2811[_0x1691d8(0xa4)])),this[_0x1691d8(0x9e)]=!0x1,this['_attemptToReconnectShortly']();}}};function _0x2078(){var _0xe2da9b=['origin','reload','depth','port','_addLoadNode','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','pathToFileURL','string','Map','disabledLog','undefined','\\x20browser','default','_dateToString','HTMLAllCollection','elements','error','_isNegativeZero','eventReceivedCallback',\"/Users/abuhasan/.vscode/extensions/wallabyjs.console-ninja-1.0.326/node_modules\",'current','substr','path','_undefined','NEGATIVE_INFINITY','node','autoExpandPropertyCount','532VSVcuz','_allowedToConnectOnSend','env','expId','ws/index.js','elapsed','_connected','','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','NEXT_RUNTIME','_isPrimitiveType','String','console','isArray','_sendErrorMessage','stringify','indexOf','date','level','webpack','angular','type','get','_consoleNinjaAllowedToStart','_isMap','_processTreeNodeResult','ws://','[object\\x20Set]','send','_webSocketErrorDocsLink','root_exp','enumerable','Buffer','onopen','_setNodePermissions','...','serialize','49458nZLSmu','Number','parent','_addObjectProperty','_setNodeQueryPath','_socket','_hasSymbolPropertyOnItsPath','1719307138154','','https://tinyurl.com/37x8b79t','catch','_maxConnectAttemptCount','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','onmessage','nodeModules','_p_name',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Abu-Hasan-Al-Mobaraks-Mac-P0XW9K7GJ0-Standard.local\",\"10.10.25.161\"],'_ws','WebSocket','forEach','toLowerCase','830785UZMafj','location','_HTMLAllCollection','1.0.0','number','reduceLimits','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','_treeNodePropertiesBeforeFullValue','getWebSocketClass','autoExpandLimit','noFunctions','unknown','prototype','_setNodeLabel','global','expressionsToEvaluate','_setNodeExpandableState','host','127.0.0.1','bigint','data','call','rootExpression','_capIfString','push','autoExpandMaxDepth','_isUndefined','345tgHQjs','Set','includes','autoExpandPreviousObjects','500ifQCdk','_regExpToString','time','array','_getOwnPropertyNames','test','[object\\x20Date]','_p_','length','now','_addProperty','name','function','_disposeWebsocket','readyState','charAt','getPrototypeOf','create','[object\\x20Array]','totalStrLength','split','props','value','_connecting','_hasSetOnItsPath','negativeZero','boolean','remix','hostname','pop','edge','args','hrtime','_connectToHostNow','_objectToString','trace','stack','method','_sortProps','cappedProps','strLength','unref','_console_ninja_session','toUpperCase','5711968SyglLm','Boolean','warn','astro','Symbol','onerror','22136rCEGED','_property','autoExpand','getOwnPropertyNames','object','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','replace','getOwnPropertySymbols','5333724CAZoaK','_p_length','_treeNodePropertiesAfterFullValue','_inBrowser','capped','constructor','_console_ninja','dockerizedApp','resolveGetters','next.js','_addFunctionsNode','cappedElements','1','then','49153','url','_blacklistedProperty','setter','_isPrimitiveWrapperType','_reconnectTimeout','isExpressionToEvaluate','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','count','_Symbol','allStrLength','_inNextEdge','_type','\\x20server','toString','process','symbol','index','slice','stackTraceLimit','_isSet','_connectAttemptCount','match','sortProps','_allowedToSend','_WebSocketClass','_attemptToReconnectShortly','_keyStrRegExp','[object\\x20Map]','perf_hooks','message','null','versions','_isArray','_getOwnPropertyDescriptor','timeStamp','_additionalMetadata','28157LVqQxE','disabledTrace','coverage','join','close','onclose','positiveInfinity','log','_setNodeId','hits','nuxt'];_0x2078=function(){return _0xe2da9b;};return _0x2078();}function q(_0x26a3dc,_0x52d401,_0x543b86,_0x26b2b8,_0x4dc201,_0x1a2e80,_0x42671b,_0x24f68c=ie){var _0x174ad7=_0x33751d;let _0x45e80b=_0x543b86[_0x174ad7(0x13e)](',')['map'](_0x129428=>{var _0x1b4e7f=_0x174ad7,_0x529bcc,_0x2b5e61,_0x3bcd37,_0xf4afed;try{if(!_0x26a3dc[_0x1b4e7f(0x154)]){let _0x269048=((_0x2b5e61=(_0x529bcc=_0x26a3dc[_0x1b4e7f(0x95)])==null?void 0x0:_0x529bcc[_0x1b4e7f(0xa6)])==null?void 0x0:_0x2b5e61[_0x1b4e7f(0xcf)])||((_0xf4afed=(_0x3bcd37=_0x26a3dc[_0x1b4e7f(0x95)])==null?void 0x0:_0x3bcd37[_0x1b4e7f(0xd3)])==null?void 0x0:_0xf4afed[_0x1b4e7f(0xda)])===_0x1b4e7f(0x148);(_0x4dc201===_0x1b4e7f(0x81)||_0x4dc201===_0x1b4e7f(0x145)||_0x4dc201===_0x1b4e7f(0x159)||_0x4dc201===_0x1b4e7f(0xe5))&&(_0x4dc201+=_0x269048?_0x1b4e7f(0x93):_0x1b4e7f(0xc1)),_0x26a3dc[_0x1b4e7f(0x154)]={'id':+new Date(),'tool':_0x4dc201},_0x42671b&&_0x4dc201&&!_0x269048&&console[_0x1b4e7f(0xb2)]('%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20'+(_0x4dc201[_0x1b4e7f(0x139)](0x0)[_0x1b4e7f(0x155)]()+_0x4dc201[_0x1b4e7f(0xcb)](0x1))+',',_0x1b4e7f(0xd9),_0x1b4e7f(0x111));}let _0x2b8e17=new x(_0x26a3dc,_0x52d401,_0x129428,_0x26b2b8,_0x1a2e80,_0x24f68c);return _0x2b8e17[_0x1b4e7f(0xed)]['bind'](_0x2b8e17);}catch(_0x28f69d){return console['warn'](_0x1b4e7f(0xbb),_0x28f69d&&_0x28f69d[_0x1b4e7f(0xa4)]),()=>{};}});return _0x5496d6=>_0x45e80b[_0x174ad7(0x109)](_0x4ef0c1=>_0x4ef0c1(_0x5496d6));}function ie(_0x87e2ba,_0x507635,_0x3211db,_0xce223e){var _0x6bbbc1=_0x33751d;_0xce223e&&_0x87e2ba===_0x6bbbc1(0xb7)&&_0x3211db[_0x6bbbc1(0x10c)][_0x6bbbc1(0xb7)]();}function b(_0x6a2708){var _0x5bcd25=_0x33751d,_0x42ac56,_0x5099ad;let _0x5a71f4=function(_0x41124a,_0x4e8278){return _0x4e8278-_0x41124a;},_0x4050b9;if(_0x6a2708['performance'])_0x4050b9=function(){var _0x54b501=_0x5ae6;return _0x6a2708['performance'][_0x54b501(0x133)]();};else{if(_0x6a2708[_0x5bcd25(0x95)]&&_0x6a2708[_0x5bcd25(0x95)][_0x5bcd25(0x14a)]&&((_0x5099ad=(_0x42ac56=_0x6a2708[_0x5bcd25(0x95)])==null?void 0x0:_0x42ac56[_0x5bcd25(0xd3)])==null?void 0x0:_0x5099ad[_0x5bcd25(0xda)])!=='edge')_0x4050b9=function(){return _0x6a2708['process']['hrtime']();},_0x5a71f4=function(_0x40d6f0,_0x4477e6){return 0x3e8*(_0x4477e6[0x0]-_0x40d6f0[0x0])+(_0x4477e6[0x1]-_0x40d6f0[0x1])/0xf4240;};else try{let {performance:_0x2f4392}=require(_0x5bcd25(0xa3));_0x4050b9=function(){var _0x7919e3=_0x5bcd25;return _0x2f4392[_0x7919e3(0x133)]();};}catch{_0x4050b9=function(){return+new Date();};}}return{'elapsed':_0x5a71f4,'timeStamp':_0x4050b9,'now':()=>Date[_0x5bcd25(0x133)]()};}function X(_0x5da9f0,_0x5064ba,_0x34bde2){var _0x39bcb0=_0x33751d,_0x3d1d83,_0x4decbf,_0xca2d94,_0x366bbd,_0x4e7dfe;if(_0x5da9f0[_0x39bcb0(0xe8)]!==void 0x0)return _0x5da9f0['_consoleNinjaAllowedToStart'];let _0x2c76a1=((_0x4decbf=(_0x3d1d83=_0x5da9f0['process'])==null?void 0x0:_0x3d1d83[_0x39bcb0(0xa6)])==null?void 0x0:_0x4decbf[_0x39bcb0(0xcf)])||((_0x366bbd=(_0xca2d94=_0x5da9f0[_0x39bcb0(0x95)])==null?void 0x0:_0xca2d94[_0x39bcb0(0xd3)])==null?void 0x0:_0x366bbd[_0x39bcb0(0xda)])===_0x39bcb0(0x148);return _0x2c76a1&&_0x34bde2===_0x39bcb0(0xb5)?_0x5da9f0['_consoleNinjaAllowedToStart']=!0x1:_0x5da9f0[_0x39bcb0(0xe8)]=_0x2c76a1||!_0x5064ba||((_0x4e7dfe=_0x5da9f0[_0x39bcb0(0x10c)])==null?void 0x0:_0x4e7dfe[_0x39bcb0(0x146)])&&_0x5064ba[_0x39bcb0(0x128)](_0x5da9f0[_0x39bcb0(0x10c)][_0x39bcb0(0x146)]),_0x5da9f0[_0x39bcb0(0xe8)];}function H(_0x147917,_0x44a8af,_0x312c1a,_0x47d946){var _0x515290=_0x33751d;_0x147917=_0x147917,_0x44a8af=_0x44a8af,_0x312c1a=_0x312c1a,_0x47d946=_0x47d946;let _0x385283=b(_0x147917),_0x34f28a=_0x385283[_0x515290(0xd6)],_0x45635f=_0x385283[_0x515290(0xa9)];class _0x42c272{constructor(){var _0x2cf18c=_0x515290;this[_0x2cf18c(0xa1)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x147917['undefined'],this['_HTMLAllCollection']=_0x147917[_0x2cf18c(0xc4)],this['_getOwnPropertyDescriptor']=Object['getOwnPropertyDescriptor'],this[_0x2cf18c(0x12e)]=Object['getOwnPropertyNames'],this[_0x2cf18c(0x8f)]=_0x147917[_0x2cf18c(0x15a)],this[_0x2cf18c(0x12b)]=RegExp[_0x2cf18c(0x117)][_0x2cf18c(0x94)],this[_0x2cf18c(0xc3)]=Date[_0x2cf18c(0x117)][_0x2cf18c(0x94)];}[_0x515290(0xf5)](_0x418ad9,_0x2914a4,_0x5527e8,_0x2616da){var _0x49280e=_0x515290,_0x2033d9=this,_0x371bb1=_0x5527e8[_0x49280e(0x15e)];function _0x346a2e(_0x4e487a,_0x1a54b8,_0x4c3336){var _0x4a210a=_0x49280e;_0x1a54b8[_0x4a210a(0xe6)]=_0x4a210a(0x116),_0x1a54b8[_0x4a210a(0xc6)]=_0x4e487a[_0x4a210a(0xa4)],_0xf60310=_0x4c3336[_0x4a210a(0xcf)][_0x4a210a(0xca)],_0x4c3336['node']['current']=_0x1a54b8,_0x2033d9[_0x4a210a(0x112)](_0x1a54b8,_0x4c3336);}try{_0x5527e8[_0x49280e(0xe3)]++,_0x5527e8[_0x49280e(0x15e)]&&_0x5527e8[_0x49280e(0x129)][_0x49280e(0x123)](_0x2914a4);var _0x542ff1,_0x790118,_0x1e6337,_0x85e3c8,_0x5a53a5=[],_0x27e8fe=[],_0x113fcf,_0x1750c2=this[_0x49280e(0x92)](_0x2914a4),_0x2fdb3d=_0x1750c2===_0x49280e(0x12d),_0x5900cb=!0x1,_0x5a1921=_0x1750c2==='function',_0x2f0f91=this[_0x49280e(0xdb)](_0x1750c2),_0x224344=this['_isPrimitiveWrapperType'](_0x1750c2),_0x8ad7fe=_0x2f0f91||_0x224344,_0x1cbfb6={},_0x30ef89=0x0,_0x22fbbd=!0x1,_0xf60310,_0x4ebd54=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x5527e8['depth']){if(_0x2fdb3d){if(_0x790118=_0x2914a4[_0x49280e(0x132)],_0x790118>_0x5527e8[_0x49280e(0xc5)]){for(_0x1e6337=0x0,_0x85e3c8=_0x5527e8[_0x49280e(0xc5)],_0x542ff1=_0x1e6337;_0x542ff1<_0x85e3c8;_0x542ff1++)_0x27e8fe[_0x49280e(0x123)](_0x2033d9[_0x49280e(0x134)](_0x5a53a5,_0x2914a4,_0x1750c2,_0x542ff1,_0x5527e8));_0x418ad9[_0x49280e(0x83)]=!0x0;}else{for(_0x1e6337=0x0,_0x85e3c8=_0x790118,_0x542ff1=_0x1e6337;_0x542ff1<_0x85e3c8;_0x542ff1++)_0x27e8fe[_0x49280e(0x123)](_0x2033d9[_0x49280e(0x134)](_0x5a53a5,_0x2914a4,_0x1750c2,_0x542ff1,_0x5527e8));}_0x5527e8[_0x49280e(0xd0)]+=_0x27e8fe[_0x49280e(0x132)];}if(!(_0x1750c2===_0x49280e(0xa5)||_0x1750c2===_0x49280e(0xc0))&&!_0x2f0f91&&_0x1750c2!==_0x49280e(0xdc)&&_0x1750c2!==_0x49280e(0xf1)&&_0x1750c2!==_0x49280e(0x11e)){var _0x1a33b3=_0x2616da[_0x49280e(0x13f)]||_0x5527e8[_0x49280e(0x13f)];if(this['_isSet'](_0x2914a4)?(_0x542ff1=0x0,_0x2914a4[_0x49280e(0x109)](function(_0x1b4f17){var _0xc15325=_0x49280e;if(_0x30ef89++,_0x5527e8[_0xc15325(0xd0)]++,_0x30ef89>_0x1a33b3){_0x22fbbd=!0x0;return;}if(!_0x5527e8['isExpressionToEvaluate']&&_0x5527e8[_0xc15325(0x15e)]&&_0x5527e8[_0xc15325(0xd0)]>_0x5527e8[_0xc15325(0x114)]){_0x22fbbd=!0x0;return;}_0x27e8fe['push'](_0x2033d9[_0xc15325(0x134)](_0x5a53a5,_0x2914a4,_0xc15325(0x127),_0x542ff1++,_0x5527e8,function(_0x33c8d1){return function(){return _0x33c8d1;};}(_0x1b4f17)));})):this[_0x49280e(0xe9)](_0x2914a4)&&_0x2914a4[_0x49280e(0x109)](function(_0x460735,_0x38bc3a){var _0x4d1791=_0x49280e;if(_0x30ef89++,_0x5527e8['autoExpandPropertyCount']++,_0x30ef89>_0x1a33b3){_0x22fbbd=!0x0;return;}if(!_0x5527e8[_0x4d1791(0x8c)]&&_0x5527e8[_0x4d1791(0x15e)]&&_0x5527e8['autoExpandPropertyCount']>_0x5527e8[_0x4d1791(0x114)]){_0x22fbbd=!0x0;return;}var _0x160b68=_0x38bc3a[_0x4d1791(0x94)]();_0x160b68[_0x4d1791(0x132)]>0x64&&(_0x160b68=_0x160b68[_0x4d1791(0x98)](0x0,0x64)+_0x4d1791(0xf4)),_0x27e8fe[_0x4d1791(0x123)](_0x2033d9[_0x4d1791(0x134)](_0x5a53a5,_0x2914a4,_0x4d1791(0xbe),_0x160b68,_0x5527e8,function(_0xdfcf7a){return function(){return _0xdfcf7a;};}(_0x460735)));}),!_0x5900cb){try{for(_0x113fcf in _0x2914a4)if(!(_0x2fdb3d&&_0x4ebd54[_0x49280e(0x12f)](_0x113fcf))&&!this[_0x49280e(0x88)](_0x2914a4,_0x113fcf,_0x5527e8)){if(_0x30ef89++,_0x5527e8[_0x49280e(0xd0)]++,_0x30ef89>_0x1a33b3){_0x22fbbd=!0x0;break;}if(!_0x5527e8[_0x49280e(0x8c)]&&_0x5527e8[_0x49280e(0x15e)]&&_0x5527e8[_0x49280e(0xd0)]>_0x5527e8[_0x49280e(0x114)]){_0x22fbbd=!0x0;break;}_0x27e8fe['push'](_0x2033d9[_0x49280e(0xf9)](_0x5a53a5,_0x1cbfb6,_0x2914a4,_0x1750c2,_0x113fcf,_0x5527e8));}}catch{}if(_0x1cbfb6[_0x49280e(0x79)]=!0x0,_0x5a1921&&(_0x1cbfb6[_0x49280e(0x105)]=!0x0),!_0x22fbbd){var _0x1cd4c1=[]['concat'](this['_getOwnPropertyNames'](_0x2914a4))['concat'](this['_getOwnPropertySymbols'](_0x2914a4));for(_0x542ff1=0x0,_0x790118=_0x1cd4c1['length'];_0x542ff1<_0x790118;_0x542ff1++)if(_0x113fcf=_0x1cd4c1[_0x542ff1],!(_0x2fdb3d&&_0x4ebd54['test'](_0x113fcf[_0x49280e(0x94)]()))&&!this[_0x49280e(0x88)](_0x2914a4,_0x113fcf,_0x5527e8)&&!_0x1cbfb6[_0x49280e(0x131)+_0x113fcf['toString']()]){if(_0x30ef89++,_0x5527e8[_0x49280e(0xd0)]++,_0x30ef89>_0x1a33b3){_0x22fbbd=!0x0;break;}if(!_0x5527e8[_0x49280e(0x8c)]&&_0x5527e8[_0x49280e(0x15e)]&&_0x5527e8[_0x49280e(0xd0)]>_0x5527e8[_0x49280e(0x114)]){_0x22fbbd=!0x0;break;}_0x27e8fe[_0x49280e(0x123)](_0x2033d9['_addObjectProperty'](_0x5a53a5,_0x1cbfb6,_0x2914a4,_0x1750c2,_0x113fcf,_0x5527e8));}}}}}if(_0x418ad9[_0x49280e(0xe6)]=_0x1750c2,_0x8ad7fe?(_0x418ad9[_0x49280e(0x140)]=_0x2914a4['valueOf'](),this['_capIfString'](_0x1750c2,_0x418ad9,_0x5527e8,_0x2616da)):_0x1750c2===_0x49280e(0xe2)?_0x418ad9['value']=this[_0x49280e(0xc3)][_0x49280e(0x120)](_0x2914a4):_0x1750c2===_0x49280e(0x11e)?_0x418ad9[_0x49280e(0x140)]=_0x2914a4['toString']():_0x1750c2==='RegExp'?_0x418ad9['value']=this[_0x49280e(0x12b)][_0x49280e(0x120)](_0x2914a4):_0x1750c2===_0x49280e(0x96)&&this[_0x49280e(0x8f)]?_0x418ad9[_0x49280e(0x140)]=this['_Symbol'][_0x49280e(0x117)]['toString'][_0x49280e(0x120)](_0x2914a4):!_0x5527e8['depth']&&!(_0x1750c2===_0x49280e(0xa5)||_0x1750c2===_0x49280e(0xc0))&&(delete _0x418ad9['value'],_0x418ad9[_0x49280e(0x7c)]=!0x0),_0x22fbbd&&(_0x418ad9[_0x49280e(0x151)]=!0x0),_0xf60310=_0x5527e8[_0x49280e(0xcf)][_0x49280e(0xca)],_0x5527e8[_0x49280e(0xcf)][_0x49280e(0xca)]=_0x418ad9,this['_treeNodePropertiesBeforeFullValue'](_0x418ad9,_0x5527e8),_0x27e8fe['length']){for(_0x542ff1=0x0,_0x790118=_0x27e8fe[_0x49280e(0x132)];_0x542ff1<_0x790118;_0x542ff1++)_0x27e8fe[_0x542ff1](_0x542ff1);}_0x5a53a5[_0x49280e(0x132)]&&(_0x418ad9['props']=_0x5a53a5);}catch(_0x22ab87){_0x346a2e(_0x22ab87,_0x418ad9,_0x5527e8);}return this['_additionalMetadata'](_0x2914a4,_0x418ad9),this[_0x49280e(0x7a)](_0x418ad9,_0x5527e8),_0x5527e8[_0x49280e(0xcf)]['current']=_0xf60310,_0x5527e8[_0x49280e(0xe3)]--,_0x5527e8[_0x49280e(0x15e)]=_0x371bb1,_0x5527e8[_0x49280e(0x15e)]&&_0x5527e8[_0x49280e(0x129)][_0x49280e(0x147)](),_0x418ad9;}['_getOwnPropertySymbols'](_0x272249){var _0x48d3f2=_0x515290;return Object[_0x48d3f2(0x163)]?Object[_0x48d3f2(0x163)](_0x272249):[];}[_0x515290(0x9a)](_0x5217cb){var _0x18f215=_0x515290;return!!(_0x5217cb&&_0x147917[_0x18f215(0x127)]&&this[_0x18f215(0x14c)](_0x5217cb)===_0x18f215(0xec)&&_0x5217cb[_0x18f215(0x109)]);}['_blacklistedProperty'](_0x535ac7,_0x23773a,_0x23d8e9){var _0x1c3919=_0x515290;return _0x23d8e9['noFunctions']?typeof _0x535ac7[_0x23773a]==_0x1c3919(0x136):!0x1;}['_type'](_0x27a6ea){var _0x579764=_0x515290,_0x46b2d1='';return _0x46b2d1=typeof _0x27a6ea,_0x46b2d1==='object'?this['_objectToString'](_0x27a6ea)===_0x579764(0x13c)?_0x46b2d1=_0x579764(0x12d):this[_0x579764(0x14c)](_0x27a6ea)===_0x579764(0x130)?_0x46b2d1=_0x579764(0xe2):this[_0x579764(0x14c)](_0x27a6ea)==='[object\\x20BigInt]'?_0x46b2d1='bigint':_0x27a6ea===null?_0x46b2d1='null':_0x27a6ea[_0x579764(0x7d)]&&(_0x46b2d1=_0x27a6ea['constructor']['name']||_0x46b2d1):_0x46b2d1==='undefined'&&this['_HTMLAllCollection']&&_0x27a6ea instanceof this[_0x579764(0x10d)]&&(_0x46b2d1=_0x579764(0xc4)),_0x46b2d1;}[_0x515290(0x14c)](_0x3dedf3){var _0xa219b5=_0x515290;return Object[_0xa219b5(0x117)][_0xa219b5(0x94)]['call'](_0x3dedf3);}[_0x515290(0xdb)](_0x176eef){var _0x39b258=_0x515290;return _0x176eef===_0x39b258(0x144)||_0x176eef===_0x39b258(0xbd)||_0x176eef===_0x39b258(0x10f);}[_0x515290(0x8a)](_0x2e0cf5){var _0x2faa9c=_0x515290;return _0x2e0cf5===_0x2faa9c(0x157)||_0x2e0cf5===_0x2faa9c(0xdc)||_0x2e0cf5===_0x2faa9c(0xf7);}[_0x515290(0x134)](_0x3e343a,_0x31ac03,_0x5ec52b,_0x577254,_0x3f1b90,_0x380e85){var _0x19b754=this;return function(_0x625083){var _0xde5c64=_0x5ae6,_0x133cc7=_0x3f1b90[_0xde5c64(0xcf)][_0xde5c64(0xca)],_0x1b4287=_0x3f1b90[_0xde5c64(0xcf)][_0xde5c64(0x97)],_0x2f8ace=_0x3f1b90[_0xde5c64(0xcf)]['parent'];_0x3f1b90['node']['parent']=_0x133cc7,_0x3f1b90[_0xde5c64(0xcf)][_0xde5c64(0x97)]=typeof _0x577254==_0xde5c64(0x10f)?_0x577254:_0x625083,_0x3e343a['push'](_0x19b754[_0xde5c64(0x15d)](_0x31ac03,_0x5ec52b,_0x577254,_0x3f1b90,_0x380e85)),_0x3f1b90['node']['parent']=_0x2f8ace,_0x3f1b90[_0xde5c64(0xcf)]['index']=_0x1b4287;};}[_0x515290(0xf9)](_0x51c917,_0xdc8cbd,_0x2da3e6,_0x5cb114,_0x16d968,_0x403e58,_0x290e2e){var _0x32349f=_0x515290,_0x258eae=this;return _0xdc8cbd[_0x32349f(0x131)+_0x16d968[_0x32349f(0x94)]()]=!0x0,function(_0x2f1ad9){var _0x3090b0=_0x32349f,_0xd3b315=_0x403e58[_0x3090b0(0xcf)][_0x3090b0(0xca)],_0x4781e7=_0x403e58['node'][_0x3090b0(0x97)],_0x58c13a=_0x403e58[_0x3090b0(0xcf)][_0x3090b0(0xf8)];_0x403e58[_0x3090b0(0xcf)][_0x3090b0(0xf8)]=_0xd3b315,_0x403e58[_0x3090b0(0xcf)][_0x3090b0(0x97)]=_0x2f1ad9,_0x51c917[_0x3090b0(0x123)](_0x258eae[_0x3090b0(0x15d)](_0x2da3e6,_0x5cb114,_0x16d968,_0x403e58,_0x290e2e)),_0x403e58['node'][_0x3090b0(0xf8)]=_0x58c13a,_0x403e58['node'][_0x3090b0(0x97)]=_0x4781e7;};}[_0x515290(0x15d)](_0x4c74a4,_0x1dd14e,_0x21660d,_0xe55160,_0xef94fe){var _0x99db=_0x515290,_0x32d0cb=this;_0xef94fe||(_0xef94fe=function(_0x5b685e,_0x524c50){return _0x5b685e[_0x524c50];});var _0x230309=_0x21660d['toString'](),_0x45b991=_0xe55160['expressionsToEvaluate']||{},_0x2d80f9=_0xe55160[_0x99db(0xb8)],_0x2a9214=_0xe55160['isExpressionToEvaluate'];try{var _0x58510d=this['_isMap'](_0x4c74a4),_0x3de447=_0x230309;_0x58510d&&_0x3de447[0x0]==='\\x27'&&(_0x3de447=_0x3de447[_0x99db(0xcb)](0x1,_0x3de447[_0x99db(0x132)]-0x2));var _0x4d0249=_0xe55160[_0x99db(0x11a)]=_0x45b991[_0x99db(0x131)+_0x3de447];_0x4d0249&&(_0xe55160[_0x99db(0xb8)]=_0xe55160[_0x99db(0xb8)]+0x1),_0xe55160[_0x99db(0x8c)]=!!_0x4d0249;var _0x5166de=typeof _0x21660d==_0x99db(0x96),_0x2d4f65={'name':_0x5166de||_0x58510d?_0x230309:this['_propertyName'](_0x230309)};if(_0x5166de&&(_0x2d4f65['symbol']=!0x0),!(_0x1dd14e===_0x99db(0x12d)||_0x1dd14e==='Error')){var _0x47c41=this[_0x99db(0xa8)](_0x4c74a4,_0x21660d);if(_0x47c41&&(_0x47c41['set']&&(_0x2d4f65[_0x99db(0x89)]=!0x0),_0x47c41[_0x99db(0xe7)]&&!_0x4d0249&&!_0xe55160[_0x99db(0x80)]))return _0x2d4f65['getter']=!0x0,this[_0x99db(0xea)](_0x2d4f65,_0xe55160),_0x2d4f65;}var _0x781e62;try{_0x781e62=_0xef94fe(_0x4c74a4,_0x21660d);}catch(_0x78b474){return _0x2d4f65={'name':_0x230309,'type':_0x99db(0x116),'error':_0x78b474[_0x99db(0xa4)]},this[_0x99db(0xea)](_0x2d4f65,_0xe55160),_0x2d4f65;}var _0x432271=this[_0x99db(0x92)](_0x781e62),_0x2a878f=this[_0x99db(0xdb)](_0x432271);if(_0x2d4f65[_0x99db(0xe6)]=_0x432271,_0x2a878f)this[_0x99db(0xea)](_0x2d4f65,_0xe55160,_0x781e62,function(){_0x2d4f65['value']=_0x781e62['valueOf'](),!_0x4d0249&&_0x32d0cb['_capIfString'](_0x432271,_0x2d4f65,_0xe55160,{});});else{var _0x22853b=_0xe55160['autoExpand']&&_0xe55160[_0x99db(0xe3)]<_0xe55160[_0x99db(0x124)]&&_0xe55160[_0x99db(0x129)][_0x99db(0xe1)](_0x781e62)<0x0&&_0x432271!==_0x99db(0x136)&&_0xe55160['autoExpandPropertyCount']<_0xe55160[_0x99db(0x114)];_0x22853b||_0xe55160[_0x99db(0xe3)]<_0x2d80f9||_0x4d0249?(this[_0x99db(0xf5)](_0x2d4f65,_0x781e62,_0xe55160,_0x4d0249||{}),this[_0x99db(0xaa)](_0x781e62,_0x2d4f65)):this[_0x99db(0xea)](_0x2d4f65,_0xe55160,_0x781e62,function(){var _0x4063fb=_0x99db;_0x432271===_0x4063fb(0xa5)||_0x432271==='undefined'||(delete _0x2d4f65[_0x4063fb(0x140)],_0x2d4f65[_0x4063fb(0x7c)]=!0x0);});}return _0x2d4f65;}finally{_0xe55160['expressionsToEvaluate']=_0x45b991,_0xe55160[_0x99db(0xb8)]=_0x2d80f9,_0xe55160[_0x99db(0x8c)]=_0x2a9214;}}[_0x515290(0x122)](_0x1fcfd1,_0x240d71,_0x406f49,_0x530746){var _0x2224a6=_0x515290,_0x7aeb6c=_0x530746[_0x2224a6(0x152)]||_0x406f49[_0x2224a6(0x152)];if((_0x1fcfd1==='string'||_0x1fcfd1==='String')&&_0x240d71['value']){let _0x169253=_0x240d71['value'][_0x2224a6(0x132)];_0x406f49['allStrLength']+=_0x169253,_0x406f49[_0x2224a6(0x90)]>_0x406f49[_0x2224a6(0x13d)]?(_0x240d71['capped']='',delete _0x240d71[_0x2224a6(0x140)]):_0x169253>_0x7aeb6c&&(_0x240d71[_0x2224a6(0x7c)]=_0x240d71[_0x2224a6(0x140)][_0x2224a6(0xcb)](0x0,_0x7aeb6c),delete _0x240d71[_0x2224a6(0x140)]);}}[_0x515290(0xe9)](_0x1a765a){var _0x514102=_0x515290;return!!(_0x1a765a&&_0x147917['Map']&&this['_objectToString'](_0x1a765a)===_0x514102(0xa2)&&_0x1a765a[_0x514102(0x109)]);}['_propertyName'](_0x279ef4){var _0x553f98=_0x515290;if(_0x279ef4[_0x553f98(0x9c)](/^\\d+$/))return _0x279ef4;var _0x30360b;try{_0x30360b=JSON[_0x553f98(0xe0)](''+_0x279ef4);}catch{_0x30360b='\\x22'+this[_0x553f98(0x14c)](_0x279ef4)+'\\x22';}return _0x30360b[_0x553f98(0x9c)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x30360b=_0x30360b[_0x553f98(0xcb)](0x1,_0x30360b[_0x553f98(0x132)]-0x2):_0x30360b=_0x30360b[_0x553f98(0x162)](/'/g,'\\x5c\\x27')[_0x553f98(0x162)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x30360b;}[_0x515290(0xea)](_0x4e4a05,_0x4a2256,_0x3c9cc4,_0x109d6d){var _0x4b9a23=_0x515290;this[_0x4b9a23(0x112)](_0x4e4a05,_0x4a2256),_0x109d6d&&_0x109d6d(),this[_0x4b9a23(0xaa)](_0x3c9cc4,_0x4e4a05),this[_0x4b9a23(0x7a)](_0x4e4a05,_0x4a2256);}[_0x515290(0x112)](_0x56d64a,_0x1faec6){var _0x1ceec2=_0x515290;this[_0x1ceec2(0xb3)](_0x56d64a,_0x1faec6),this[_0x1ceec2(0xfa)](_0x56d64a,_0x1faec6),this['_setNodeExpressionPath'](_0x56d64a,_0x1faec6),this[_0x1ceec2(0xf3)](_0x56d64a,_0x1faec6);}[_0x515290(0xb3)](_0x2be4f8,_0x458602){}[_0x515290(0xfa)](_0x43381f,_0xf6f985){}[_0x515290(0x118)](_0x49e48b,_0x51cc48){}[_0x515290(0x125)](_0x29a077){var _0x2765ad=_0x515290;return _0x29a077===this[_0x2765ad(0xcd)];}[_0x515290(0x7a)](_0x36ac5e,_0x19267a){var _0x58faf1=_0x515290;this[_0x58faf1(0x118)](_0x36ac5e,_0x19267a),this[_0x58faf1(0x11b)](_0x36ac5e),_0x19267a['sortProps']&&this['_sortProps'](_0x36ac5e),this[_0x58faf1(0x82)](_0x36ac5e,_0x19267a),this[_0x58faf1(0xba)](_0x36ac5e,_0x19267a),this['_cleanNode'](_0x36ac5e);}['_additionalMetadata'](_0x368138,_0x52343d){var _0x8dfb6e=_0x515290;let _0x3cd82a;try{_0x147917[_0x8dfb6e(0xdd)]&&(_0x3cd82a=_0x147917[_0x8dfb6e(0xdd)][_0x8dfb6e(0xc6)],_0x147917[_0x8dfb6e(0xdd)][_0x8dfb6e(0xc6)]=function(){}),_0x368138&&typeof _0x368138['length']=='number'&&(_0x52343d['length']=_0x368138[_0x8dfb6e(0x132)]);}catch{}finally{_0x3cd82a&&(_0x147917['console'][_0x8dfb6e(0xc6)]=_0x3cd82a);}if(_0x52343d[_0x8dfb6e(0xe6)]===_0x8dfb6e(0x10f)||_0x52343d[_0x8dfb6e(0xe6)]==='Number'){if(isNaN(_0x52343d[_0x8dfb6e(0x140)]))_0x52343d['nan']=!0x0,delete _0x52343d[_0x8dfb6e(0x140)];else switch(_0x52343d[_0x8dfb6e(0x140)]){case Number['POSITIVE_INFINITY']:_0x52343d[_0x8dfb6e(0xb1)]=!0x0,delete _0x52343d[_0x8dfb6e(0x140)];break;case Number[_0x8dfb6e(0xce)]:_0x52343d['negativeInfinity']=!0x0,delete _0x52343d[_0x8dfb6e(0x140)];break;case 0x0:this['_isNegativeZero'](_0x52343d[_0x8dfb6e(0x140)])&&(_0x52343d[_0x8dfb6e(0x143)]=!0x0);break;}}else _0x52343d['type']===_0x8dfb6e(0x136)&&typeof _0x368138['name']=='string'&&_0x368138['name']&&_0x52343d['name']&&_0x368138[_0x8dfb6e(0x135)]!==_0x52343d[_0x8dfb6e(0x135)]&&(_0x52343d['funcName']=_0x368138[_0x8dfb6e(0x135)]);}[_0x515290(0xc7)](_0x20e398){var _0x1c402c=_0x515290;return 0x1/_0x20e398===Number[_0x1c402c(0xce)];}[_0x515290(0x150)](_0x36203f){var _0x5531c6=_0x515290;!_0x36203f[_0x5531c6(0x13f)]||!_0x36203f[_0x5531c6(0x13f)]['length']||_0x36203f[_0x5531c6(0xe6)]==='array'||_0x36203f[_0x5531c6(0xe6)]===_0x5531c6(0xbe)||_0x36203f['type']==='Set'||_0x36203f[_0x5531c6(0x13f)]['sort'](function(_0x4d4ca9,_0x2f219c){var _0x223978=_0x5531c6,_0x8819fe=_0x4d4ca9[_0x223978(0x135)][_0x223978(0x10a)](),_0x1913bb=_0x2f219c[_0x223978(0x135)][_0x223978(0x10a)]();return _0x8819fe<_0x1913bb?-0x1:_0x8819fe>_0x1913bb?0x1:0x0;});}[_0x515290(0x82)](_0x2909c7,_0x1934d3){var _0x235014=_0x515290;if(!(_0x1934d3[_0x235014(0x115)]||!_0x2909c7[_0x235014(0x13f)]||!_0x2909c7['props']['length'])){for(var _0x392bcb=[],_0x5627c4=[],_0x1d353f=0x0,_0x4b2c74=_0x2909c7['props'][_0x235014(0x132)];_0x1d353f<_0x4b2c74;_0x1d353f++){var _0x281b39=_0x2909c7[_0x235014(0x13f)][_0x1d353f];_0x281b39[_0x235014(0xe6)]==='function'?_0x392bcb[_0x235014(0x123)](_0x281b39):_0x5627c4['push'](_0x281b39);}if(!(!_0x5627c4[_0x235014(0x132)]||_0x392bcb['length']<=0x1)){_0x2909c7['props']=_0x5627c4;var _0x256b5c={'functionsNode':!0x0,'props':_0x392bcb};this[_0x235014(0xb3)](_0x256b5c,_0x1934d3),this['_setNodeLabel'](_0x256b5c,_0x1934d3),this['_setNodeExpandableState'](_0x256b5c),this['_setNodePermissions'](_0x256b5c,_0x1934d3),_0x256b5c['id']+='\\x20f',_0x2909c7['props']['unshift'](_0x256b5c);}}}['_addLoadNode'](_0x295cd4,_0x389a81){}[_0x515290(0x11b)](_0x3e7b7d){}[_0x515290(0xa7)](_0x382e53){var _0x110587=_0x515290;return Array[_0x110587(0xde)](_0x382e53)||typeof _0x382e53==_0x110587(0x160)&&this[_0x110587(0x14c)](_0x382e53)===_0x110587(0x13c);}[_0x515290(0xf3)](_0x58b3ab,_0x5a8e17){}['_cleanNode'](_0x25ace0){var _0x51b934=_0x515290;delete _0x25ace0[_0x51b934(0xfc)],delete _0x25ace0[_0x51b934(0x142)],delete _0x25ace0['_hasMapOnItsPath'];}['_setNodeExpressionPath'](_0x2fef7e,_0xe54948){}}let _0x35a9de=new _0x42c272(),_0x330d73={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x2be8e5={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x2ebdd6(_0x493fe0,_0x4fa987,_0x2b0fe4,_0x5ec792,_0x459c24,_0x39303e){var _0x3d1486=_0x515290;let _0x36e1db,_0x5e6fe8;try{_0x5e6fe8=_0x45635f(),_0x36e1db=_0x312c1a[_0x4fa987],!_0x36e1db||_0x5e6fe8-_0x36e1db['ts']>0x1f4&&_0x36e1db[_0x3d1486(0x8e)]&&_0x36e1db['time']/_0x36e1db['count']<0x64?(_0x312c1a[_0x4fa987]=_0x36e1db={'count':0x0,'time':0x0,'ts':_0x5e6fe8},_0x312c1a['hits']={}):_0x5e6fe8-_0x312c1a[_0x3d1486(0xb4)]['ts']>0x32&&_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x8e)]&&_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x12c)]/_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x8e)]<0x64&&(_0x312c1a[_0x3d1486(0xb4)]={});let _0x290eab=[],_0x2ad36d=_0x36e1db[_0x3d1486(0x110)]||_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x110)]?_0x2be8e5:_0x330d73,_0x5b619f=_0x1a5f4d=>{var _0x37329b=_0x3d1486;let _0x164119={};return _0x164119['props']=_0x1a5f4d[_0x37329b(0x13f)],_0x164119[_0x37329b(0xc5)]=_0x1a5f4d[_0x37329b(0xc5)],_0x164119['strLength']=_0x1a5f4d[_0x37329b(0x152)],_0x164119[_0x37329b(0x13d)]=_0x1a5f4d[_0x37329b(0x13d)],_0x164119[_0x37329b(0x114)]=_0x1a5f4d['autoExpandLimit'],_0x164119[_0x37329b(0x124)]=_0x1a5f4d[_0x37329b(0x124)],_0x164119[_0x37329b(0x9d)]=!0x1,_0x164119['noFunctions']=!_0x44a8af,_0x164119[_0x37329b(0xb8)]=0x1,_0x164119[_0x37329b(0xe3)]=0x0,_0x164119[_0x37329b(0xd4)]='root_exp_id',_0x164119[_0x37329b(0x121)]=_0x37329b(0xef),_0x164119[_0x37329b(0x15e)]=!0x0,_0x164119[_0x37329b(0x129)]=[],_0x164119[_0x37329b(0xd0)]=0x0,_0x164119['resolveGetters']=!0x0,_0x164119['allStrLength']=0x0,_0x164119['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x164119;};for(var _0x3b5f7d=0x0;_0x3b5f7d<_0x459c24[_0x3d1486(0x132)];_0x3b5f7d++)_0x290eab['push'](_0x35a9de[_0x3d1486(0xf5)]({'timeNode':_0x493fe0===_0x3d1486(0x12c)||void 0x0},_0x459c24[_0x3b5f7d],_0x5b619f(_0x2ad36d),{}));if(_0x493fe0==='trace'){let _0x195658=Error[_0x3d1486(0x99)];try{Error[_0x3d1486(0x99)]=0x1/0x0,_0x290eab[_0x3d1486(0x123)](_0x35a9de[_0x3d1486(0xf5)]({'stackNode':!0x0},new Error()[_0x3d1486(0x14e)],_0x5b619f(_0x2ad36d),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x195658;}}return{'method':_0x3d1486(0xb2),'version':_0x47d946,'args':[{'ts':_0x2b0fe4,'session':_0x5ec792,'args':_0x290eab,'id':_0x4fa987,'context':_0x39303e}]};}catch(_0x1752b7){return{'method':'log','version':_0x47d946,'args':[{'ts':_0x2b0fe4,'session':_0x5ec792,'args':[{'type':_0x3d1486(0x116),'error':_0x1752b7&&_0x1752b7[_0x3d1486(0xa4)]}],'id':_0x4fa987,'context':_0x39303e}]};}finally{try{if(_0x36e1db&&_0x5e6fe8){let _0x29d45d=_0x45635f();_0x36e1db[_0x3d1486(0x8e)]++,_0x36e1db['time']+=_0x34f28a(_0x5e6fe8,_0x29d45d),_0x36e1db['ts']=_0x29d45d,_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x8e)]++,_0x312c1a['hits'][_0x3d1486(0x12c)]+=_0x34f28a(_0x5e6fe8,_0x29d45d),_0x312c1a[_0x3d1486(0xb4)]['ts']=_0x29d45d,(_0x36e1db[_0x3d1486(0x8e)]>0x32||_0x36e1db[_0x3d1486(0x12c)]>0x64)&&(_0x36e1db[_0x3d1486(0x110)]=!0x0),(_0x312c1a['hits'][_0x3d1486(0x8e)]>0x3e8||_0x312c1a[_0x3d1486(0xb4)][_0x3d1486(0x12c)]>0x12c)&&(_0x312c1a[_0x3d1486(0xb4)]['reduceLimits']=!0x0);}}catch{}}}return _0x2ebdd6;}((_0x405643,_0xc56d5c,_0x1d3bf3,_0x515388,_0x2a06dc,_0x5e120d,_0x4eef48,_0x2ed395,_0x3cead1,_0x40f4db,_0x416151)=>{var _0x49cd45=_0x33751d;if(_0x405643[_0x49cd45(0x7e)])return _0x405643[_0x49cd45(0x7e)];if(!X(_0x405643,_0x2ed395,_0x2a06dc))return _0x405643[_0x49cd45(0x7e)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x405643[_0x49cd45(0x7e)];let _0x4421ad=b(_0x405643),_0x42696b=_0x4421ad['elapsed'],_0x2e995c=_0x4421ad['timeStamp'],_0x59f487=_0x4421ad['now'],_0x1e40df={'hits':{},'ts':{}},_0xe19f5c=H(_0x405643,_0x3cead1,_0x1e40df,_0x5e120d),_0x508599=_0xcb2a38=>{_0x1e40df['ts'][_0xcb2a38]=_0x2e995c();},_0x5b9cb5=(_0x15db7e,_0x269b70)=>{let _0x2bf66f=_0x1e40df['ts'][_0x269b70];if(delete _0x1e40df['ts'][_0x269b70],_0x2bf66f){let _0x1051e8=_0x42696b(_0x2bf66f,_0x2e995c());_0x25c8f0(_0xe19f5c('time',_0x15db7e,_0x59f487(),_0x813611,[_0x1051e8],_0x269b70));}},_0xd6d65a=_0x23f663=>{var _0xa2c722=_0x49cd45,_0x4c21a4;return _0x2a06dc===_0xa2c722(0x81)&&_0x405643[_0xa2c722(0xb6)]&&((_0x4c21a4=_0x23f663==null?void 0x0:_0x23f663[_0xa2c722(0x149)])==null?void 0x0:_0x4c21a4[_0xa2c722(0x132)])&&(_0x23f663['args'][0x0][_0xa2c722(0xb6)]=_0x405643[_0xa2c722(0xb6)]),_0x23f663;};_0x405643[_0x49cd45(0x7e)]={'consoleLog':(_0x36e667,_0x24b326)=>{var _0x239e42=_0x49cd45;_0x405643['console'][_0x239e42(0xb2)][_0x239e42(0x135)]!==_0x239e42(0xbf)&&_0x25c8f0(_0xe19f5c(_0x239e42(0xb2),_0x36e667,_0x59f487(),_0x813611,_0x24b326));},'consoleTrace':(_0x4b54ce,_0x508460)=>{var _0x5b01c3=_0x49cd45;_0x405643[_0x5b01c3(0xdd)][_0x5b01c3(0xb2)]['name']!==_0x5b01c3(0xac)&&_0x25c8f0(_0xd6d65a(_0xe19f5c(_0x5b01c3(0x14d),_0x4b54ce,_0x59f487(),_0x813611,_0x508460)));},'consoleTime':_0x1ee006=>{_0x508599(_0x1ee006);},'consoleTimeEnd':(_0x1a5381,_0xfd0104)=>{_0x5b9cb5(_0xfd0104,_0x1a5381);},'autoLog':(_0x3107d9,_0xfb2d79)=>{var _0x29d869=_0x49cd45;_0x25c8f0(_0xe19f5c(_0x29d869(0xb2),_0xfb2d79,_0x59f487(),_0x813611,[_0x3107d9]));},'autoLogMany':(_0x3b1378,_0x2a8043)=>{var _0x4aabc7=_0x49cd45;_0x25c8f0(_0xe19f5c(_0x4aabc7(0xb2),_0x3b1378,_0x59f487(),_0x813611,_0x2a8043));},'autoTrace':(_0x128d6a,_0x5ae067)=>{var _0x36f7cf=_0x49cd45;_0x25c8f0(_0xd6d65a(_0xe19f5c(_0x36f7cf(0x14d),_0x5ae067,_0x59f487(),_0x813611,[_0x128d6a])));},'autoTraceMany':(_0xb06e21,_0x57434f)=>{var _0x393941=_0x49cd45;_0x25c8f0(_0xd6d65a(_0xe19f5c(_0x393941(0x14d),_0xb06e21,_0x59f487(),_0x813611,_0x57434f)));},'autoTime':(_0x557530,_0x35115b,_0x53e345)=>{_0x508599(_0x53e345);},'autoTimeEnd':(_0x4f84b0,_0x1b2498,_0x2b1426)=>{_0x5b9cb5(_0x1b2498,_0x2b1426);},'coverage':_0x36aec7=>{var _0x4f94c5=_0x49cd45;_0x25c8f0({'method':_0x4f94c5(0xad),'version':_0x5e120d,'args':[{'id':_0x36aec7}]});}};let _0x25c8f0=q(_0x405643,_0xc56d5c,_0x1d3bf3,_0x515388,_0x2a06dc,_0x40f4db,_0x416151),_0x813611=_0x405643[_0x49cd45(0x154)];return _0x405643[_0x49cd45(0x7e)];})(globalThis,_0x33751d(0x11d),_0x33751d(0x86),_0x33751d(0xc9),_0x33751d(0xe4),_0x33751d(0x10e),_0x33751d(0xfd),_0x33751d(0x106),_0x33751d(0xfe),_0x33751d(0xd8),_0x33751d(0x84));"
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
