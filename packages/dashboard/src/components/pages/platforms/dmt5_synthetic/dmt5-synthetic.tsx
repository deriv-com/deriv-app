import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const DMT5Synthetic: React.FC = () => {
    return (
        <div className='dw-about-us'>
            <Text className='dw-about-us__text dw-about-us__title' as='h1' size='l' color='general' align='center'>
                {localize('DMT5 Synthetic')}
            </Text>
        </div>
    );
};

export default DMT5Synthetic;
