import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Button,
    Modal,
    Tabs,
    Icon,
    MobileWrapper,
    Div100vhContainer,
    FadeWrapper,
    PageOverlay,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
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

const Recent = props => {
    const {
        getRecentFileIcon,
        getSaveType,
        is_explanation_expand,
        is_open_button_loading,
        loadFileFromRecent,
        previewWorkspace,
        recent_workspaces,
        selected_workspace_id,
        toggleExplanationExpand,
    } = props;

    if (recent_workspaces.length) {
        return (
            <div className='load-recent__container'>
                <div className='load-recent__content'>
                    <div className='load-recent__files load__content-with-footer'>
                        <div className='load-recent__title'>
                            <Localize i18n_default_text='Recent' />
                        </div>
                        <div className='load-recent__list'>
                            {recent_workspaces.map(workspace => {
                                return (
                                    <div
                                        className={classnames('load-recent__item', {
                                            'load-recent__item--selected': selected_workspace_id === workspace.id,
                                        })}
                                        key={workspace.id}
                                        onClick={() => previewWorkspace(workspace.id)}
                                    >
                                        <div className='load-recent__item-text'>
                                            <div className='load-recent__item-title'>{workspace.name}</div>
                                            <div className='load-recent__item-time'>
                                                {timeSince(workspace.timestamp)}
                                            </div>
                                        </div>
                                        <div className='load-recent__item-location'>
                                            <Icon
                                                icon={getRecentFileIcon(workspace.save_type)}
                                                className={classnames({
                                                    'load-google-drive__icon--active':
                                                        workspace.save_type === save_types.GOOGLE_DRIVE,
                                                })}
                                            />
                                            <div className='load-recent__item-saved'>
                                                {getSaveType(workspace.save_type)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='load-recent__preview load__content-with-footer'>
                        <div className='load-recent__title'>
                            <Localize i18n_default_text='Preview' />
                        </div>
                        <div id='load-recent__scratch' className='preview__workspace load-recent__preview-workspace'>
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
            </div>
        );
    }
    return (
        <div className='load-recent__container'>
            <div className='load-recent__empty'>
                <Icon icon='IcEmptyFolder' className='load-recent__empty-icon' size={116} />
                <div className='load-recent__empty-title'>
                    <Localize i18n_default_text='You do not have any recent bots' />
                </div>
                <div className='load-recent__empty-desc'>
                    <Localize i18n_default_text='Create one or upload one from your local drive or Google Drive.' />
                </div>
                <div className='load-recent__empty-expand' onClick={toggleExplanationExpand}>
                    <Localize i18n_default_text="Why can't I see my recent bots?" />
                </div>
                <div
                    className={classnames('load-recent__empty-explain', {
                        'load-recent__empty-explain--show': is_explanation_expand,
                    })}
                >
                    <div>
                        <Localize i18n_default_text="If you've recently used bots but don't see them in this list, it may be because you:" />
                    </div>
                    <ol className='load-recent__explain-list'>
                        <li>
                            <Localize i18n_default_text='1. Logged in from a different device' />
                        </li>
                        <li>
                            <Localize i18n_default_text='2. Logged in from a different browser' />
                        </li>
                        <li>
                            <Localize i18n_default_text='3. Cleared your browser cache' />
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

const Local = props => {
    const {
        handleFileChange,
        is_mobile,
        is_open_button_loading,
        loadFileFromLocal,
        loaded_local_file,
        toggleLoadModal,
    } = props;
    let file_input_ref = React.useRef(null);

    return (
        <div className='load-local__container'>
            <div
                className={classnames('load-local__preview', 'load__content-with-footer', {
                    'load-local__preview--hidden': !loaded_local_file,
                })}
            >
                <div className='load-local__preview-title'>
                    <Localize i18n_default_text='Preview' />
                </div>
                <div id='load-local__scratch' className='preview__workspace load-local__preview-workspace'>
                    {!is_mobile && (
                        <div className='load-local__preview-close'>
                            <Icon icon={'IcCross'} onClick={toggleLoadModal} />
                        </div>
                    )}
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
                        {is_mobile ? (
                            <Icon icon={'IcMobile'} className='load-local__icon' size={is_mobile ? 96 : 116} />
                        ) : (
                            <>
                                <Icon icon={'IcPc'} className='load-local__icon' size={is_mobile ? 96 : 116} />
                                <div className='load-local__title'>
                                    <Localize i18n_default_text='Drag your file here' />
                                </div>
                                <div className='load-local__desc'>
                                    <Localize i18n_default_text='or, if you prefer...' />
                                </div>
                            </>
                        )}
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
                    {is_mobile && (
                        <Button
                            className='load-recent__footer-open'
                            text={localize('Cancel')}
                            onClick={toggleLoadModal}
                            has_effect
                            secondary
                        />
                    )}
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

const GoogleDrive = ({ is_authorised, is_open_button_loading, onDriveConnect, onDriveOpen, is_mobile }) => (
    <div className='load-google-drive__container'>
        <Icon
            icon={'IcGoogleDrive'}
            className={classnames('load-google-drive__icon', {
                'load-google-drive__icon--disabled': !is_authorised,
            })}
            size={is_mobile ? 96 : 116}
        />
        <div className='load-google-drive__text'>
            {is_authorised ? <Localize i18n_default_text='You are connected to Google Drive' /> : 'Google Drive'}
        </div>
        {is_authorised ? (
            <div className='load-google-drive__buttons'>
                <Button
                    className='load-google-drive__disconnect'
                    text={localize('Disconnect')}
                    onClick={onDriveConnect}
                    has_effect
                    secondary
                    large
                />
                <Button
                    className='load-google-drive__open'
                    text={localize('Open')}
                    onClick={onDriveOpen}
                    is_loading={is_open_button_loading}
                    has_effect
                    primary
                    large
                />
            </div>
        ) : (
            <Button
                className='load-google-drive__connect'
                text={localize('Connect')}
                onClick={onDriveConnect}
                has_effect
                primary
                large
            />
        )}
    </div>
);

const LoadModal = props => {
    const {
        active_index,
        is_load_modal_open,
        is_mobile,
        onEntered,
        setActiveTabIndex,
        should_rerender_tabs,
        toggleLoadModal,
    } = props;
    const header_text = localize('Load strategy');

    if (is_mobile) {
        return (
            <FadeWrapper is_visible={is_load_modal_open} className='load__wrapper' keyname='save__wrapper'>
                <PageOverlay header={header_text} onClickClose={toggleLoadModal}>
                    <MobileWrapper>
                        <Div100vhContainer className='load__wrapper--is-mobile'>
                            <Tabs
                                active_index={active_index}
                                onTabItemClick={setActiveTabIndex}
                                should_delay_render={should_rerender_tabs}
                                top
                                fit_content
                                header_fit_content
                            >
                                <div label={localize('Local')}>
                                    <Local {...props} />
                                </div>
                                <div label='Google Drive'>
                                    <GoogleDrive {...props} />
                                </div>
                            </Tabs>
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </FadeWrapper>
        );
    }
    return (
        <Modal
            title={header_text}
            className='modal--load'
            width='1050px'
            is_open={is_load_modal_open}
            toggleModal={toggleLoadModal}
            onEntered={onEntered}
            elements_to_ignore={[document.querySelector('.injectionDiv')]}
        >
            <Tabs
                active_index={active_index}
                onTabItemClick={setActiveTabIndex}
                should_delay_render={should_rerender_tabs}
                top
                fit_content
                header_fit_content
            >
                <div label={localize('Recent')}>
                    <Recent {...props} />
                </div>
                <div label={localize('Local')}>
                    <Local {...props} />
                </div>
                <div label='Google Drive'>
                    <GoogleDrive {...props} />
                </div>
            </Tabs>
        </Modal>
    );
};

LoadModal.propTypes = {
    active_index: PropTypes.number,
    getRecentFileIcon: PropTypes.func,
    getSaveType: PropTypes.func,
    handleFileChange: PropTypes.func,
    is_authorised: PropTypes.bool,
    is_explanation_expand: PropTypes.bool,
    is_load_modal_open: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_open_button_loading: PropTypes.bool,
    loadFileFromLocal: PropTypes.func,
    loadFileFromRecent: PropTypes.func,
    loaded_local_file: PropTypes.object,
    onDriveConnect: PropTypes.func,
    onDriveOpen: PropTypes.func,
    onEntered: PropTypes.func,
    toggleExplanationExpand: PropTypes.func,
    onZoomInOutClick: PropTypes.func,
    previewWorkspace: PropTypes.func,
    recent_workspaces: PropTypes.array,
    selected_workspace_id: PropTypes.string,
    setActiveTabIndex: PropTypes.func,
    should_rerender_tabs: PropTypes.bool,
    toggleLoadModal: PropTypes.func,
};

export default connect(({ load_modal, google_drive, ui }) => ({
    active_index: load_modal.active_index,
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    handleFileChange: load_modal.handleFileChange,
    is_authorised: google_drive.is_authorised,
    is_explanation_expand: load_modal.is_explanation_expand,
    is_load_modal_open: load_modal.is_load_modal_open,
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    loaded_local_file: load_modal.loaded_local_file,
    onDriveConnect: load_modal.onDriveConnect,
    onDriveOpen: load_modal.onDriveOpen,
    onEntered: load_modal.onEntered,
    toggleExplanationExpand: load_modal.toggleExplanationExpand,
    onZoomInOutClick: load_modal.onZoomInOutClick,
    previewWorkspace: load_modal.previewWorkspace,
    recent_workspaces: load_modal.recent_workspaces,
    selected_workspace_id: load_modal.selected_workspace_id,
    setActiveTabIndex: load_modal.setActiveTabIndex,
    should_rerender_tabs: load_modal.should_rerender_tabs,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(LoadModal);
