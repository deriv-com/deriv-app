import React from 'react';
import { Modal, Tabs, MobileFullPageModal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { tabs_title } from 'Constants/load-modal';
import GoogleDrive from './google-drive.jsx';
import Local from './local.jsx';
import Recent from './recent.jsx';

type LoadModalProps = {
    active_index: number;
    is_load_modal_open: boolean;
    is_mobile: boolean;
    loaded_local_file: string;
    onEntered: () => void;
    recent_strategies: unknown;
    setActiveTabIndex: () => void;
    toggleLoadModal: () => void;
};

const LoadModal = ({
    active_index,
    is_load_modal_open,
    is_mobile,
    loaded_local_file,
    onEntered,
    recent_strategies,
    setActiveTabIndex,
    tab_name,
    toggleLoadModal,
}: LoadModalProps) => {
    const header_text = localize('Load strategy');

    if (is_mobile) {
        return (
            <MobileFullPageModal
                is_modal_open={is_load_modal_open}
                className='load-strategy__wrapper'
                header={localize('Load strategy')}
                onClickClose={toggleLoadModal}
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

export default connect(({ load_modal, ui }) => ({
    active_index: load_modal.active_index,
    is_load_modal_open: load_modal.is_load_modal_open,
    is_mobile: ui.is_mobile,
    loaded_local_file: load_modal.loaded_local_file,
    onEntered: load_modal.onEntered,
    recent_strategies: load_modal.recent_strategies,
    setActiveTabIndex: load_modal.setActiveTabIndex,
    tab_name: load_modal.tab_name,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(LoadModal);
