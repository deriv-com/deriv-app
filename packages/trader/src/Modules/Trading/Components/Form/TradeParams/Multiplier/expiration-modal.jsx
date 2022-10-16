import React from 'react';
import { Button, Div100vhContainer, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import Expiration from './expiration.jsx';

const MultipliersExpirationModal = ({ is_open, enableApp, disableApp, toggleModal }) => {
    return (
        <React.Fragment>
            <Modal
                enableApp={enableApp}
                is_open={is_open}
                disableApp={disableApp}
                toggleModal={toggleModal}
                has_close_icon={false}
                should_header_stick_body={false}
                height='auto'
                width='calc(100vw - 3.2rem)'
                title={localize('Expiration')}
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <div style={{ minHeight: '120px', padding: '1.6rem' }}>
                        <Text size='xs' color='general'>
                            <Localize
                                i18n_default_text='Your contract will be closed automatically at the next available asset price on <0></0>.'
                                components={[<Expiration key={0} is_text_only text_size='xs' />]}
                            />
                        </Text>
                    </div>
                    <Modal.Footer has_separator>
                        <Button
                            style={{ width: '100%', height: '4rem' }}
                            large
                            primary
                            has_effect
                            text={localize('OK')}
                            onClick={toggleModal}
                        />
                    </Modal.Footer>
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
};

export default connect(({ ui }) => ({
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(MultipliersExpirationModal);
