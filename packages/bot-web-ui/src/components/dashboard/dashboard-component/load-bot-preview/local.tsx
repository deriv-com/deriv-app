import React from 'react';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LocalFooter from './local-footer';
import WorkspaceControl from './workspace-control';
import RootStore from 'Stores/index';
import './index.scss';

type Nullable<T> = T | null;
type TLocalComponent = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, data: boolean) => boolean;
    is_mobile: boolean;
    loaded_local_file: boolean;
    setLoadedLocalFile: (data: Nullable<string>) => void;
    onConfirmSave: () => void;
    onDrop: () => void;
    setActiveTab: (param: number) => void;
    loadFileFromLocal: () => void;
    previewRecentStrategy: () => void;
    loadFileFromRecent: () => void;
    setFileLoaded: (param: boolean) => void;
};

const LocalComponent = ({
    handleFileChange,
    is_mobile,
    loaded_local_file,
    setLoadedLocalFile,
    onConfirmSave,
    setActiveTab,
    loadFileFromLocal,
    loadFileFromRecent,
    setFileLoaded,
}: TLocalComponent) => {
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const clear_preview_ref = React.useRef<HTMLInputElement | null>(null);
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const loadedLocalFileLocation = () => {
        return loaded_local_file ? loadFileFromLocal() : loadFileFromRecent();
    };
    const clearInjectionDiv = () => {
        const element = document.getElementById('load-strategy__blockly-container');
        if (element?.getElementsByClassName('injectionDiv').length) {
            element.removeChild(element.getElementsByClassName('injectionDiv')[0]);
        }
    };
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__local-preview'>
                <div className='load-strategy__recent-preview'>
                    <div className='load-strategy__title load-strategy__recent-preview-title'>
                        <Localize i18n_default_text='Preview' />
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div
                            className='load-strategy__preview-workspace-container'
                            id='load-strategy__blockly-container'
                        >
                            <WorkspaceControl />
                        </div>
                    </div>
                    <div className='load-strategy__button-group'>
                        <button
                            ref={clear_preview_ref}
                            className='load-strategy__button-group--clear'
                            onClick={() => {
                                clearInjectionDiv();
                                setFileLoaded(false);
                                //setLoadedLocalFile(null);
                                //Blockly.mainWorkspace.clear(); THIS METHOOD DOES NOT CLEAT THE INJECTION DIV
                            }}
                        >
                            clear
                        </button>
                        <input
                            type='file'
                            ref={file_input_ref}
                            accept='.xml'
                            style={{ display: 'none' }}
                            onChange={e => {
                                onConfirmSave();
                                setIsFileSupported(handleFileChange(e, false));
                            }}
                        />
                        <button
                            className='load-strategy__button-group--open'
                            onClick={() => {
                                setActiveTab(1);
                                loadedLocalFileLocation();
                            }}
                        >
                            Open
                        </button>
                    </div>
                </div>
            </div>
            {is_mobile && (
                <div className='load-strategy__local-footer'>
                    <LocalFooter />
                </div>
            )}
        </div>
    );
};

const Local = connect(({ load_modal, ui, save_modal, dashboard }: RootStore) => ({
    handleFileChange: load_modal.handleFileChange,
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loaded_local_file: load_modal.loaded_local_file,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    onConfirmSave: save_modal.onConfirmSave,
    setActiveTab: dashboard.setActiveTab,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setFileLoaded: dashboard.setFileLoaded,
}))(LocalComponent);

Local.Footer = LocalFooter;

export default Local;
