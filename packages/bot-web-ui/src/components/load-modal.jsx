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
    <div className='recent__preview-controls'>
        <Icon icon={'IcAddRounded'} className='recent__preview-icon' onClick={() => onZoomInOutClick(true)} />
        <Icon icon={'IcMinusRounded'} className='recent__preview-icon' onClick={() => onZoomInOutClick(false)} />
    </div>
);

const Recent = ({
    is_explanation_expand,
    getRecentFileIcon,
    getSaveType,
    loadFileFromRecent,
    onExplainationToggle,
    previewWorkspace,
    recent_files,
    selected_file_id,
    ...props
}) => (
    <div className='recent__container'>
        {recent_files.length ? (
            <>
                <div className='recent__content'>
                    <div className='recent__files load__content-with-footer'>
                        <div className='recent__title'>{localize('Recent')}</div>
                        <div className='recent__list'>
                            {recent_files.map(file => {
                                return (
                                    <div
                                        className={classnames('recent__item', {
                                            'recent__item--selected': selected_file_id === file.id,
                                        })}
                                        key={file.id}
                                        onClick={() => previewWorkspace(file.id)}
                                    >
                                        <div className='recent__item-text'>
                                            <span className='recent__item-title'>{file.name}</span>
                                            <span className='recent__item-time'>{timeSince(file.timestamp)}</span>
                                        </div>
                                        <div className='recent__item-location'>
                                            <Icon
                                                icon={getRecentFileIcon(file.save_type)}
                                                className={classnames({
                                                    'gd__icon--active': file.save_type === save_types.GOOGLE_DRIVE,
                                                })}
                                            />
                                            <div className='recent__item-saved'>{getSaveType(file.save_type)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='recent__preview load__content-with-footer'>
                        <div className='recent__title'>{localize('Preview')}</div>
                        <div id='scratch_recent' className='recent__preview-workspace'>
                            <WorkspaceControl {...props} />
                        </div>
                    </div>
                </div>
                <div className='recent__footer'>
                    <Button
                        className='recent__footer-open'
                        text={localize('Open')}
                        onClick={loadFileFromRecent}
                        has_effect
                        primary
                    />
                </div>
            </>
        ) : (
            <div className='recent__empty'>
                <Icon icon='IcEmptyFolder' className='recent__empty-icon' size={116} />
                <div className='recent__empty-title'>{localize('You do not have any recent bots')}</div>
                <div className='recent__empty-desc'>
                    {localize('Create one or upload one from your local drive or Google Drive.')}
                </div>
                <div className='recent__empty-expand' onClick={onExplainationToggle}>
                    {localize("Why can't I see my recent bots?")}
                </div>
                <div
                    className={classnames('recent__empty-explain', {
                        'recent__empty-explain--show': is_explanation_expand,
                    })}
                >
                    <span>
                        {localize("If you've recently used bots but don't see them in this list. It may because you:")}
                    </span>
                    <ol className='recent__explain-list'>
                        <li>{localize('1. Logged in from a different device')}</li>
                        <li>{localize('2. Logged in from a different browser')}</li>
                        <li>{localize('3. Cleared your browser cache')}</li>
                    </ol>
                </div>
            </div>
        )}
    </div>
);

const Local = ({ closePreview, handleFileChange, loaded_local_file, loadFileFromLocal, ...props }) => {
    let file_input_ref = useRef(null);
    return (
        <div className='local__container'>
            <div
                className={classnames('local__preview', 'load__content-with-footer', {
                    'local__preview--hidden': !loaded_local_file,
                })}
            >
                <div className='local__preview-title'>{localize('Preview')}</div>
                <div id='scratch_local' className='local__preview-workspace'>
                    <div className='local__preview-close'>
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
                    <div id='import_dragndrop' className='local__dragndrop'>
                        <Icon icon={'IcPc'} className='local__icon' size={116} />
                        <span className='local__title'>{localize('Drag your file here')}</span>
                        <span className='local__desc'>{localize('or, if you prefer...')}</span>
                        <Button
                            className='local__upload'
                            text={localize('Select a file from your device')}
                            onClick={() => file_input_ref.click()}
                            has_effect
                            primary
                            medium
                        />
                    </div>
                </>
            ) : (
                <div className='local__footer'>
                    <Button
                        className='local__footer-open'
                        text={localize('Open')}
                        onClick={loadFileFromLocal}
                        has_effect
                        primary
                    />
                </div>
            )}
        </div>
    );
};

const GoogleDrive = ({ is_authorised, onDriveConnect, onDriveOpen }) => (
    <div className='gd__container'>
        <Icon
            icon={'IcGoogleDrive'}
            className={classnames({
                'gd__icon--active': is_authorised,
                'gd__icon--disabled': !is_authorised,
            })}
            size={116}
        />
        <div className={classnames('gd__text', { 'gd__text--disabled': !is_authorised })}>
            {localize('Google Drive')}
        </div>
        {is_authorised ? (
            <div className='gd__buttons'>
                <Button
                    className='gd__disconnect'
                    text={localize('Disconnect')}
                    onClick={onDriveConnect}
                    has_effect
                    primary
                />
                <Button className='gd__open' text={localize('Open')} onClick={onDriveOpen} has_effect secondary />
            </div>
        ) : (
            <Button className='gd__connect' text={localize('Connect')} onClick={onDriveConnect} has_effect primary />
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
    loaded_local_file: PropTypes.object,
    loadFileFromLocal: PropTypes.func,
    loadFileFromRecent: PropTypes.func,
    onDriveConnect: PropTypes.func,
    onDriveOpen: PropTypes.func,
    onExplainationToggle: PropTypes.func,
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
    loadFileFromLocal: load_modal.loadFileFromLocal,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    loaded_local_file: load_modal.loaded_local_file,
    onExplainationToggle: load_modal.onExplainationToggle,
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
