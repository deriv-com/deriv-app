import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import WarningScamMessageTitle from './warning-scam-message-title';
import WarningScamMessageContent from './warning-scam-message-content';
import WarningScamMessageCheckbox from './warning-scam-message-checkbox-content';

const WarningScamMessageModal = ({ acknowledgeMessage, setLocalStorage, is_message_read }) => (
    <div className='warning-scam-message'>
        <div className='warning-scam-message--content'>
            <WarningScamMessageTitle />
            <WarningScamMessageContent />
            <WarningScamMessageCheckbox acknowledgeMessage={acknowledgeMessage} />
            <Button
                primary
                large
                text={localize('OK, got it')}
                onClick={setLocalStorage}
                style={{ width: '85%' }}
                is_disabled={is_message_read}
            />
            <Icon icon='IcAccountDontGetScam' className='warning-scam-message__scam-message-icon' size={200} />
        </div>
    </div>
);

export default WarningScamMessageModal;
