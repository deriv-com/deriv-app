import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { detectSafariBrowser } from '@deriv/shared';
import { Button, Text, Modal } from '@deriv/components';

export const SafariPushwooshNotification = ({ onClose, is_logged_in, forceSubscribe, isSubscribed }) => {
    const is_open = detectSafariBrowser && is_logged_in && isSubscribed;
    const [is_modal_open, setModalOpen] = React.useState(is_open);

    return (
        <Modal
            is_open={is_modal_open}
            should_header_stick_body
            title={
                <Localize i18n_default_text='<0>May we send you notifications?<0/>' components={[<strong key={0} />]} />
            }
            toggleModal={onClose}
            width='440px'
            has_close_icon={false}
        >
            <React.Fragment>
                <Text className='email-confirmation' size='xs'>
                    {localize(
                        "You'll receive marketing updates on Deriv's products and services. You can disable this at any time."
                    )}
                </Text>

                <Modal.Footer>
                    <Button onClick={() => setModalOpen(false)} has_effect text={localize('No')} secondary large />
                    <Button has_effect onClick={forceSubscribe} primary large>
                        <Localize i18n_default_text='Yes' />
                    </Button>
                </Modal.Footer>
            </React.Fragment>
        </Modal>
    );
};

export default connect(({ pushwoosh, client }) => ({
    forceSubscribe: pushwoosh.forceSubscribe,
    is_logged_in: client.is_logged_in,
    isSubscribed: pushwoosh.isSubscribed,
}))(SafariPushwooshNotification);
