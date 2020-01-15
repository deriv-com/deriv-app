import classnames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import {
    Button,
    Modal,
    Tabs,
    Icon,
}                       from '@deriv/components';
import { localize }     from '@deriv/translations';
import { connect }      from '../stores/connect';
import { timeSince }    from '../utils/tools';
import '../assets/sass/google-drive.scss';
import '../assets/sass/load-modal.scss';

const Recent = ({
    explaination_expand,
    getRecentFileIcon,
    loadFile,
    onExplainationToggle,
    onZoomInOutClick,
    previewWorkspace,
    recent_files,
    selected_file,
}) => (
    <div className='recent__container'>
        {
            recent_files.length ?
                <>
                    <div className='recent__content'>
                        <div className='recent__files'>
                            <div className='recent__title'>{localize('Recent')}</div>
                            <div className='recent__list'>
                                {
                                    recent_files.length &&
                                    recent_files.map(file => {
                                        return (
                                            <div
                                                className={classnames(
                                                    'recent__item',
                                                    { 'recent__item--selected': selected_file === file.id },
                                                )}
                                                key={file.id}
                                                onClick={() => previewWorkspace(file)}
                                            >
                                                <Icon icon={getRecentFileIcon(file.location)} />
                                                <div className='recent__item-text'>
                                                    <span className='recent__item-title'>{file.name}</span>
                                                    <span className='recent__item-time'>{timeSince(file.timestamp)}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className='recent__preview' >
                            <div className='recent__title'>{localize('Preview')}</div>
                            <div id='scratch_load' className='recent__preview-workspace' >
                                <div className='recent__preview-controls' >
                                    <Icon icon={'IcAddRounded'} className='recent__preview-icon' onClick={() => onZoomInOutClick(true)} />
                                    <Icon icon={'IcMinusRounded'} className='recent__preview-icon' onClick={() => onZoomInOutClick(false)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='recent__footer'>
                        <Button
                            className='recent__footer-open'
                            text={localize('Open')}
                            onClick={loadFile}
                            has_effect
                            primary
                        />
                    </div>
                </>
                :
                <div className='recent__empty'>
                    <Icon icon='IcEmptyFolder' className='recent__empty-icon' size={116} />
                    <span className='recent__empty-title'>{localize('You do not have any recent bots')}</span>
                    <span className='recent__empty-desc'>{localize('Create one or upload one from your local drive or Google Drive.')}</span>
                    <span className='recent__empty-expand' onClick={onExplainationToggle}>{localize('Why can\'t I see my recent bots?')}</span>
                    <div className={classnames(
                        'recent__empty-explain',
                        { 'recent__empty-explain--show': explaination_expand }
                    )}
                    >
                        <span>{localize('If you\'ve recently used bots but don\'t see them in this list. It may because you:')}</span>
                        <ol className='recent__explain-list'>
                            <li>{localize('1. Logged in from a different device')}</li>
                            <li>{localize('2. Logged in from a different browser')}</li>
                            <li>{localize('3. Cleared your browser cache')}</li>
                        </ol>
                    </div>
                </div>
        }
    </div>
);

const Local = () => (
    <p>Local</p>
);

const GoogleDrive = () => (
    <p>Google Drive</p>
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
            <Tabs
                active_index={active_index}
                onTabItemClick={setActiveTabIndex}
                top
            >
                <div label={localize('Recent')}>
                    <Recent {...props} />
                </div>
                <div label={localize('Local')} >
                    <Local />
                </div>
                <div label={localize('Google Drive')}>
                    <GoogleDrive />
                </div>
            </Tabs>
        </div>
    </Modal>
);

LoadModal.propTypes = {
    active_index        : PropTypes.number,
    explaination_expand : PropTypes.bool,
    getRecentFileIcon   : PropTypes.func,
    is_load_modal_open  : PropTypes.bool,
    loadFile            : PropTypes.func,
    onExplainationToggle: PropTypes.func,
    onMount             : PropTypes.func,
    onUnmount           : PropTypes.func,
    onZoomInOutClick    : PropTypes.func,
    previewWorkspace    : PropTypes.func,
    recent_files        : PropTypes.array,
    selected_file       : PropTypes.string,
    setActiveTabIndex   : PropTypes.func,
    toggleLoadModal     : PropTypes.func,
};

export default connect(({ load_modal }) => ({
    active_index        : load_modal.active_index,
    explaination_expand : load_modal.explaination_expand,
    getRecentFileIcon   : load_modal.getRecentFileIcon,
    is_load_modal_open  : load_modal.is_load_modal_open,
    loadFile            : load_modal.loadFile,
    onExplainationToggle: load_modal.onExplainationToggle,
    onMount             : load_modal.onMount,
    onUnmount           : load_modal.onUnmount,
    onZoomInOutClick    : load_modal.onZoomInOutClick,
    previewWorkspace    : load_modal.previewWorkspace,
    recent_files        : load_modal.recent_files,
    selected_file       : load_modal.selected_file,
    setActiveTabIndex   : load_modal.setActiveTabIndex,
    toggleLoadModal     : load_modal.toggleLoadModal,
}))(LoadModal);
