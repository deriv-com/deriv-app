import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import CorrectMessageModal from './correct-message-modal';
import FakeMessageModal from './fake-message-modal';

const WarningScamMessageContentInfo = () => (
    <div className='warning-scam-message--content__info'>
        <div className='warning-scam-message--content__info--title'>
            <Icon icon='IcAccountWebsite' className='warning-scam-message__website-icon' size={18} />
            <Text size='s' weight='bold'>
                <Localize i18n_default_text='Do not get lured to fake "Deriv" pages!' />
            </Text>
        </div>
        <Text size='xxs'>
            <Localize i18n_default_text='You may see links to websites with a fake Deriv login page where you’ll get scammed for your money.' />
        </Text>
        <div className='warning-scam-message--content__info--message'>
            <Icon icon={'IcAccountCross'} className='warning-scam-message__icon' size={18} />
            <Text size='s'>
                <Localize i18n_default_text='Do not trust and give away your credentials on fake websites, ads or emails.' />
            </Text>
        </div>
        <CorrectMessageModal />
        <FakeMessageModal />
    </div>
);

export default WarningScamMessageContentInfo;
