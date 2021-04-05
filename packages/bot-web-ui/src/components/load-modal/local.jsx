import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LocalFooter from './local-footer.jsx';
import WorkspaceControl from './workspace-control.jsx';

const LocalComponent = ({ handleFileChange, is_mobile, loaded_local_file, setLoadedLocalFile }) => {
    const file_input_ref = React.useRef(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);

    if (loaded_local_file && is_file_supported) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div className='load-strategy__local-preview'>
                    <div className='load-strategy__title'>
                        <Localize i18n_default_text='Preview' />
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div id='load-strategy__blockly-container' style={{ height: '100%' }}>
                            {!is_mobile && (
                                <div className='load-strategy__local-preview-close'>
                                    <Icon icon={'IcCross'} onClick={() => setLoadedLocalFile(null)} />
                                </div>
                            )}
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
                        <Icon icon={'IcMobile'} className='load-strategy__local-icon' size={is_mobile ? 96 : 128} />
                    ) : (
                        <React.Fragment>
                            <Icon icon={'IcPc'} className='load-strategy__local-icon' size={is_mobile ? 96 : 128} />
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

LocalComponent.propTypes = {
    handleFileChange: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_open_button_loading: PropTypes.bool,
    loaded_local_file: PropTypes.string,
    setLoadedLocalFile: PropTypes.func,
};

const Local = connect(({ load_modal, ui }) => ({
    handleFileChange: load_modal.handleFileChange,
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loaded_local_file: load_modal.loaded_local_file,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
}))(LocalComponent);

Local.Footer = LocalFooter;

export default Local;
