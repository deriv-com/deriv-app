import { DesktopWrapper, MobileWrapper, Modal, UILoader } from '@deriv/components';
import React from 'react';
import './launch-modal.scss';
import { observer } from '@deriv/stores';
import LaunchModalInfo from './launch-modal-info';
import ContinueButton from './launch-modal-continue-button';

type LaunchModalProps = {
    handleChange: () => void;
    open: boolean;
};

const LaunchModal = ({ handleChange, open }: LaunchModalProps) => (
    <React.Suspense fallback={<UILoader />}>
        <DesktopWrapper>
            <Modal has_close_icon={false} is_open={open} className='modal_root' height='440px' width='440px'>
                <Modal.Body>
                    <LaunchModalInfo />
                </Modal.Body>
                <ContinueButton handleOpen={handleChange} />
            </Modal>
        </DesktopWrapper>
        <MobileWrapper>
            <div className='launch-page-mobile'>
                <LaunchModalInfo />
                <ContinueButton handleOpen={handleChange} />
            </div>
        </MobileWrapper>
    </React.Suspense>
);

export default observer(LaunchModal);
