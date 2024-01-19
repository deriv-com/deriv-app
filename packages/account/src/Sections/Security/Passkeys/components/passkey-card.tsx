import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getLongDate } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TPasskeyCard = {
    id: number;
    name: string;
    last_used_at: number;
    created_at?: number;
    stored_on?: string;
    icon?: string;
};

const PasskeyCard = ({ name, last_used_at, created_at, stored_on, icon }: TPasskeyCard) => {
    //TODO: add revoke and rename flow as the next step
    // const [is_menu_open, setIsMenuOpen] = React.useState(false);

    return (
        <div className='passkeys-card__wrapper'>
            <Icon icon='IcPasskey' size={24} />
            <div>
                <Text as='p' color='general' weight='bold' line_height='l'>
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
                {icon && <Icon icon={icon} size={24} className='passkeys-card__passkey-type-icon' />}
            </div>
            {/*revoke and rename flow will be implemented in the next step*/}
            {/*<Icon icon='IcContextMenu' size={24} />*/}
        </div>
    );
};

export default PasskeyCard;
