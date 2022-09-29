import React from 'react';
import { connect } from 'Stores/connect';
import { Modal, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router';
import './warning-scam-message-modal.scss';
import WarningScamMessageModal from './warning-scam-message-modal';

const WarningScamMessage = ({ is_warning_scam_message_modal_visible, setScamMessageLocalStorage }) => {
    const [is_message_read, setIsMessageRead] = React.useState(false);
    const toggleModal = () => false;

    const acknowledgeMessage = () => setIsMessageRead(!is_message_read);

    /* Check whether the account is logged_in, and client from country 'br' = Brazil, and have not yet read the scam message warning pop up */
    if (is_warning_scam_message_modal_visible) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        id='warning_scam_message_modal'
                        className='warning-scam-message-modal'
                        is_open={is_warning_scam_message_modal_visible}
                        small
                        toggleModal={toggleModal}
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setScamMessageLocalStorage}
                            is_message_read={!is_message_read}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={is_warning_scam_message_modal_visible}
                        small
                        toggleModal={toggleModal}
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setScamMessageLocalStorage}
                            is_message_read={!is_message_read}
                        />
                    </Modal>
                </MobileWrapper>
            </React.Fragment>
        );
    }
    
    return null;
};

WarningScamMessage.propTypes = {
    is_warning_scam_message_modal_visible: PropTypes.bool,
    setScamMessageLocalStorage: PropTypes.func,
};

export default connect(({ ui }) => ({
    is_warning_scam_message_modal_visible: ui.is_warning_scam_message_modal_visible,
    setScamMessageLocalStorage: ui.setScamMessageLocalStorage,
}))(withRouter(WarningScamMessage));
