import React from 'react';
import { DesktopWrapper, MobileWrapper, Modal, UILoader, Icon } from '@deriv/components';
import LaunchModalInfo from './launch-modal-info';
import LaunchModalButton from './launch-modal-button';
import './launch-modal.scss';

type LaunchModalProps = {
    handleChange: () => void;
    open: boolean;
    setShowDescription: (status: boolean) => void;
};

const LaunchModal = ({ handleChange, open, setShowDescription }: LaunchModalProps) => (
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
                <Modal.Body>
                    <LaunchModalInfo />
                </Modal.Body>
                <LaunchModalButton handleOpen={handleChange} setShowDescription={setShowDescription} />
            </Modal>
        </DesktopWrapper>
        <MobileWrapper>
            <div className='launch-page-mobile'>
                <LaunchModalInfo is_mobile />
                <LaunchModalButton handleOpen={handleChange} setShowDescription={setShowDescription} />
            </div>
        </MobileWrapper>
    </React.Suspense>
);

export default LaunchModal;
