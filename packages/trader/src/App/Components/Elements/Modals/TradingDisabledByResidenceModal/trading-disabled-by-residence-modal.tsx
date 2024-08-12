import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { MobileDialog, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TradingDisabledByResidenceModalContent } from './trading-disabled-by-residence-modal-content';
import './trading-disabled-by-residence-modal.scss';

const TradingDisabledByResidenceModal = observer(() => {
    const { isMobile } = useDevice();
    const { ui } = useStore();
    const { is_trading_disabled_by_residence_modal_visible, setIsTradingDisabledByResidenceModal } = ui;

    const onCloseModal = () => {
        setIsTradingDisabledByResidenceModal(false);
    };

    return (
        <React.Fragment>
            {isMobile ? (
                <MobileDialog
                    visible={is_trading_disabled_by_residence_modal_visible}
                    portal_element_id='modal_root'
                    onClose={onCloseModal}
                    title=''
                    has_full_height
                >
                    <TradingDisabledByResidenceModalContent />
                </MobileDialog>
            ) : (
                <Modal
                    is_open={is_trading_disabled_by_residence_modal_visible}
                    title=' '
                    toggleModal={onCloseModal}
                    width='440px'
                    has_close_icon
                    should_header_stick_body={false}
                >
                    <TradingDisabledByResidenceModalContent />
                </Modal>
            )}
        </React.Fragment>
    );
});

export default TradingDisabledByResidenceModal;
