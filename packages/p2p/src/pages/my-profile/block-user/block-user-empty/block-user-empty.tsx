import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useDevice } from '@deriv-com/ui';

const BlockUserEmpty = () => {
    const { isDesktop } = useDevice();

    if (isDesktop) {
        return (
            <div className='block-user-empty' data-testid='dt_desktop_content'>
                <Icon className='block-user-empty__icon' icon='IcEmptyBlockedAdvertisers' height={128} width={128} />
                <Text className='block-user-empty__text' weight='bold'>
                    <Localize i18n_default_text='No one to show here' />
                </Text>
            </div>
        );
    }

    return (
        <div className='block-user-empty__mobile-content'>
            <Icon icon='IcEmptyBlockedAdvertisers' className='block-user-empty__icon' height={128} width={128} />
            <Text className='block-user-empty__text' weight='bold'>
                <Localize i18n_default_text='No one to show here' />
            </Text>
        </div>
    );
};

export default observer(BlockUserEmpty);
