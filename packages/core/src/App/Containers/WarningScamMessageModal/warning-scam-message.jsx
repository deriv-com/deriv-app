import React from 'react';
import { withRouter } from 'react-router';
import { Modal, DesktopWrapper, MobileWrapper, Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import WarningScamMessageModal from './warning-scam-message-modal';
import WarningScamMessageTitle from './warning-scam-message-title';
import WarningScamMessageContent from './warning-scam-message-content-info';
import WarningScamMessageCheckbox from './warning-scam-message-checkbox-content';
import { connect } from 'Stores/connect';
import './warning-scam-message-modal.scss';
import { PropTypes } from 'prop-types';

const WarningScamMessage = ({ is_logged_in, client_country }) => {
    const [read_message, setReadMessage] = React.useState(false);
    const [is_read, setIsRead] = React.useState(localStorage.getItem('readScamMessage') || false);

    const understoodMessage = () => setReadMessage(!read_message);

    const setLocalStorage = () => {
        setIsRead(!is_read);
        localStorage.setItem('readScamMessage', is_read);
    };

    if (is_logged_in && client_country === 'br' && !is_read) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={!is_read}
                        width='300px'
                        small
                    >
                        <WarningScamMessageModal>
                            <WarningScamMessageTitle />
                            <WarningScamMessageContent />
                            <WarningScamMessageCheckbox understandMessage={understoodMessage} />
                            <Button
                                primary
                                large
                                text={localize('OK, got it')}
                                onClick={setLocalStorage}
                                style={{ width: '85%' }}
                                is_disabled={!read_message}
                            />
                            <Icon
                                icon='IcAccountDontgetscam'
                                className='warning-scam-message__scam-message-icon'
                                size={200}
                            />
                        </WarningScamMessageModal>
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
                        <WarningScamMessageModal>
                            <WarningScamMessageTitle />
                            <WarningScamMessageContent />
                            <WarningScamMessageCheckbox understandMessage={understoodMessage} />
                            <Button
                                primary
                                large
                                className='warning-scam-message__button'
                                text={localize('OK, got it')}
                                onClick={setLocalStorage}
                                style={{ width: '85%' }}
                                is_disabled={!read_message}
                            />
                            <div>
                                <Icon
                                    icon='IcAccountDontgetscam'
                                    className='warning-scam-message__scam-message-icon'
                                    size={200}
                                />
                            </div>
                        </WarningScamMessageModal>
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
