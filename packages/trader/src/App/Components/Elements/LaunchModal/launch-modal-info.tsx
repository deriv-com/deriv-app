import React from 'react';
import ImageTurbos from 'Assets/SvgComponents/trade_explanations/img-turbos.svg';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalInfo = () => {
    return (
        <div className='modal-content' data-testid='launch-modal'>
            <ImageTurbos className='modal-image' />
            <Text as='h1' weight='bold' align='center' size='sm'>
                <Localize i18n_default_text='Turbos — a new trade type for you!' />
            </Text>
            <Text as='p' align='center'>
                <Localize i18n_default_text='Express strong bullish or bearish views on the market. Try it out on your demo and real accounts.' />
            </Text>
        </div>
    );
};

export default LaunchModalInfo;
