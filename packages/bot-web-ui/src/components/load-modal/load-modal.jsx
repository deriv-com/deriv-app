import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Tabs, MobileFullPageModal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { tabs_title } from 'Constants/load-modal';
import GoogleDrive from './google-drive.jsx';
import Local from './local.jsx';
import Recent from './recent.jsx';
import { isMobile } from '@deriv/shared';

const LoadModal = ({
    active_index,
    is_load_modal_open,
    loaded_local_file,
    onEntered,
    recent_strategies,
    setActiveTabIndex,
    tab_name,
    toggleLoadModal,
    setPreviewOnPopup,
}) => {
    const header_text = localize('Load strategy');

    if (isMobile()) {
        return (
            <MobileFullPageModal
                is_modal_open={is_load_modal_open}
                className='load-strategy__wrapper'
                header={localize('Load strategy')}
                onClickClose={() => {
                    setPreviewOnPopup(false);
                    toggleLoadModal();
                }}
                height_offset='80px'
                page_overlay
            >
                <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            title={header_text}
            className='load-strategy'
            width='1000px'
            height='80vh'
            is_open={is_load_modal_open}
            toggleModal={toggleLoadModal}
            onEntered={onEntered}
            elements_to_ignore={[document.querySelector('.injectionDiv')]}
        >
            <Modal.Body>
                <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top header_fit_content>
                    <div label={localize('Recent')}>
                        <Recent />
                    </div>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </Modal.Body>
            {loaded_local_file && tab_name === tabs_title.TAB_LOCAL && (
                <Modal.Footer has_separator>
                    <Local.Footer />
                </Modal.Footer>
            )}
            {recent_strategies.length > 0 && tab_name === tabs_title.TAB_RECENT && (
                <Modal.Footer has_separator>
                    <Recent.Footer />
                </Modal.Footer>
            )}
        </Modal>
    );
};

LoadModal.propTypes = {
    active_index: PropTypes.number,
    is_load_modal_open: PropTypes.bool,
    loaded_local_file: PropTypes.string,
    onEntered: PropTypes.func,
    recent_strategies: PropTypes.array,
    setActiveTabIndex: PropTypes.func,
    toggleLoadModal: PropTypes.func,
    setPreviewOnPopup: PropTypes.func,
};

export default connect(({ load_modal, dashboard }) => ({
    active_index: load_modal.active_index,
    is_load_modal_open: load_modal.is_load_modal_open,
    loaded_local_file: load_modal.loaded_local_file,
    onEntered: load_modal.onEntered,
    recent_strategies: load_modal.recent_strategies,
    setActiveTabIndex: load_modal.setActiveTabIndex,
    tab_name: load_modal.tab_name,
    toggleLoadModal: load_modal.toggleLoadModal,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
}))(LoadModal);
