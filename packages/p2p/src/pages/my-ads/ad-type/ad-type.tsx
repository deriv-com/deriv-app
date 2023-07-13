import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TAdTypeProps = {
    ad_pause_color: string;
    float_rate: string;
};

const AdType = ({ ad_pause_color, float_rate }: TAdTypeProps) => {
    return (
        <div className='ad-type'>
            <Text as='span' className='ad-type__badge' color={ad_pause_color} line_height='xs' size='xxs'>
                <Localize i18n_default_text='Float' />
            </Text>
            <Text as='span' color={ad_pause_color} line_height='xxs' size='xxs'>
                {float_rate}%
            </Text>
        </div>
    );
};

export default AdType;
