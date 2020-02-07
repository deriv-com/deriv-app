import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Button, Modal, Tabs, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { connect } from '../stores/connect';
import '../assets/sass/load-modal.scss';

const WorkspaceControl = ({ onZoomInOutClick }) => (
    <div className='load-recent__preview-controls'>
        <Icon icon={'IcAddRounded'} className='load-recent__preview-icon' onClick={() => onZoomInOutClick(true)} />
        <Icon icon={'IcMinusRounded'} className='load-recent__preview-icon' onClick={() => onZoomInOutClick(false)} />
    </div>
);

const Recent = ({
    is_explanation_expand,
    is_open_button_loading,
    getRecentFileIcon,
    getSaveType,
    loadFileFromRecent,
    onExplanationToggle,
    previewWorkspace,
    recent_files,
    selected_file_id,
    ...props
}) => (
    <div className='load-recent__container'>
        {recent_files.length ? (
            <>
                <div className='load-recent__content'>
                    <div className='load-recent__files load__content-with-footer'>
                        <div className='load-recent__title'>{localize('Recent')}</div>
                        <div className='load-recent__list'>
                            {recent_files.map(file => {
                                return (
                                    <div
                                        className={classnames('load-recent__item', {
                                            'load-recent__item--selected': selected_file_id === file.id,
                                        })}
                                        key={file.id}
                                        onClick={() => previewWorkspace(file.id)}
                                    >
                                        <div className='load-recent__item-text'>
                                            <div className='load-recent__item-title'>{file.name}</div>
                                            <div className='load-recent__item-time'>{timeSince(file.timestamp)}</div>
                                        </div>
                                        <div className='load-recent__item-location'>
                                            <Icon
                                                icon={getRecentFileIcon(file.save_type)}
                                                className={classnames({
                                                    'load-google-drive__icon--active':
                                                        file.save_type === save_types.GOOGLE_DRIVE,
                                                })}
                                            />
                                            <div className='load-recent__item-saved'>{getSaveType(file.save_type)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='load-recent__preview load__content-with-footer'>
                        <div className='load-recent__title'>{localize('Preview')}</div>
                        <div id='load-recent__scratch' className='load-recent__preview-workspace'>
                            <WorkspaceControl {...props} />
                        </div>
                    </div>
                </div>
                <div className='load-recent__footer'>
                    <Button
                        className='load-recent__footer-open'
                        text={localize('Open')}
                        onClick={loadFileFromRecent}
                        is_loading={is_open_button_loading}
                        has_effect
                        primary
                    />
                </div>
            </>
        ) : (
            <div className='load-recent__empty'>
                <Icon icon='IcEmptyFolder' className='load-recent__empty-icon' size={116} />
                <div className='load-recent__empty-title'>{localize('You do not have any recent bots')}</div>
                <div className='load-recent__empty-desc'>
                    {localize('Create one or upload one from your local drive or Google Drive.')}
                </div>
                <div className='load-recent__empty-expand' onClick={onExplanationToggle}>
                    {localize("Why can't I see my recent bots?")}
                </div>
                <div
                    className={classnames('load-recent__empty-explain', {
                        'load-recent__empty-explain--show': is_explanation_expand,
                    })}
                >
                    <div>
                        {localize("If you've recently used bots but don't see them in this list. It may because you:")}
                    </div>
                    <ol className='load-recent__explain-list'>
                        <li>{localize('1. Logged in from a different device')}</li>
                        <li>{localize('2. Logged in from a different browser')}</li>
                        <li>{localize('3. Cleared your browser cache')}</li>
                    </ol>
                </div>
            </div>
        )}
    </div>
);

const Local = ({
    closePreview,
    handleFileChange,
    is_open_button_loading,
    loaded_local_file,
    loadFileFromLocal,
    ...props
}) => {
    let file_input_ref = useRef(null);
    return (
        <div className='load-local__container'>
            <div
                className={classnames('load-local__preview', 'load__content-with-footer', {
                    'load-local__preview--hidden': !loaded_local_file,
                })}
            >
                <div className='load-local__preview-title'>{localize('Preview')}</div>
                <div id='load-local__scratch' className='load-local__preview-workspace'>
                    <div className='load-local__preview-close'>
                        <Icon icon={'IcCross'} onClick={closePreview} />
                    </div>
                    <WorkspaceControl {...props} />
                </div>
            </div>
            {!loaded_local_file ? (
                <>
                    <input
                        type='file'
                        ref={el => (file_input_ref = el)}
                        accept='.xml'
                        style={{ display: 'none' }}
                        onChange={e => handleFileChange(e, false)}
                    />
                    <div id='import_dragndrop' className='load-local__dragndrop'>
                        <Icon icon={'IcPc'} className='load-local__icon' size={116} />
                        <div className='load-local__title'>{localize('Drag your file here')}</div>
                        <div className='load-local__desc'>{localize('or, if you prefer...')}</div>
                        <Button
                            className='load-local__upload'
                            text={localize('Select a file from your device')}
                            onClick={() => file_input_ref.click()}
                            has_effect
                            primary
                            medium
                        />
                    </div>
                </>
            ) : (
                <div className='load-local__footer'>
                    <Button
                        className='load-local__footer-open'
                        text={localize('Open')}
                        onClick={loadFileFromLocal}
                        is_loading={is_open_button_loading}
                        has_effect
                        primary
                    />
                </div>
            )}
        </div>
    );
};

const GoogleDrive = ({ is_authorised, is_open_button_loading, onDriveConnect, onDriveOpen }) => (
    <div className='load-google-drive__container'>
        <Icon
            icon={'IcGoogleDrive'}
            className={classnames({
                'load-google-drive__icon--active': is_authorised,
                'load-google-drive__icon--disabled': !is_authorised,
            })}
            size={116}
        />
        <div className={classnames('load-google-drive__text', { 'load-google-drive__text--disabled': !is_authorised })}>
            {is_authorised ? localize('You are connected to Google Drive') : localize('Google Drive')}
        </div>
        {is_authorised ? (
            <div className='load-google-drive__buttons'>
                <Button
                    className='load-google-drive__open'
                    text={localize('Open')}
                    onClick={onDriveOpen}
                    is_loading={is_open_button_loading}
                    has_effect
                    primary
                />
                <Button
                    className='load-google-drive__disconnect'
                    text={localize('Disconnect')}
                    onClick={onDriveConnect}
                    has_effect
                    secondary
                />
            </div>
        ) : (
            <Button
                className='load-google-drive__connect'
                text={localize('Connect')}
                onClick={onDriveConnect}
                has_effect
                primary
            />
        )}
    </div>
);

const LoadModal = ({
    active_index,
    is_load_modal_open,
    onMount,
    onUnmount,
    setActiveTabIndex,
    toggleLoadModal,
    ...props
}) => (
    <Modal
        title={'Load Strategy'}
        className='modal--load'
        width='1050px'
        is_open={is_load_modal_open}
        toggleModal={toggleLoadModal}
        onMount={onMount}
        onUnmount={onUnmount}
    >
        <div className='load__container'>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top fit_content>
                <div label={localize('Recent')}>
                    <Recent {...props} />
                </div>
                <div label={localize('Local')}>
                    <Local {...props} />
                </div>
                <div label={localize('Google Drive')}>
                    <GoogleDrive {...props} />
                </div>
            </Tabs>
        </div>
    </Modal>
);

LoadModal.propTypes = {
    active_index: PropTypes.number,
    closePreview: PropTypes.func,
    is_explanation_expand: PropTypes.bool,
    getRecentFileIcon: PropTypes.func,
    getSaveType: PropTypes.func,
    handleFileChange: PropTypes.func,
    is_authorised: PropTypes.bool,
    is_load_modal_open: PropTypes.bool,
    is_open_button_loading: PropTypes.bool,
    loaded_local_file: PropTypes.object,
    loadFileFromLocal: PropTypes.func,
    loadFileFromRecent: PropTypes.func,
    onDriveConnect: PropTypes.func,
    onDriveOpen: PropTypes.func,
    onExplanationToggle: PropTypes.func,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    onZoomInOutClick: PropTypes.func,
    previewWorkspace: PropTypes.func,
    recent_files: PropTypes.array,
    selected_file_id: PropTypes.string,
    setActiveTabIndex: PropTypes.func,
    toggleLoadModal: PropTypes.func,
};

export default connect(({ load_modal, google_drive }) => ({
    active_index: load_modal.active_index,
    closePreview: load_modal.closePreview,
    is_explanation_expand: load_modal.is_explanation_expand,
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    handleFileChange: load_modal.handleFileChange,
    is_authorised: google_drive.is_authorised,
    is_load_modal_open: load_modal.is_load_modal_open,
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    loaded_local_file: load_modal.loaded_local_file,
    onExplanationToggle: load_modal.onExplanationToggle,
    onDriveConnect: load_modal.onDriveConnect,
    onDriveOpen: load_modal.onDriveOpen,
    onMount: load_modal.onMount,
    onUnmount: load_modal.onUnmount,
    onZoomInOutClick: load_modal.onZoomInOutClick,
    previewWorkspace: load_modal.previewWorkspace,
    recent_files: load_modal.recent_files,
    selected_file_id: load_modal.selected_file_id,
    setActiveTabIndex: load_modal.setActiveTabIndex,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(LoadModal);
