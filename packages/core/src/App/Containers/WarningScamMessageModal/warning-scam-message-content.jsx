import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getBrandName } from '@deriv/shared';
import CorrectMessageContent from './correct-message-content';
import FakeMessageContent from './fake-message-content';

const brandName = getBrandName();

const WarningScamMessageContent = ({ is_dark_mode_on }) => (
    <div
        className={
            is_dark_mode_on ? 'warning-scam-message--content__info--dark-mode' : 'warning-scam-message--content__info'
        }
    >
        <div className='warning-scam-message--content__info--title'>
            <Icon icon='IcAccountWebsite' className='warning-scam-message__website-icon' size={18} />
            <Text weight='bold'>
                <Localize i18n_default_text={`Do not get lured to fake "${brandName}" pages!`} />
            </Text>
        </div>
        <Text size='xxs' className='warning-scam-message__small-text-message'>
            <Localize
                i18n_default_text={`You may see links to websites with a fake ${brandName} login page where you’ll get scammed for your money.`}
            />
        </Text>
        <div className='warning-scam-message--content__info--message'>
            <Icon icon='IcAccountCross' className='warning-scam-message__icon' size={18} />
            <Text>
                <Localize i18n_default_text='Do not trust and give away your credentials on fake websites, ads or emails.' />
            </Text>
        </div>
        <CorrectMessageContent />
        <FakeMessageContent />
    </div>
);

export default WarningScamMessageContent;
