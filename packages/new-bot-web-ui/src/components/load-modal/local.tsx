import { Button, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';
import React from 'react';
import LocalFooter from './local-footer';
import WorkspaceControl from './workspace-control';
import classNames from 'classnames';

type TLocalComponentProps = {
    active_tab: number;
    has_started_bot_builder_tour: boolean;
    handleFileChange: (
        e: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body?: boolean
    ) => boolean;
    is_open_button_loading: boolean;
    loaded_local_file: string;
    setLoadedLocalFile: (loaded_local_file: boolean | null) => void;
};

const LocalComponent = ({
    active_tab,
    has_started_bot_builder_tour,
    handleFileChange,
    loaded_local_file,
    setLoadedLocalFile,
}: TLocalComponentProps) => {
    const file_input_ref = React.useRef(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const is_mobile = isMobile();

    if (loaded_local_file && is_file_supported) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div
                    className={classNames('load-strategy__local-preview', {
                        'load-strategy__local-preview--active': active_tab === 1 && has_started_bot_builder_tour,
                    })}
                >
                    <div className='load-strategy__title'>
                        <Localize i18n_default_text='Preview' />
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div id='load-strategy__blockly-container' style={{ height: '100%' }}>
                            <div className='load-strategy__local-preview-close'>
                                <Icon icon='IcCross' onClick={() => setLoadedLocalFile(null)} />
                            </div>
                            <WorkspaceControl />
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
    }

    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__local-dropzone'>
                <input
                    type='file'
                    ref={file_input_ref}
                    accept='.xml'
                    style={{ display: 'none' }}
                    onChange={e => setIsFileSupported(handleFileChange(e, false))}
                />
                <div
                    className='load-strategy__local-dropzone-area'
                    onDrop={e => {
                        handleFileChange(e, false);
                    }}
                >
                    {is_mobile ? (
                        <Icon icon='IcLocal' className='load-strategy__local-icon' size={is_mobile ? 96 : 128} />
                    ) : (
                        <React.Fragment>
                            <Icon icon='IcPc' className='load-strategy__local-icon' size={is_mobile ? 96 : 128} />
                            <div className='load-strategy__local-title'>
                                <Localize i18n_default_text='Drag your XML file here' />
                            </div>
                            <div className='load-strategy__local-description'>
                                <Localize i18n_default_text='or, if you prefer...' />
                            </div>
                        </React.Fragment>
                    )}
                    <Button
                        text={
                            is_file_supported
                                ? localize('Select an XML file from your device')
                                : localize('Please upload an XML file')
                        }
                        onClick={() => file_input_ref.current.click()}
                        has_effect
                        primary
                        large
                    />
                </div>
            </div>
        </div>
    );
};

const Local = connect(({ load_modal, dashboard }: RootStore) => ({
    active_tab: dashboard.active_tab,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    handleFileChange: load_modal.handleFileChange,
    is_open_button_loading: load_modal.is_open_button_loading,
    loaded_local_file: load_modal.loaded_local_file,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
}))(LocalComponent);

export default Local;
