import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import 'Components/buy-sell/rate-changed-modal.scss';

const RateChangedModal = ({ local_currency, should_show_rate_changed_popup, setShouldShowRateChangedPopup }) => (
    <Modal is_open={should_show_rate_changed_popup} toggleModal={setShouldShowRateChangedPopup} width={'440px'}>
        <div>
            <Text
                as='p'
                align='left'
                className='rate-changed-modal__message'
                size={isMobile() ? 'xxs' : 'xs'}
                line_height='s'
            >
                {`The ${local_currency} market rate has changed.`}
            </Text>
        </div>

        <div className='rate-changed-modal__button'>
            <Button onClick={setShouldShowRateChangedPopup} text={'Try again'} primary large />
        </div>
    </Modal>
);

export default RateChangedModal;
