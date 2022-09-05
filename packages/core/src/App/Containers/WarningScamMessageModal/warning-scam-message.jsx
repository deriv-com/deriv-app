import React from 'react';
import { connect } from 'Stores/connect';
import { Modal, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router';
import './warning-scam-message-modal.scss';
import WarningScamMessageModal from './warning-scam-message-modal';

const WarningScamMessage = ({ is_logged_in, client_country }) => {
    const [is_message_read, setIsMessageRead] = React.useState(false);
    const [is_read, setIsRead] = React.useState(localStorage.getItem('readScamMessage') || false);

    const acknowledgeMessage = () => setIsMessageRead(!is_message_read);

    const setLocalStorage = () => {
        setIsRead(!is_read);
        localStorage.setItem('readScamMessage', is_read);
    };

    if (is_logged_in && client_country === 'my' && !is_read) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={!is_read}
                        width='30rem'
                        small
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setLocalStorage}
                            is_message_read={!is_message_read}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={!is_read}
                        width='100vw'
                        small
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setLocalStorage}
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
};

export default connect(({ client }) => ({
    client_country: client.website_status.clients_country,
}))(withRouter(WarningScamMessage));
