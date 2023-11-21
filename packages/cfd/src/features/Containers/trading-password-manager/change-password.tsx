import React from 'react';
import { Text, Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCFDPlatformLabel } from '@deriv/shared';
import { TChangePassword } from 'Containers/props.types';
import { CFD_PLATFORMS } from 'Helpers/cfd-config';

export const ChangePassword = ({ platform, onConfirm }: TChangePassword) => (
    <div className='cfd-change-password'>
        <Icon
            className='cfd-change-password__icon'
            icon={platform === CFD_PLATFORMS.MT5 ? 'IcMt5OnePassword' : 'IcDxtradeOnePassword'}
            width='122'
            height='108'
        />
        <Text as='p' align='center' weight='bold'>
            <Localize
                i18n_default_text='{{platform}} password'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <Text as='p' align='center' className='cfd-change-password__description' size='xs'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize i18n_default_text='Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.' />
            ) : (
                <Localize i18n_default_text='Use this password to log in to your Deriv X accounts on the web and mobile apps.' />
            )}
        </Text>
        <Button
            className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_cfd-reset-password-modal__button'
            onClick={onConfirm}
        >
            <Text size='xs' weight='bold' color='colored-background'>
                <Localize i18n_default_text='Change password' />
            </Text>
        </Button>
    </div>
);
