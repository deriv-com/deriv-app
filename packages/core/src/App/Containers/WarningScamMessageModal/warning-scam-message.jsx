import React from 'react';
import { connect } from 'Stores/connect';
import { Modal, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router';
import './warning-scam-message-modal.scss';
import WarningScamMessageModal from './warning-scam-message-modal';

const WarningScamMessage = ({
    is_logged_in,
    client_country,
    is_dark_mode_on,
    has_read_scam_message,
    setScamMessageLocalStorage,
}) => {
    // debugger;
    const [is_message_read, setIsMessageRead] = React.useState(false);

    const acknowledgeMessage = () => setIsMessageRead(!is_message_read);

    /* Check whether the account is logged_in, and client from country 'br' = Brazil, and have not yet read the scam message warning pop up */
    if (is_logged_in && client_country === 'br' && !has_read_scam_message) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        id='warning_scam_message_modal'
                        className='warning-scam-message-modal'
                        is_open={!has_read_scam_message}
                        width='30rem'
                        small
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setScamMessageLocalStorage}
                            is_message_read={!is_message_read}
                            is_dark_mode_on={is_dark_mode_on}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={!has_read_scam_message}
                        width='100vw'
                        small
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
    return <></>;
};

WarningScamMessage.propTypes = {
    client_country: PropTypes.string,
    is_logged_in: PropTypes.bool,
    is_dark_mode_on: PropTypes.bool,
    has_read_scam_message: PropTypes.bool,
    setScamMessageLocalStorage: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    client_country: client.website_status.clients_country,
    is_logged_in: client.is_logged_in,
    is_dark_mode_on: ui.is_dark_mode_on,
    has_read_scam_message: ui.has_read_scam_message,
    setScamMessageLocalStorage: ui.setScamMessageLocalStorage,
}))(withRouter(WarningScamMessage));
