import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const IdvUpdated = () => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiUpdated' className='icon' size={128} />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {localize('Your profile is updated')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {localize("We'll review your proof of identity again and will give you an update as soon as possible.")}
            </Text>
        </div>
    );
};

export default IdvUpdated;
