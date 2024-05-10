import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

const PhoneNumberVerifiedModal = () => {
    const [should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal] = React.useState(false);

    return (
        <Modal className='phone-verification__verified-modal' is_open={should_show_phone_number_verified_modal}>
            <Modal.Body>
                <div className='phone-verification__verified-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Verification successful' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text="That's it! Your number is verified." />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='phone-verification__verified-modal--buttons'>
                    <Button
                        color='black'
                        fullWidth
                        size='lg'
                        onClick={() => setShouldShowPhoneNumberVerifiedModal(false)}
                    >
                        <Text color='white' bold>
                            <Localize i18n_default_text='Done' />
                        </Text>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PhoneNumberVerifiedModal;
