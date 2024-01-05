import React from 'react';
import { DesktopWrapper, MobileWrapper, Modal, UILoader, Icon } from '@deriv/components';
import LaunchModalInfo from './launch-modal-info';
import LaunchModalButton from './launch-modal-button';
import './launch-modal.scss';

type LaunchModalProps = {
    handleChange: () => void;
    open: boolean;
};

const LaunchModal = ({ handleChange, open }: LaunchModalProps) => (
    <React.Suspense fallback={<UILoader />}>
        <DesktopWrapper>
            <Modal
                is_open={open}
                className='launch-modal-root'
                height='440px'
                width='440px'
                toggleModal={handleChange}
                should_close_on_click_outside
                portalId='launch_modal_root'
            >
                <button onClick={handleChange} className='dc-modal-header__close'>
                    <Icon icon='IcCross' data_testid='dt_modal_close_icon' />
                </button>
                <Modal.Body>
                    <LaunchModalInfo />
                </Modal.Body>
                <LaunchModalButton handleOpen={handleChange} />
            </Modal>
        </DesktopWrapper>
        <MobileWrapper>
            <div className='launch-page-mobile'>
                <LaunchModalInfo />
                <LaunchModalButton handleOpen={handleChange} />
            </div>
        </MobileWrapper>
    </React.Suspense>
);

export default LaunchModal;
