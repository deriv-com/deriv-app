// TODO: This component is temporary and to be removed in the future releases
import React from 'react';
import { HintBox, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const ReduceOrderTimeBanner = () => {
    return (
        <HintBox
            className='p2p-my-ads__warning'
            icon='IcInfo'
            message={
                <Text as='p' size='xxxs' color='prominent' line_height='xs'>
                    <Localize i18n_default_text='New orders are now active for 1 hour only. Complete your order before it expires!' />
                </Text>
            }
            is_info
        />
    );
};

export default ReduceOrderTimeBanner;
