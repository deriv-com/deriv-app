import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';

const UnsupportedIconRow = () => (
    <div className='poi-icon-row'>
        <div className='poi-icon-row__icon-container'>
            <Icon icon='IcIdentityCard' size={90} />
            <p>{localize('Identity card')}</p>
            <p>{localize('Front and back')}</p>
        </div>
        <div className='poi-icon-row__icon-container'>
            <Icon icon='IcDrivingLicense' size={90} />
            <p>{localize('Driving license')}</p>
            <p>{localize('Front and back')}</p>
        </div>
        <div className='poi-icon-row__icon-container'>
            <Icon icon='IcPassport' size={90} />
            <p>{localize('Passport')}</p>
            <p>{localize('Face photo page')}</p>
        </div>
    </div>
);

export const Unsupported = () => (
    <IconMessageContent
        message={localize('Verify your identity')}
        text={
            <Localize
                i18n_default_text='To continue trading with us, you need to send us a copy of any one of these government-issued photo ID documents via <0>LiveChat</0>.'
                components={[
                    <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                ]}
            />
        }
        icon_row={<UnsupportedIconRow />}
    />
);
