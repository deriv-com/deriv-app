import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getLongDate } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TPasskeyCard = {
    id: number;
    name: string;
    last_used_at: number;
    created_at: number;
    stored_on?: string;
    icon: string;
};

const PasskeyCard = ({ name, last_used_at, created_at, stored_on, icon }: TPasskeyCard) => {
    return (
        <div className='passkeys-card__wrapper'>
            <Icon icon={icon} size={24} />
            <div>
                <Text as='p' color='general' weight='bold'>
                    {name}
                </Text>
                {stored_on && (
                    <div>
                        <Text as='p' size='xs'>
                            <Localize i18n_default_text='Stored on: ' /> {stored_on}
                        </Text>
                    </div>
                )}
                <div>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='Last used: ' /> {getLongDate(last_used_at)}
                    </Text>
                </div>
                <Icon icon='IcFingerprint' size={24} />
            </div>
            <Icon icon='IcContextMenu' size={24} />
        </div>
    );
};

export default PasskeyCard;
