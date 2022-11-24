import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Text, Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import LocalFooter from './local-footer';
import WorkspaceControl from './workspace-control';
import RootStore from 'Stores/index';
import './index.scss';
import { isMobile } from '@deriv/shared';

type Nullable<T> = T | null;
type TLocalComponent = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, data: boolean) => boolean;
    loaded_local_file: boolean;
    setLoadedLocalFile: (data: Nullable<string>) => void;
    onConfirmSave: () => void;
    onDrop: () => void;
    setActiveTab: (param: number) => void;
    loadFileFromLocal: () => void;
    previewRecentStrategy: () => void;
    loadFileFromRecent: () => void;
    setFileLoaded: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => boolean;
};

const LocalComponent = ({
    handleFileChange,
    loaded_local_file,
    onConfirmSave,
    setActiveTab,
    loadFileFromLocal,
    loadFileFromRecent,
}: TLocalComponent) => {
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const loadedLocalFileLocation = () => {
        return loaded_local_file ? loadFileFromLocal() : loadFileFromRecent();
    };
    const el_ref = React.useRef<HTMLInputElement | null>(null);
    const clearInjectionDiv = () => {
        el_ref?.current?.removeChild(el_ref?.current?.children[0]);
    };

    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__local-preview'>
                <div className='load-strategy__recent-preview'>
                    <div className='load-strategy__title load-strategy__recent-preview-title'>
                        <Localize i18n_default_text='Preview' />
                        <div className='tab__dashboard__preview__retrigger'>
                            <button
                                onClick={() => {
                                    setActiveTab(4);
                                }}
                            >
                                <Icon
                                    className='tab__dashboard__preview__retrigger__icon'
                                    width='2.4rem'
                                    height='2.4rem'
                                    icon={'IcDbotUserGuide'}
                                />
                                <Text
                                    color='prominent'
                                    size='xs'
                                    line_height='s'
                                    className={'tab__dashboard__preview__retrigger__text'}
                                >
                                    {localize('UserGuide')}
                                </Text>
                            </button>
                        </div>
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div
                            className='load-strategy__preview-workspace-container'
                            id='load-strategy__blockly-container'
                            ref={el_ref}
                        >
                            <WorkspaceControl />
                        </div>
                    </div>
                    <div className='load-strategy__button-group'>
                        <input
                            type='file'
                            ref={file_input_ref}
                            accept='.xml'
                            style={{ display: 'none' }}
                            onChange={e => {
                                clearInjectionDiv();
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
            {isMobile() && (
                <div className='load-strategy__local-footer'>
                    <LocalFooter />
                </div>
            )}
        </div>
    );
};

const Local = connect(({ load_modal, save_modal, dashboard }: RootStore) => ({
    handleFileChange: load_modal.handleFileChange,
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
