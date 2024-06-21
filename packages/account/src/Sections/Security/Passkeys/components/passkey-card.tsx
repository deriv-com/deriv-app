import React from 'react';
import { Dropdown, Icon, Text } from '@deriv/components';
import { getLongDate } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TOnPasskeyMenuClick, TPasskey } from '../passkeys';
import { PASSKEY_STATUS_CODES, passkeysMenuActionEventTrack } from '../passkeys-configs';

type TPasskeyCard = TPasskey & { onPasskeyMenuClick: TOnPasskeyMenuClick };

export const PasskeyCard = ({ name, last_used, stored_on, id, icon, onPasskeyMenuClick }: TPasskeyCard) => {
    const handleManagePasskey = (event: { target: { value: string } }) => {
        if (event.target.value === 'rename') {
            onPasskeyMenuClick(PASSKEY_STATUS_CODES.RENAMING, {
                id,
                name,
            });
            passkeysMenuActionEventTrack('passkey_rename_open');
        } else if (event.target.value === 'revoke') {
            // TODO: add action for revoke passkey
        }
    };

    return (
        <div className='passkeys-card'>
            <Icon icon='IcPasskey' size={24} />
            <div className='passkeys-card__passkey-name'>
                <Text as='p' weight='bold' line_height='l'>
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
                        <Localize i18n_default_text='Last used: ' />{' '}
                        {last_used ? getLongDate(last_used) : <Localize i18n_default_text='Never' />}
                    </Text>
                </div>
                {icon && <Icon icon={icon} size={24} className='passkeys-card__passkey-type-icon' />}
            </div>
            <Dropdown
                is_align_text_left
                list={[
                    {
                        text: localize('Rename'),
                        value: 'rename',
                    },
                    {
                        text: localize(''),
                        value: '',
                        disabled: true,
                    },
                    // TODO: remove empty option when 'revoke' is implemented. Empty option is needed for proper working dropdown
                    // {
                    //     text: localize('Revoke'),
                    //     value: 'revoke',
                    // },
                ]}
                onChange={handleManagePasskey}
                suffix_icon='IcMenuDots'
                suffix_icon_size={24}
            />
        </div>
    );
};
