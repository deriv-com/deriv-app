import React from 'react';
import ImageTurbos from 'Assets/SvgComponents/trade_explanations/img-turbos.svg';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalInfo = ({ is_mobile }: { is_mobile?: boolean }) => {
    return (
        <div className='modal_content' data-testid='launch-modal'>
            <ImageTurbos className='modal_image' viewBox={is_mobile ? '0 0 328 164' : '56 18 216 128'} />
            <Text as='h1' weight='bold' align='center' size={is_mobile ? 'xsm' : 'sm'}>
                <Localize i18n_default_text='Turbos — a new trade type for you!' />
            </Text>
            <Text as='p' align='center'>
                <Localize i18n_default_text='Power up your market view.' />
            </Text>
            <Text as='p' align='center'>
                <Localize i18n_default_text='High potential payout. Limited risk.' />
            </Text>
            <Text as='p' align='center'>
                <Localize i18n_default_text='Available on both demo and real accounts.' />
            </Text>
        </div>
    );
};

export default LaunchModalInfo;
