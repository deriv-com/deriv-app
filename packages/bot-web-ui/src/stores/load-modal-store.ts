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
                "/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x233c0b=_0x5229;(function(_0x5c7b97,_0x3b433c){var _0x373b7a=_0x5229,_0x342a2e=_0x5c7b97();while(!![]){try{var _0x2206ae=-parseInt(_0x373b7a(0x193))/0x1+-parseInt(_0x373b7a(0x10a))/0x2+-parseInt(_0x373b7a(0x168))/0x3*(parseInt(_0x373b7a(0x100))/0x4)+-parseInt(_0x373b7a(0x142))/0x5+-parseInt(_0x373b7a(0x128))/0x6*(-parseInt(_0x373b7a(0x1d5))/0x7)+parseInt(_0x373b7a(0x12d))/0x8*(-parseInt(_0x373b7a(0xf7))/0x9)+-parseInt(_0x373b7a(0x1b5))/0xa*(-parseInt(_0x373b7a(0x19b))/0xb);if(_0x2206ae===_0x3b433c)break;else _0x342a2e['push'](_0x342a2e['shift']());}catch(_0x1a1839){_0x342a2e['push'](_0x342a2e['shift']());}}}(_0x5caa,0xf3943));function _0x5229(_0x58ece8,_0x3df43b){var _0x5caab5=_0x5caa();return _0x5229=function(_0x522968,_0xf55b7e){_0x522968=_0x522968-0xe5;var _0x5dce5a=_0x5caab5[_0x522968];return _0x5dce5a;},_0x5229(_0x58ece8,_0x3df43b);}var j=Object[_0x233c0b(0x13b)],H=Object[_0x233c0b(0xeb)],G=Object[_0x233c0b(0x194)],ee=Object['getOwnPropertyNames'],te=Object[_0x233c0b(0x13a)],ne=Object['prototype']['hasOwnProperty'],re=(_0x25ecd1,_0x134e51,_0x4e4561,_0x3d6fb5)=>{var _0x2712a5=_0x233c0b;if(_0x134e51&&typeof _0x134e51=='object'||typeof _0x134e51=='function'){for(let _0x1c1d2a of ee(_0x134e51))!ne[_0x2712a5(0x1a0)](_0x25ecd1,_0x1c1d2a)&&_0x1c1d2a!==_0x4e4561&&H(_0x25ecd1,_0x1c1d2a,{'get':()=>_0x134e51[_0x1c1d2a],'enumerable':!(_0x3d6fb5=G(_0x134e51,_0x1c1d2a))||_0x3d6fb5[_0x2712a5(0x12c)]});}return _0x25ecd1;},x=(_0x415e2c,_0x2e4200,_0x55f2e1)=>(_0x55f2e1=_0x415e2c!=null?j(te(_0x415e2c)):{},re(_0x2e4200||!_0x415e2c||!_0x415e2c[_0x233c0b(0x1bb)]?H(_0x55f2e1,'default',{'value':_0x415e2c,'enumerable':!0x0}):_0x55f2e1,_0x415e2c)),X=class{constructor(_0x32116b,_0x10e4ff,_0x8e3ddd,_0x3b4759,_0xe2ba93){var _0x515fa6=_0x233c0b;this[_0x515fa6(0x133)]=_0x32116b,this['host']=_0x10e4ff,this['port']=_0x8e3ddd,this[_0x515fa6(0x14b)]=_0x3b4759,this['dockerizedApp']=_0xe2ba93,this[_0x515fa6(0x136)]=!0x0,this[_0x515fa6(0x1d0)]=!0x0,this[_0x515fa6(0xee)]=!0x1,this[_0x515fa6(0x164)]=!0x1,this[_0x515fa6(0x102)]=_0x32116b[_0x515fa6(0xf3)]?.[_0x515fa6(0x18a)]?.['NEXT_RUNTIME']===_0x515fa6(0xe8),this[_0x515fa6(0x143)]=!this[_0x515fa6(0x133)][_0x515fa6(0xf3)]?.[_0x515fa6(0x157)]?.[_0x515fa6(0x145)]&&!this[_0x515fa6(0x102)],this[_0x515fa6(0x173)]=null,this[_0x515fa6(0x1d1)]=0x0,this[_0x515fa6(0x140)]=0x14,this[_0x515fa6(0x12b)]='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this[_0x515fa6(0x143)]?_0x515fa6(0x132):_0x515fa6(0x169))+this[_0x515fa6(0x12b)];}async['getWebSocketClass'](){var _0x498b84=_0x233c0b;if(this[_0x498b84(0x173)])return this['_WebSocketClass'];let _0x35697e;if(this[_0x498b84(0x143)]||this[_0x498b84(0x102)])_0x35697e=this[_0x498b84(0x133)][_0x498b84(0x19d)];else{if(this[_0x498b84(0x133)][_0x498b84(0xf3)]?.[_0x498b84(0x15a)])_0x35697e=this[_0x498b84(0x133)]['process']?.[_0x498b84(0x15a)];else try{let _0xc87db9=await import(_0x498b84(0x147));_0x35697e=(await import((await import('url'))[_0x498b84(0x120)](_0xc87db9[_0x498b84(0x1b4)](this[_0x498b84(0x14b)],_0x498b84(0xea)))[_0x498b84(0x18f)]()))[_0x498b84(0xfd)];}catch{try{_0x35697e=require(require(_0x498b84(0x147))[_0x498b84(0x1b4)](this['nodeModules'],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this[_0x498b84(0x173)]=_0x35697e,_0x35697e;}[_0x233c0b(0x11f)](){var _0x16202c=_0x233c0b;this[_0x16202c(0x164)]||this[_0x16202c(0xee)]||this['_connectAttemptCount']>=this[_0x16202c(0x140)]||(this[_0x16202c(0x1d0)]=!0x1,this[_0x16202c(0x164)]=!0x0,this[_0x16202c(0x1d1)]++,this[_0x16202c(0x1c8)]=new Promise((_0xb1e42b,_0x4a0a23)=>{var _0x161fa7=_0x16202c;this[_0x161fa7(0x178)]()[_0x161fa7(0x13c)](_0x5070b9=>{var _0x46c352=_0x161fa7;let _0x38146e=new _0x5070b9('ws://'+(!this[_0x46c352(0x143)]&&this[_0x46c352(0x137)]?_0x46c352(0x163):this[_0x46c352(0x17f)])+':'+this['port']);_0x38146e[_0x46c352(0xf1)]=()=>{var _0x249f3c=_0x46c352;this['_allowedToSend']=!0x1,this[_0x249f3c(0x171)](_0x38146e),this[_0x249f3c(0x112)](),_0x4a0a23(new Error(_0x249f3c(0x1a6)));},_0x38146e[_0x46c352(0x1c9)]=()=>{var _0x48356e=_0x46c352;this[_0x48356e(0x143)]||_0x38146e[_0x48356e(0x11b)]&&_0x38146e[_0x48356e(0x11b)][_0x48356e(0x19f)]&&_0x38146e[_0x48356e(0x11b)]['unref'](),_0xb1e42b(_0x38146e);},_0x38146e['onclose']=()=>{var _0x56b84f=_0x46c352;this[_0x56b84f(0x1d0)]=!0x0,this['_disposeWebsocket'](_0x38146e),this[_0x56b84f(0x112)]();},_0x38146e[_0x46c352(0x121)]=_0x71179c=>{var _0x3163fb=_0x46c352;try{_0x71179c&&_0x71179c['data']&&this[_0x3163fb(0x143)]&&JSON[_0x3163fb(0x1b6)](_0x71179c[_0x3163fb(0xe5)])[_0x3163fb(0x12f)]===_0x3163fb(0x1c0)&&this[_0x3163fb(0x133)][_0x3163fb(0x1ae)][_0x3163fb(0x1c0)]();}catch{}};})['then'](_0x10e4c8=>(this['_connected']=!0x0,this['_connecting']=!0x1,this['_allowedToConnectOnSend']=!0x1,this[_0x161fa7(0x136)]=!0x0,this['_connectAttemptCount']=0x0,_0x10e4c8))[_0x161fa7(0x17e)](_0x29b529=>(this[_0x161fa7(0xee)]=!0x1,this[_0x161fa7(0x164)]=!0x1,console[_0x161fa7(0x18c)](_0x161fa7(0xfe)+this[_0x161fa7(0x12b)]),_0x4a0a23(new Error(_0x161fa7(0x17b)+(_0x29b529&&_0x29b529[_0x161fa7(0x1b3)])))));}));}[_0x233c0b(0x171)](_0x1e7f9a){var _0x491e3f=_0x233c0b;this[_0x491e3f(0xee)]=!0x1,this[_0x491e3f(0x164)]=!0x1;try{_0x1e7f9a[_0x491e3f(0x176)]=null,_0x1e7f9a[_0x491e3f(0xf1)]=null,_0x1e7f9a[_0x491e3f(0x1c9)]=null;}catch{}try{_0x1e7f9a['readyState']<0x2&&_0x1e7f9a[_0x491e3f(0x104)]();}catch{}}[_0x233c0b(0x112)](){var _0x1573d5=_0x233c0b;clearTimeout(this[_0x1573d5(0x149)]),!(this[_0x1573d5(0x1d1)]>=this[_0x1573d5(0x140)])&&(this[_0x1573d5(0x149)]=setTimeout(()=>{var _0x3bbee2=_0x1573d5;this[_0x3bbee2(0xee)]||this[_0x3bbee2(0x164)]||(this[_0x3bbee2(0x11f)](),this[_0x3bbee2(0x1c8)]?.[_0x3bbee2(0x17e)](()=>this[_0x3bbee2(0x112)]()));},0x1f4),this['_reconnectTimeout'][_0x1573d5(0x19f)]&&this[_0x1573d5(0x149)]['unref']());}async[_0x233c0b(0xe9)](_0xd56093){var _0x178f02=_0x233c0b;try{if(!this[_0x178f02(0x136)])return;this[_0x178f02(0x1d0)]&&this[_0x178f02(0x11f)](),(await this[_0x178f02(0x1c8)])['send'](JSON[_0x178f02(0x184)](_0xd56093));}catch(_0x438cc1){console['warn'](this[_0x178f02(0x180)]+':\\x20'+(_0x438cc1&&_0x438cc1[_0x178f02(0x1b3)])),this[_0x178f02(0x136)]=!0x1,this['_attemptToReconnectShortly']();}}};function b(_0x4617b3,_0x226476,_0x11c70c,_0x2caf4b,_0x1872c7,_0x46a428){var _0x469a2a=_0x233c0b;let _0x51258a=_0x11c70c[_0x469a2a(0x10d)](',')[_0x469a2a(0xf4)](_0x1d2f87=>{var _0x327f53=_0x469a2a;try{_0x4617b3['_console_ninja_session']||((_0x1872c7===_0x327f53(0x153)||_0x1872c7===_0x327f53(0x127)||_0x1872c7===_0x327f53(0x16d)||_0x1872c7==='angular')&&(_0x1872c7+=!_0x4617b3['process']?.[_0x327f53(0x157)]?.[_0x327f53(0x145)]&&_0x4617b3[_0x327f53(0xf3)]?.[_0x327f53(0x18a)]?.[_0x327f53(0x1c4)]!==_0x327f53(0xe8)?_0x327f53(0x11d):_0x327f53(0x14d)),_0x4617b3['_console_ninja_session']={'id':+new Date(),'tool':_0x1872c7});let _0x4525fb=new X(_0x4617b3,_0x226476,_0x1d2f87,_0x2caf4b,_0x46a428);return _0x4525fb[_0x327f53(0xe9)]['bind'](_0x4525fb);}catch(_0x34e7f6){return console[_0x327f53(0x18c)](_0x327f53(0xec),_0x34e7f6&&_0x34e7f6['message']),()=>{};}});return _0x1893e2=>_0x51258a[_0x469a2a(0x16c)](_0xc29c57=>_0xc29c57(_0x1893e2));}function W(_0xaac0fc){var _0x471f6c=_0x233c0b;let _0x2ff97d=function(_0x4b9e41,_0xcaeac0){return _0xcaeac0-_0x4b9e41;},_0x14012e;if(_0xaac0fc[_0x471f6c(0x1b2)])_0x14012e=function(){var _0x30c84c=_0x471f6c;return _0xaac0fc[_0x30c84c(0x1b2)]['now']();};else{if(_0xaac0fc['process']&&_0xaac0fc[_0x471f6c(0xf3)][_0x471f6c(0x1a4)]&&_0xaac0fc[_0x471f6c(0xf3)]?.[_0x471f6c(0x18a)]?.[_0x471f6c(0x1c4)]!==_0x471f6c(0xe8))_0x14012e=function(){var _0x4a9a80=_0x471f6c;return _0xaac0fc[_0x4a9a80(0xf3)][_0x4a9a80(0x1a4)]();},_0x2ff97d=function(_0x3deef4,_0x35f0ce){return 0x3e8*(_0x35f0ce[0x0]-_0x3deef4[0x0])+(_0x35f0ce[0x1]-_0x3deef4[0x1])/0xf4240;};else try{let {performance:_0xeba562}=require(_0x471f6c(0x1b0));_0x14012e=function(){var _0x3a70e4=_0x471f6c;return _0xeba562[_0x3a70e4(0x124)]();};}catch{_0x14012e=function(){return+new Date();};}}return{'elapsed':_0x2ff97d,'timeStamp':_0x14012e,'now':()=>Date['now']()};}function J(_0x3731a1,_0x27da18,_0x373620){var _0x117754=_0x233c0b;if(_0x3731a1[_0x117754(0x130)]!==void 0x0)return _0x3731a1[_0x117754(0x130)];let _0x31bcd5=_0x3731a1[_0x117754(0xf3)]?.[_0x117754(0x157)]?.[_0x117754(0x145)]||_0x3731a1[_0x117754(0xf3)]?.[_0x117754(0x18a)]?.[_0x117754(0x1c4)]===_0x117754(0xe8);return _0x31bcd5&&_0x373620===_0x117754(0x10f)?_0x3731a1[_0x117754(0x130)]=!0x1:_0x3731a1[_0x117754(0x130)]=_0x31bcd5||!_0x27da18||_0x3731a1[_0x117754(0x1ae)]?.[_0x117754(0x195)]&&_0x27da18['includes'](_0x3731a1['location'][_0x117754(0x195)]),_0x3731a1[_0x117754(0x130)];}function _0x5caa(){var _0x298e70=['_reconnectTimeout','autoExpandPropertyCount','nodeModules','value','\\x20server','_addLoadNode','parent','getter','Error','expressionsToEvaluate','next.js','_propertyName','_p_name','time','versions','cappedProps','_addFunctionsNode','_WebSocket','substr','[object\\x20Set]','hits','number','1.0.0','match','bigint','_undefined','gateway.docker.internal','_connecting','resolveGetters','[object\\x20Map]','Buffer','1524HEFxWO','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','_isMap','_addObjectProperty','forEach','astro','_isPrimitiveWrapperType',\"/Users/newhire/.vscode/extensions/wallabyjs.console-ninja-1.0.295/node_modules\",'trace','_disposeWebsocket','_p_','_WebSocketClass','_isUndefined','prototype','onclose','_addProperty','getWebSocketClass','autoExpandMaxDepth','elapsed','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','_keyStrRegExp','_setNodeQueryPath','catch','host','_sendErrorMessage','_isArray','setter','set','stringify','isExpressionToEvaluate','depth','null','root_exp_id','_dateToString','env','toLowerCase','warn','stackTraceLimit','HTMLAllCollection','toString','indexOf','_type','_HTMLAllCollection','539817qTYRlo','getOwnPropertyDescriptor','hostname','timeStamp','_getOwnPropertyDescriptor','_additionalMetadata','constructor','_capIfString','1092410Bwgesg','console','WebSocket','reduceLimits','unref','call','disabledTrace','coverage','length','hrtime','unshift','logger\\x20websocket\\x20error','_isPrimitiveType','rootExpression','error','level','push','_setNodeExpressionPath','Number','location','_console_ninja_session','perf_hooks','_blacklistedProperty','performance','message','join','290kxWaGq','parse','_getOwnPropertySymbols','[object\\x20BigInt]','_setNodeLabel','POSITIVE_INFINITY','__es'+'Module','String','function','_Symbol','RegExp','reload','autoExpandLimit','symbol','strLength','NEXT_RUNTIME','unknown','autoExpand','_sortProps','_ws','onopen','_quotedRegExp','undefined','autoExpandPreviousObjects','NEGATIVE_INFINITY','disabledLog','valueOf','_allowedToConnectOnSend','_connectAttemptCount','elements','getOwnPropertySymbols','props','7EAqsuj','_isSet','data','serialize','noFunctions','edge','send','ws/index.js','defineProperty','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','negativeInfinity','_connected','','log','onerror','_treeNodePropertiesBeforeFullValue','process','map','boolean','_treeNodePropertiesAfterFullValue','1424637iyXjUa','_console_ninja','_property','_hasSymbolPropertyOnItsPath','expId','array','default','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','string','1500QxVEIX','49387','_inNextEdge','timeEnd','close','_cleanNode','127.0.0.1','_getOwnPropertyNames','allStrLength','positiveInfinity','2481346qvMkYl','replace','type','split','get','nuxt','Set','funcName','_attemptToReconnectShortly','current',':logPointId:','_hasSetOnItsPath','_setNodePermissions','index','date','pop','test','_socket','totalStrLength','\\x20browser','Map','_connectToHostNow','pathToFileURL','onmessage','root_exp','name','now','_setNodeExpandableState','_hasMapOnItsPath','remix','11811882tzGccr','capped','[object\\x20Array]','_webSocketErrorDocsLink','enumerable','56TLYvzT','count','method','_consoleNinjaAllowedToStart','concat','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','global','sortProps',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Vinu-Variyatils-MacBook-Pro-C02G8ASUMD6M-Standard.local\",\"192.168.44.103\"],'_allowedToSend','dockerizedApp','object','_processTreeNodeResult','getPrototypeOf','create','then','_regExpToString','1712229759073','getOwnPropertyNames','_maxConnectAttemptCount','_isNegativeZero','3859485CBCRbO','_inBrowser','_setNodeId','node','_objectToString','path','...'];_0x5caa=function(){return _0x298e70;};return _0x5caa();}function Y(_0xa4e496,_0x3509a0,_0x3db20d,_0x1b1448){var _0x1ae233=_0x233c0b;_0xa4e496=_0xa4e496,_0x3509a0=_0x3509a0,_0x3db20d=_0x3db20d,_0x1b1448=_0x1b1448;let _0x26f8e4=W(_0xa4e496),_0x72b8a4=_0x26f8e4[_0x1ae233(0x17a)],_0x485233=_0x26f8e4[_0x1ae233(0x196)];class _0x16a434{constructor(){var _0x3a8f66=_0x1ae233;this[_0x3a8f66(0x17c)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x3a8f66(0x1ca)]=/'([^\\\\']|\\\\')*'/,this[_0x3a8f66(0x162)]=_0xa4e496[_0x3a8f66(0x1cb)],this['_HTMLAllCollection']=_0xa4e496[_0x3a8f66(0x18e)],this[_0x3a8f66(0x197)]=Object[_0x3a8f66(0x194)],this[_0x3a8f66(0x107)]=Object[_0x3a8f66(0x13f)],this['_Symbol']=_0xa4e496['Symbol'],this[_0x3a8f66(0x13d)]=RegExp[_0x3a8f66(0x175)][_0x3a8f66(0x18f)],this['_dateToString']=Date['prototype'][_0x3a8f66(0x18f)];}[_0x1ae233(0xe6)](_0x541c7c,_0x1a9c9b,_0x5819ee,_0x2a06d5){var _0x2da3a1=_0x1ae233,_0x5114e6=this,_0x317b85=_0x5819ee[_0x2da3a1(0x1c6)];function _0x51db6a(_0x413a11,_0x3d2992,_0x1c393d){var _0x3226cf=_0x2da3a1;_0x3d2992['type']=_0x3226cf(0x1c5),_0x3d2992[_0x3226cf(0x1a9)]=_0x413a11['message'],_0x1f687a=_0x1c393d[_0x3226cf(0x145)]['current'],_0x1c393d[_0x3226cf(0x145)][_0x3226cf(0x113)]=_0x3d2992,_0x5114e6[_0x3226cf(0xf2)](_0x3d2992,_0x1c393d);}try{_0x5819ee[_0x2da3a1(0x1aa)]++,_0x5819ee['autoExpand']&&_0x5819ee['autoExpandPreviousObjects']['push'](_0x1a9c9b);var _0x4cec0c,_0x556db7,_0x10c2b1,_0x37d394,_0x289351=[],_0x3c3d52=[],_0xe7722e,_0xc39bcf=this['_type'](_0x1a9c9b),_0x5d7f91=_0xc39bcf==='array',_0x154b80=!0x1,_0x4796f7=_0xc39bcf===_0x2da3a1(0x1bd),_0x16bc77=this['_isPrimitiveType'](_0xc39bcf),_0x2151f9=this['_isPrimitiveWrapperType'](_0xc39bcf),_0x2359e5=_0x16bc77||_0x2151f9,_0x51082f={},_0x2fcf7a=0x0,_0x362b97=!0x1,_0x1f687a,_0x43433f=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x5819ee['depth']){if(_0x5d7f91){if(_0x556db7=_0x1a9c9b['length'],_0x556db7>_0x5819ee[_0x2da3a1(0x1d2)]){for(_0x10c2b1=0x0,_0x37d394=_0x5819ee[_0x2da3a1(0x1d2)],_0x4cec0c=_0x10c2b1;_0x4cec0c<_0x37d394;_0x4cec0c++)_0x3c3d52[_0x2da3a1(0x1ab)](_0x5114e6[_0x2da3a1(0x177)](_0x289351,_0x1a9c9b,_0xc39bcf,_0x4cec0c,_0x5819ee));_0x541c7c['cappedElements']=!0x0;}else{for(_0x10c2b1=0x0,_0x37d394=_0x556db7,_0x4cec0c=_0x10c2b1;_0x4cec0c<_0x37d394;_0x4cec0c++)_0x3c3d52['push'](_0x5114e6[_0x2da3a1(0x177)](_0x289351,_0x1a9c9b,_0xc39bcf,_0x4cec0c,_0x5819ee));}_0x5819ee[_0x2da3a1(0x14a)]+=_0x3c3d52[_0x2da3a1(0x1a3)];}if(!(_0xc39bcf===_0x2da3a1(0x187)||_0xc39bcf===_0x2da3a1(0x1cb))&&!_0x16bc77&&_0xc39bcf!==_0x2da3a1(0x1bc)&&_0xc39bcf!==_0x2da3a1(0x167)&&_0xc39bcf!==_0x2da3a1(0x161)){var _0x8b2a84=_0x2a06d5[_0x2da3a1(0x1d4)]||_0x5819ee[_0x2da3a1(0x1d4)];if(this[_0x2da3a1(0x1d6)](_0x1a9c9b)?(_0x4cec0c=0x0,_0x1a9c9b[_0x2da3a1(0x16c)](function(_0x28f40f){var _0x51b426=_0x2da3a1;if(_0x2fcf7a++,_0x5819ee[_0x51b426(0x14a)]++,_0x2fcf7a>_0x8b2a84){_0x362b97=!0x0;return;}if(!_0x5819ee[_0x51b426(0x185)]&&_0x5819ee[_0x51b426(0x1c6)]&&_0x5819ee[_0x51b426(0x14a)]>_0x5819ee[_0x51b426(0x1c1)]){_0x362b97=!0x0;return;}_0x3c3d52[_0x51b426(0x1ab)](_0x5114e6[_0x51b426(0x177)](_0x289351,_0x1a9c9b,_0x51b426(0x110),_0x4cec0c++,_0x5819ee,function(_0x1800ef){return function(){return _0x1800ef;};}(_0x28f40f)));})):this[_0x2da3a1(0x16a)](_0x1a9c9b)&&_0x1a9c9b['forEach'](function(_0x278356,_0x2904ff){var _0x11050e=_0x2da3a1;if(_0x2fcf7a++,_0x5819ee['autoExpandPropertyCount']++,_0x2fcf7a>_0x8b2a84){_0x362b97=!0x0;return;}if(!_0x5819ee['isExpressionToEvaluate']&&_0x5819ee[_0x11050e(0x1c6)]&&_0x5819ee[_0x11050e(0x14a)]>_0x5819ee[_0x11050e(0x1c1)]){_0x362b97=!0x0;return;}var _0x3282cc=_0x2904ff[_0x11050e(0x18f)]();_0x3282cc[_0x11050e(0x1a3)]>0x64&&(_0x3282cc=_0x3282cc['slice'](0x0,0x64)+_0x11050e(0x148)),_0x3c3d52[_0x11050e(0x1ab)](_0x5114e6[_0x11050e(0x177)](_0x289351,_0x1a9c9b,_0x11050e(0x11e),_0x3282cc,_0x5819ee,function(_0x35f26a){return function(){return _0x35f26a;};}(_0x278356)));}),!_0x154b80){try{for(_0xe7722e in _0x1a9c9b)if(!(_0x5d7f91&&_0x43433f[_0x2da3a1(0x11a)](_0xe7722e))&&!this[_0x2da3a1(0x1b1)](_0x1a9c9b,_0xe7722e,_0x5819ee)){if(_0x2fcf7a++,_0x5819ee['autoExpandPropertyCount']++,_0x2fcf7a>_0x8b2a84){_0x362b97=!0x0;break;}if(!_0x5819ee[_0x2da3a1(0x185)]&&_0x5819ee[_0x2da3a1(0x1c6)]&&_0x5819ee[_0x2da3a1(0x14a)]>_0x5819ee['autoExpandLimit']){_0x362b97=!0x0;break;}_0x3c3d52['push'](_0x5114e6['_addObjectProperty'](_0x289351,_0x51082f,_0x1a9c9b,_0xc39bcf,_0xe7722e,_0x5819ee));}}catch{}if(_0x51082f['_p_length']=!0x0,_0x4796f7&&(_0x51082f[_0x2da3a1(0x155)]=!0x0),!_0x362b97){var _0x5dbed2=[][_0x2da3a1(0x131)](this[_0x2da3a1(0x107)](_0x1a9c9b))['concat'](this[_0x2da3a1(0x1b7)](_0x1a9c9b));for(_0x4cec0c=0x0,_0x556db7=_0x5dbed2[_0x2da3a1(0x1a3)];_0x4cec0c<_0x556db7;_0x4cec0c++)if(_0xe7722e=_0x5dbed2[_0x4cec0c],!(_0x5d7f91&&_0x43433f['test'](_0xe7722e[_0x2da3a1(0x18f)]()))&&!this[_0x2da3a1(0x1b1)](_0x1a9c9b,_0xe7722e,_0x5819ee)&&!_0x51082f[_0x2da3a1(0x172)+_0xe7722e[_0x2da3a1(0x18f)]()]){if(_0x2fcf7a++,_0x5819ee[_0x2da3a1(0x14a)]++,_0x2fcf7a>_0x8b2a84){_0x362b97=!0x0;break;}if(!_0x5819ee[_0x2da3a1(0x185)]&&_0x5819ee[_0x2da3a1(0x1c6)]&&_0x5819ee['autoExpandPropertyCount']>_0x5819ee[_0x2da3a1(0x1c1)]){_0x362b97=!0x0;break;}_0x3c3d52[_0x2da3a1(0x1ab)](_0x5114e6['_addObjectProperty'](_0x289351,_0x51082f,_0x1a9c9b,_0xc39bcf,_0xe7722e,_0x5819ee));}}}}}if(_0x541c7c[_0x2da3a1(0x10c)]=_0xc39bcf,_0x2359e5?(_0x541c7c['value']=_0x1a9c9b[_0x2da3a1(0x1cf)](),this[_0x2da3a1(0x19a)](_0xc39bcf,_0x541c7c,_0x5819ee,_0x2a06d5)):_0xc39bcf===_0x2da3a1(0x118)?_0x541c7c[_0x2da3a1(0x14c)]=this[_0x2da3a1(0x189)]['call'](_0x1a9c9b):_0xc39bcf===_0x2da3a1(0x161)?_0x541c7c['value']=_0x1a9c9b[_0x2da3a1(0x18f)]():_0xc39bcf===_0x2da3a1(0x1bf)?_0x541c7c[_0x2da3a1(0x14c)]=this[_0x2da3a1(0x13d)][_0x2da3a1(0x1a0)](_0x1a9c9b):_0xc39bcf===_0x2da3a1(0x1c2)&&this[_0x2da3a1(0x1be)]?_0x541c7c['value']=this[_0x2da3a1(0x1be)][_0x2da3a1(0x175)][_0x2da3a1(0x18f)][_0x2da3a1(0x1a0)](_0x1a9c9b):!_0x5819ee[_0x2da3a1(0x186)]&&!(_0xc39bcf==='null'||_0xc39bcf===_0x2da3a1(0x1cb))&&(delete _0x541c7c[_0x2da3a1(0x14c)],_0x541c7c[_0x2da3a1(0x129)]=!0x0),_0x362b97&&(_0x541c7c[_0x2da3a1(0x158)]=!0x0),_0x1f687a=_0x5819ee['node']['current'],_0x5819ee[_0x2da3a1(0x145)][_0x2da3a1(0x113)]=_0x541c7c,this[_0x2da3a1(0xf2)](_0x541c7c,_0x5819ee),_0x3c3d52[_0x2da3a1(0x1a3)]){for(_0x4cec0c=0x0,_0x556db7=_0x3c3d52[_0x2da3a1(0x1a3)];_0x4cec0c<_0x556db7;_0x4cec0c++)_0x3c3d52[_0x4cec0c](_0x4cec0c);}_0x289351[_0x2da3a1(0x1a3)]&&(_0x541c7c['props']=_0x289351);}catch(_0x4d1a8e){_0x51db6a(_0x4d1a8e,_0x541c7c,_0x5819ee);}return this['_additionalMetadata'](_0x1a9c9b,_0x541c7c),this[_0x2da3a1(0xf6)](_0x541c7c,_0x5819ee),_0x5819ee['node'][_0x2da3a1(0x113)]=_0x1f687a,_0x5819ee[_0x2da3a1(0x1aa)]--,_0x5819ee[_0x2da3a1(0x1c6)]=_0x317b85,_0x5819ee[_0x2da3a1(0x1c6)]&&_0x5819ee[_0x2da3a1(0x1cc)][_0x2da3a1(0x119)](),_0x541c7c;}[_0x1ae233(0x1b7)](_0x52c084){var _0x5f4fd2=_0x1ae233;return Object[_0x5f4fd2(0x1d3)]?Object[_0x5f4fd2(0x1d3)](_0x52c084):[];}[_0x1ae233(0x1d6)](_0x46579f){var _0x45cf41=_0x1ae233;return!!(_0x46579f&&_0xa4e496[_0x45cf41(0x110)]&&this[_0x45cf41(0x146)](_0x46579f)===_0x45cf41(0x15c)&&_0x46579f[_0x45cf41(0x16c)]);}[_0x1ae233(0x1b1)](_0x4a042d,_0x4b84e6,_0x20abb9){var _0x37ed97=_0x1ae233;return _0x20abb9[_0x37ed97(0xe7)]?typeof _0x4a042d[_0x4b84e6]==_0x37ed97(0x1bd):!0x1;}[_0x1ae233(0x191)](_0x5a503f){var _0xc6ba15=_0x1ae233,_0x28ff57='';return _0x28ff57=typeof _0x5a503f,_0x28ff57===_0xc6ba15(0x138)?this['_objectToString'](_0x5a503f)==='[object\\x20Array]'?_0x28ff57=_0xc6ba15(0xfc):this[_0xc6ba15(0x146)](_0x5a503f)==='[object\\x20Date]'?_0x28ff57='date':this['_objectToString'](_0x5a503f)===_0xc6ba15(0x1b8)?_0x28ff57='bigint':_0x5a503f===null?_0x28ff57=_0xc6ba15(0x187):_0x5a503f[_0xc6ba15(0x199)]&&(_0x28ff57=_0x5a503f[_0xc6ba15(0x199)][_0xc6ba15(0x123)]||_0x28ff57):_0x28ff57===_0xc6ba15(0x1cb)&&this[_0xc6ba15(0x192)]&&_0x5a503f instanceof this['_HTMLAllCollection']&&(_0x28ff57=_0xc6ba15(0x18e)),_0x28ff57;}[_0x1ae233(0x146)](_0x1b2e3c){var _0x330493=_0x1ae233;return Object[_0x330493(0x175)][_0x330493(0x18f)][_0x330493(0x1a0)](_0x1b2e3c);}[_0x1ae233(0x1a7)](_0x304f22){var _0x501b3c=_0x1ae233;return _0x304f22===_0x501b3c(0xf5)||_0x304f22===_0x501b3c(0xff)||_0x304f22===_0x501b3c(0x15e);}[_0x1ae233(0x16e)](_0x4f6811){var _0x193c4e=_0x1ae233;return _0x4f6811==='Boolean'||_0x4f6811===_0x193c4e(0x1bc)||_0x4f6811===_0x193c4e(0x1ad);}[_0x1ae233(0x177)](_0x4f9eb1,_0x44ee42,_0x3ce7a6,_0x161cc4,_0x17fc53,_0x80e010){var _0x78db84=this;return function(_0x3f83dc){var _0x4c2d04=_0x5229,_0x224c17=_0x17fc53[_0x4c2d04(0x145)][_0x4c2d04(0x113)],_0x59d5cb=_0x17fc53[_0x4c2d04(0x145)][_0x4c2d04(0x117)],_0x3222b2=_0x17fc53[_0x4c2d04(0x145)][_0x4c2d04(0x14f)];_0x17fc53[_0x4c2d04(0x145)][_0x4c2d04(0x14f)]=_0x224c17,_0x17fc53[_0x4c2d04(0x145)]['index']=typeof _0x161cc4==_0x4c2d04(0x15e)?_0x161cc4:_0x3f83dc,_0x4f9eb1[_0x4c2d04(0x1ab)](_0x78db84['_property'](_0x44ee42,_0x3ce7a6,_0x161cc4,_0x17fc53,_0x80e010)),_0x17fc53['node'][_0x4c2d04(0x14f)]=_0x3222b2,_0x17fc53[_0x4c2d04(0x145)]['index']=_0x59d5cb;};}[_0x1ae233(0x16b)](_0x563792,_0x5d4b5e,_0x22a80b,_0x5ab6d3,_0x3d1a30,_0x3c6b52,_0x52d22a){var _0x3a48b7=_0x1ae233,_0x31389c=this;return _0x5d4b5e[_0x3a48b7(0x172)+_0x3d1a30[_0x3a48b7(0x18f)]()]=!0x0,function(_0x685fb1){var _0x395161=_0x3a48b7,_0x297a51=_0x3c6b52[_0x395161(0x145)]['current'],_0x54e9b7=_0x3c6b52[_0x395161(0x145)]['index'],_0x53c760=_0x3c6b52['node'][_0x395161(0x14f)];_0x3c6b52[_0x395161(0x145)][_0x395161(0x14f)]=_0x297a51,_0x3c6b52[_0x395161(0x145)][_0x395161(0x117)]=_0x685fb1,_0x563792['push'](_0x31389c[_0x395161(0xf9)](_0x22a80b,_0x5ab6d3,_0x3d1a30,_0x3c6b52,_0x52d22a)),_0x3c6b52[_0x395161(0x145)]['parent']=_0x53c760,_0x3c6b52[_0x395161(0x145)][_0x395161(0x117)]=_0x54e9b7;};}['_property'](_0x10ea37,_0x5ab413,_0x5507f2,_0x1985bf,_0x25ed7c){var _0x38187a=_0x1ae233,_0x45ad86=this;_0x25ed7c||(_0x25ed7c=function(_0x1cf487,_0xc15883){return _0x1cf487[_0xc15883];});var _0x2ba207=_0x5507f2[_0x38187a(0x18f)](),_0x2481ba=_0x1985bf[_0x38187a(0x152)]||{},_0x32fad4=_0x1985bf[_0x38187a(0x186)],_0x56d363=_0x1985bf['isExpressionToEvaluate'];try{var _0x2ae279=this['_isMap'](_0x10ea37),_0x5d887a=_0x2ba207;_0x2ae279&&_0x5d887a[0x0]==='\\x27'&&(_0x5d887a=_0x5d887a['substr'](0x1,_0x5d887a['length']-0x2));var _0xf30432=_0x1985bf[_0x38187a(0x152)]=_0x2481ba[_0x38187a(0x172)+_0x5d887a];_0xf30432&&(_0x1985bf[_0x38187a(0x186)]=_0x1985bf['depth']+0x1),_0x1985bf[_0x38187a(0x185)]=!!_0xf30432;var _0xf60329=typeof _0x5507f2==_0x38187a(0x1c2),_0x590054={'name':_0xf60329||_0x2ae279?_0x2ba207:this['_propertyName'](_0x2ba207)};if(_0xf60329&&(_0x590054[_0x38187a(0x1c2)]=!0x0),!(_0x5ab413==='array'||_0x5ab413===_0x38187a(0x151))){var _0x20425b=this['_getOwnPropertyDescriptor'](_0x10ea37,_0x5507f2);if(_0x20425b&&(_0x20425b[_0x38187a(0x183)]&&(_0x590054[_0x38187a(0x182)]=!0x0),_0x20425b[_0x38187a(0x10e)]&&!_0xf30432&&!_0x1985bf[_0x38187a(0x165)]))return _0x590054[_0x38187a(0x150)]=!0x0,this[_0x38187a(0x139)](_0x590054,_0x1985bf),_0x590054;}var _0x9388dc;try{_0x9388dc=_0x25ed7c(_0x10ea37,_0x5507f2);}catch(_0x3ac625){return _0x590054={'name':_0x2ba207,'type':_0x38187a(0x1c5),'error':_0x3ac625['message']},this[_0x38187a(0x139)](_0x590054,_0x1985bf),_0x590054;}var _0x41281a=this[_0x38187a(0x191)](_0x9388dc),_0x2ef369=this['_isPrimitiveType'](_0x41281a);if(_0x590054[_0x38187a(0x10c)]=_0x41281a,_0x2ef369)this[_0x38187a(0x139)](_0x590054,_0x1985bf,_0x9388dc,function(){var _0x201721=_0x38187a;_0x590054['value']=_0x9388dc['valueOf'](),!_0xf30432&&_0x45ad86[_0x201721(0x19a)](_0x41281a,_0x590054,_0x1985bf,{});});else{var _0x2ae07b=_0x1985bf[_0x38187a(0x1c6)]&&_0x1985bf[_0x38187a(0x1aa)]<_0x1985bf[_0x38187a(0x179)]&&_0x1985bf['autoExpandPreviousObjects'][_0x38187a(0x190)](_0x9388dc)<0x0&&_0x41281a!=='function'&&_0x1985bf[_0x38187a(0x14a)]<_0x1985bf[_0x38187a(0x1c1)];_0x2ae07b||_0x1985bf[_0x38187a(0x1aa)]<_0x32fad4||_0xf30432?(this[_0x38187a(0xe6)](_0x590054,_0x9388dc,_0x1985bf,_0xf30432||{}),this[_0x38187a(0x198)](_0x9388dc,_0x590054)):this['_processTreeNodeResult'](_0x590054,_0x1985bf,_0x9388dc,function(){var _0x4aca38=_0x38187a;_0x41281a==='null'||_0x41281a===_0x4aca38(0x1cb)||(delete _0x590054[_0x4aca38(0x14c)],_0x590054[_0x4aca38(0x129)]=!0x0);});}return _0x590054;}finally{_0x1985bf[_0x38187a(0x152)]=_0x2481ba,_0x1985bf[_0x38187a(0x186)]=_0x32fad4,_0x1985bf['isExpressionToEvaluate']=_0x56d363;}}[_0x1ae233(0x19a)](_0x434bab,_0xffd0a5,_0x18d7b2,_0x4edc79){var _0x1a55ec=_0x1ae233,_0x4d0c98=_0x4edc79[_0x1a55ec(0x1c3)]||_0x18d7b2[_0x1a55ec(0x1c3)];if((_0x434bab==='string'||_0x434bab===_0x1a55ec(0x1bc))&&_0xffd0a5[_0x1a55ec(0x14c)]){let _0x5efdda=_0xffd0a5[_0x1a55ec(0x14c)]['length'];_0x18d7b2[_0x1a55ec(0x108)]+=_0x5efdda,_0x18d7b2[_0x1a55ec(0x108)]>_0x18d7b2[_0x1a55ec(0x11c)]?(_0xffd0a5[_0x1a55ec(0x129)]='',delete _0xffd0a5[_0x1a55ec(0x14c)]):_0x5efdda>_0x4d0c98&&(_0xffd0a5[_0x1a55ec(0x129)]=_0xffd0a5['value'][_0x1a55ec(0x15b)](0x0,_0x4d0c98),delete _0xffd0a5[_0x1a55ec(0x14c)]);}}[_0x1ae233(0x16a)](_0x291df1){var _0x49ee0d=_0x1ae233;return!!(_0x291df1&&_0xa4e496['Map']&&this['_objectToString'](_0x291df1)===_0x49ee0d(0x166)&&_0x291df1[_0x49ee0d(0x16c)]);}[_0x1ae233(0x154)](_0x45c346){var _0x4d40a7=_0x1ae233;if(_0x45c346[_0x4d40a7(0x160)](/^\\d+$/))return _0x45c346;var _0x5805a9;try{_0x5805a9=JSON['stringify'](''+_0x45c346);}catch{_0x5805a9='\\x22'+this[_0x4d40a7(0x146)](_0x45c346)+'\\x22';}return _0x5805a9['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x5805a9=_0x5805a9[_0x4d40a7(0x15b)](0x1,_0x5805a9[_0x4d40a7(0x1a3)]-0x2):_0x5805a9=_0x5805a9['replace'](/'/g,'\\x5c\\x27')[_0x4d40a7(0x10b)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x5805a9;}['_processTreeNodeResult'](_0x46ae37,_0x217d98,_0x48b11a,_0x4c01f7){var _0x2a67b6=_0x1ae233;this['_treeNodePropertiesBeforeFullValue'](_0x46ae37,_0x217d98),_0x4c01f7&&_0x4c01f7(),this[_0x2a67b6(0x198)](_0x48b11a,_0x46ae37),this[_0x2a67b6(0xf6)](_0x46ae37,_0x217d98);}[_0x1ae233(0xf2)](_0x28c479,_0x5984bb){var _0x430ef1=_0x1ae233;this[_0x430ef1(0x144)](_0x28c479,_0x5984bb),this[_0x430ef1(0x17d)](_0x28c479,_0x5984bb),this['_setNodeExpressionPath'](_0x28c479,_0x5984bb),this[_0x430ef1(0x116)](_0x28c479,_0x5984bb);}[_0x1ae233(0x144)](_0x2087b5,_0x6f377c){}[_0x1ae233(0x17d)](_0x375570,_0x3a048d){}['_setNodeLabel'](_0x4fa22f,_0x34d651){}[_0x1ae233(0x174)](_0x4f4769){var _0x502e6f=_0x1ae233;return _0x4f4769===this[_0x502e6f(0x162)];}[_0x1ae233(0xf6)](_0x49b75b,_0x266725){var _0x536ad7=_0x1ae233;this['_setNodeLabel'](_0x49b75b,_0x266725),this['_setNodeExpandableState'](_0x49b75b),_0x266725[_0x536ad7(0x134)]&&this[_0x536ad7(0x1c7)](_0x49b75b),this[_0x536ad7(0x159)](_0x49b75b,_0x266725),this[_0x536ad7(0x14e)](_0x49b75b,_0x266725),this[_0x536ad7(0x105)](_0x49b75b);}[_0x1ae233(0x198)](_0x55ff6e,_0x2c1593){var _0x2f124f=_0x1ae233;let _0x15c55c;try{_0xa4e496[_0x2f124f(0x19c)]&&(_0x15c55c=_0xa4e496[_0x2f124f(0x19c)][_0x2f124f(0x1a9)],_0xa4e496[_0x2f124f(0x19c)]['error']=function(){}),_0x55ff6e&&typeof _0x55ff6e['length']==_0x2f124f(0x15e)&&(_0x2c1593[_0x2f124f(0x1a3)]=_0x55ff6e[_0x2f124f(0x1a3)]);}catch{}finally{_0x15c55c&&(_0xa4e496[_0x2f124f(0x19c)][_0x2f124f(0x1a9)]=_0x15c55c);}if(_0x2c1593[_0x2f124f(0x10c)]==='number'||_0x2c1593[_0x2f124f(0x10c)]==='Number'){if(isNaN(_0x2c1593[_0x2f124f(0x14c)]))_0x2c1593['nan']=!0x0,delete _0x2c1593[_0x2f124f(0x14c)];else switch(_0x2c1593[_0x2f124f(0x14c)]){case Number[_0x2f124f(0x1ba)]:_0x2c1593[_0x2f124f(0x109)]=!0x0,delete _0x2c1593[_0x2f124f(0x14c)];break;case Number[_0x2f124f(0x1cd)]:_0x2c1593[_0x2f124f(0xed)]=!0x0,delete _0x2c1593[_0x2f124f(0x14c)];break;case 0x0:this[_0x2f124f(0x141)](_0x2c1593[_0x2f124f(0x14c)])&&(_0x2c1593['negativeZero']=!0x0);break;}}else _0x2c1593[_0x2f124f(0x10c)]===_0x2f124f(0x1bd)&&typeof _0x55ff6e[_0x2f124f(0x123)]=='string'&&_0x55ff6e[_0x2f124f(0x123)]&&_0x2c1593['name']&&_0x55ff6e[_0x2f124f(0x123)]!==_0x2c1593[_0x2f124f(0x123)]&&(_0x2c1593[_0x2f124f(0x111)]=_0x55ff6e['name']);}['_isNegativeZero'](_0x4218f8){return 0x1/_0x4218f8===Number['NEGATIVE_INFINITY'];}[_0x1ae233(0x1c7)](_0x27b736){var _0x58a95f=_0x1ae233;!_0x27b736[_0x58a95f(0x1d4)]||!_0x27b736[_0x58a95f(0x1d4)]['length']||_0x27b736[_0x58a95f(0x10c)]===_0x58a95f(0xfc)||_0x27b736['type']===_0x58a95f(0x11e)||_0x27b736[_0x58a95f(0x10c)]===_0x58a95f(0x110)||_0x27b736[_0x58a95f(0x1d4)]['sort'](function(_0x21b4a6,_0x243dca){var _0x5c3c5b=_0x58a95f,_0x537926=_0x21b4a6['name'][_0x5c3c5b(0x18b)](),_0x5691fc=_0x243dca[_0x5c3c5b(0x123)][_0x5c3c5b(0x18b)]();return _0x537926<_0x5691fc?-0x1:_0x537926>_0x5691fc?0x1:0x0;});}['_addFunctionsNode'](_0x27ac31,_0x5e3d6e){var _0x328b0a=_0x1ae233;if(!(_0x5e3d6e[_0x328b0a(0xe7)]||!_0x27ac31[_0x328b0a(0x1d4)]||!_0x27ac31[_0x328b0a(0x1d4)][_0x328b0a(0x1a3)])){for(var _0x569083=[],_0x5cd9e8=[],_0x82bc9a=0x0,_0x38f1f3=_0x27ac31[_0x328b0a(0x1d4)][_0x328b0a(0x1a3)];_0x82bc9a<_0x38f1f3;_0x82bc9a++){var _0x28ca59=_0x27ac31[_0x328b0a(0x1d4)][_0x82bc9a];_0x28ca59[_0x328b0a(0x10c)]===_0x328b0a(0x1bd)?_0x569083[_0x328b0a(0x1ab)](_0x28ca59):_0x5cd9e8[_0x328b0a(0x1ab)](_0x28ca59);}if(!(!_0x5cd9e8[_0x328b0a(0x1a3)]||_0x569083[_0x328b0a(0x1a3)]<=0x1)){_0x27ac31[_0x328b0a(0x1d4)]=_0x5cd9e8;var _0x433159={'functionsNode':!0x0,'props':_0x569083};this[_0x328b0a(0x144)](_0x433159,_0x5e3d6e),this[_0x328b0a(0x1b9)](_0x433159,_0x5e3d6e),this[_0x328b0a(0x125)](_0x433159),this[_0x328b0a(0x116)](_0x433159,_0x5e3d6e),_0x433159['id']+='\\x20f',_0x27ac31[_0x328b0a(0x1d4)][_0x328b0a(0x1a5)](_0x433159);}}}[_0x1ae233(0x14e)](_0x22a085,_0x4a5ad3){}[_0x1ae233(0x125)](_0x27d01e){}[_0x1ae233(0x181)](_0x1b0e41){var _0x4140d9=_0x1ae233;return Array['isArray'](_0x1b0e41)||typeof _0x1b0e41==_0x4140d9(0x138)&&this[_0x4140d9(0x146)](_0x1b0e41)===_0x4140d9(0x12a);}[_0x1ae233(0x116)](_0x90125b,_0x5a4d6b){}[_0x1ae233(0x105)](_0x4b56bd){var _0x24036d=_0x1ae233;delete _0x4b56bd[_0x24036d(0xfa)],delete _0x4b56bd[_0x24036d(0x115)],delete _0x4b56bd[_0x24036d(0x126)];}[_0x1ae233(0x1ac)](_0x3a0318,_0x28514e){}}let _0x5b787c=new _0x16a434(),_0x2e854a={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x356caa={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x4631eb(_0x68a0ce,_0x5cc760,_0xa4de36,_0x2f71ee,_0x5d33a2,_0x72b57){var _0x4a6964=_0x1ae233;let _0x79e5aa,_0x251e6f;try{_0x251e6f=_0x485233(),_0x79e5aa=_0x3db20d[_0x5cc760],!_0x79e5aa||_0x251e6f-_0x79e5aa['ts']>0x1f4&&_0x79e5aa[_0x4a6964(0x12e)]&&_0x79e5aa[_0x4a6964(0x156)]/_0x79e5aa['count']<0x64?(_0x3db20d[_0x5cc760]=_0x79e5aa={'count':0x0,'time':0x0,'ts':_0x251e6f},_0x3db20d[_0x4a6964(0x15d)]={}):_0x251e6f-_0x3db20d[_0x4a6964(0x15d)]['ts']>0x32&&_0x3db20d[_0x4a6964(0x15d)][_0x4a6964(0x12e)]&&_0x3db20d[_0x4a6964(0x15d)][_0x4a6964(0x156)]/_0x3db20d[_0x4a6964(0x15d)]['count']<0x64&&(_0x3db20d[_0x4a6964(0x15d)]={});let _0x41bbbb=[],_0x4640e6=_0x79e5aa[_0x4a6964(0x19e)]||_0x3db20d['hits'][_0x4a6964(0x19e)]?_0x356caa:_0x2e854a,_0x2a9096=_0x33e410=>{var _0x250948=_0x4a6964;let _0x2cec18={};return _0x2cec18[_0x250948(0x1d4)]=_0x33e410[_0x250948(0x1d4)],_0x2cec18[_0x250948(0x1d2)]=_0x33e410[_0x250948(0x1d2)],_0x2cec18['strLength']=_0x33e410['strLength'],_0x2cec18['totalStrLength']=_0x33e410[_0x250948(0x11c)],_0x2cec18['autoExpandLimit']=_0x33e410[_0x250948(0x1c1)],_0x2cec18[_0x250948(0x179)]=_0x33e410[_0x250948(0x179)],_0x2cec18['sortProps']=!0x1,_0x2cec18[_0x250948(0xe7)]=!_0x3509a0,_0x2cec18['depth']=0x1,_0x2cec18[_0x250948(0x1aa)]=0x0,_0x2cec18[_0x250948(0xfb)]=_0x250948(0x188),_0x2cec18[_0x250948(0x1a8)]=_0x250948(0x122),_0x2cec18['autoExpand']=!0x0,_0x2cec18['autoExpandPreviousObjects']=[],_0x2cec18['autoExpandPropertyCount']=0x0,_0x2cec18[_0x250948(0x165)]=!0x0,_0x2cec18[_0x250948(0x108)]=0x0,_0x2cec18[_0x250948(0x145)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2cec18;};for(var _0x12d646=0x0;_0x12d646<_0x5d33a2[_0x4a6964(0x1a3)];_0x12d646++)_0x41bbbb[_0x4a6964(0x1ab)](_0x5b787c[_0x4a6964(0xe6)]({'timeNode':_0x68a0ce==='time'||void 0x0},_0x5d33a2[_0x12d646],_0x2a9096(_0x4640e6),{}));if(_0x68a0ce===_0x4a6964(0x170)){let _0x23b97c=Error[_0x4a6964(0x18d)];try{Error['stackTraceLimit']=0x1/0x0,_0x41bbbb[_0x4a6964(0x1ab)](_0x5b787c[_0x4a6964(0xe6)]({'stackNode':!0x0},new Error()['stack'],_0x2a9096(_0x4640e6),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x23b97c;}}return{'method':'log','version':_0x1b1448,'args':[{'ts':_0xa4de36,'session':_0x2f71ee,'args':_0x41bbbb,'id':_0x5cc760,'context':_0x72b57}]};}catch(_0x36d517){return{'method':_0x4a6964(0xf0),'version':_0x1b1448,'args':[{'ts':_0xa4de36,'session':_0x2f71ee,'args':[{'type':_0x4a6964(0x1c5),'error':_0x36d517&&_0x36d517[_0x4a6964(0x1b3)]}],'id':_0x5cc760,'context':_0x72b57}]};}finally{try{if(_0x79e5aa&&_0x251e6f){let _0x4167ff=_0x485233();_0x79e5aa['count']++,_0x79e5aa['time']+=_0x72b8a4(_0x251e6f,_0x4167ff),_0x79e5aa['ts']=_0x4167ff,_0x3db20d[_0x4a6964(0x15d)]['count']++,_0x3db20d[_0x4a6964(0x15d)]['time']+=_0x72b8a4(_0x251e6f,_0x4167ff),_0x3db20d[_0x4a6964(0x15d)]['ts']=_0x4167ff,(_0x79e5aa[_0x4a6964(0x12e)]>0x32||_0x79e5aa[_0x4a6964(0x156)]>0x64)&&(_0x79e5aa[_0x4a6964(0x19e)]=!0x0),(_0x3db20d[_0x4a6964(0x15d)][_0x4a6964(0x12e)]>0x3e8||_0x3db20d[_0x4a6964(0x15d)][_0x4a6964(0x156)]>0x12c)&&(_0x3db20d['hits'][_0x4a6964(0x19e)]=!0x0);}}catch{}}}return _0x4631eb;}((_0x8bad76,_0x413478,_0xdf795,_0x3a0654,_0x7af2d,_0x53dbb7,_0xf68b6e,_0x1a1cef,_0x354cb3,_0x2df695)=>{var _0x201a53=_0x233c0b;if(_0x8bad76[_0x201a53(0xf8)])return _0x8bad76[_0x201a53(0xf8)];if(!J(_0x8bad76,_0x1a1cef,_0x7af2d))return _0x8bad76['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x8bad76[_0x201a53(0xf8)];let _0x1ae684=W(_0x8bad76),_0x571e40=_0x1ae684[_0x201a53(0x17a)],_0x425aa6=_0x1ae684[_0x201a53(0x196)],_0x4c85c3=_0x1ae684['now'],_0x28e6f3={'hits':{},'ts':{}},_0x5a5400=Y(_0x8bad76,_0x354cb3,_0x28e6f3,_0x53dbb7),_0x17366c=_0x393d7c=>{_0x28e6f3['ts'][_0x393d7c]=_0x425aa6();},_0x12426f=(_0x1e7184,_0xaf1197)=>{var _0x24f029=_0x201a53;let _0x442899=_0x28e6f3['ts'][_0xaf1197];if(delete _0x28e6f3['ts'][_0xaf1197],_0x442899){let _0x59834c=_0x571e40(_0x442899,_0x425aa6());_0x27ac39(_0x5a5400(_0x24f029(0x156),_0x1e7184,_0x4c85c3(),_0x558c58,[_0x59834c],_0xaf1197));}},_0x57aca8=_0x475894=>_0x18ebdb=>{var _0x23b48c=_0x201a53;try{_0x17366c(_0x18ebdb),_0x475894(_0x18ebdb);}finally{_0x8bad76[_0x23b48c(0x19c)]['time']=_0x475894;}},_0x75397e=_0x162fba=>_0x1a0c98=>{var _0x2968e4=_0x201a53;try{let [_0x18478c,_0x413616]=_0x1a0c98['split'](_0x2968e4(0x114));_0x12426f(_0x413616,_0x18478c),_0x162fba(_0x18478c);}finally{_0x8bad76[_0x2968e4(0x19c)]['timeEnd']=_0x162fba;}};_0x8bad76['_console_ninja']={'consoleLog':(_0x47216a,_0x2e2980)=>{var _0x2ddb5a=_0x201a53;_0x8bad76['console'][_0x2ddb5a(0xf0)][_0x2ddb5a(0x123)]!==_0x2ddb5a(0x1ce)&&_0x27ac39(_0x5a5400(_0x2ddb5a(0xf0),_0x47216a,_0x4c85c3(),_0x558c58,_0x2e2980));},'consoleTrace':(_0x347ab0,_0x199df5)=>{var _0x184961=_0x201a53;_0x8bad76[_0x184961(0x19c)][_0x184961(0xf0)]['name']!==_0x184961(0x1a1)&&_0x27ac39(_0x5a5400('trace',_0x347ab0,_0x4c85c3(),_0x558c58,_0x199df5));},'consoleTime':()=>{var _0x781fc9=_0x201a53;_0x8bad76[_0x781fc9(0x19c)][_0x781fc9(0x156)]=_0x57aca8(_0x8bad76[_0x781fc9(0x19c)]['time']);},'consoleTimeEnd':()=>{var _0x5574ae=_0x201a53;_0x8bad76[_0x5574ae(0x19c)]['timeEnd']=_0x75397e(_0x8bad76[_0x5574ae(0x19c)][_0x5574ae(0x103)]);},'autoLog':(_0xbb480d,_0xff3453)=>{_0x27ac39(_0x5a5400('log',_0xff3453,_0x4c85c3(),_0x558c58,[_0xbb480d]));},'autoLogMany':(_0x502a54,_0x5d6afd)=>{_0x27ac39(_0x5a5400('log',_0x502a54,_0x4c85c3(),_0x558c58,_0x5d6afd));},'autoTrace':(_0x468d21,_0x7fc0e2)=>{var _0x1c0013=_0x201a53;_0x27ac39(_0x5a5400(_0x1c0013(0x170),_0x7fc0e2,_0x4c85c3(),_0x558c58,[_0x468d21]));},'autoTraceMany':(_0x232632,_0x57e499)=>{_0x27ac39(_0x5a5400('trace',_0x232632,_0x4c85c3(),_0x558c58,_0x57e499));},'autoTime':(_0x4f1673,_0x24de5b,_0x5c5d49)=>{_0x17366c(_0x5c5d49);},'autoTimeEnd':(_0x905848,_0x67fd5b,_0x18fa9a)=>{_0x12426f(_0x67fd5b,_0x18fa9a);},'coverage':_0x98714f=>{var _0x109170=_0x201a53;_0x27ac39({'method':_0x109170(0x1a2),'version':_0x53dbb7,'args':[{'id':_0x98714f}]});}};let _0x27ac39=b(_0x8bad76,_0x413478,_0xdf795,_0x3a0654,_0x7af2d,_0x2df695),_0x558c58=_0x8bad76[_0x201a53(0x1af)];return _0x8bad76['_console_ninja'];})(globalThis,_0x233c0b(0x106),_0x233c0b(0x101),_0x233c0b(0x16f),'webpack',_0x233c0b(0x15f),_0x233c0b(0x13e),_0x233c0b(0x135),_0x233c0b(0xef),'');"
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
