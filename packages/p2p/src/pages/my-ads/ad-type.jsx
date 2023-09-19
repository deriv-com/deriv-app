import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import { Text } from '@deriv/components';
import './ad-type.scss';

const AdType = ({ ad_pause_color, float_rate }) => {
    return (
        <div className='ad-type'>
            <Text as='span' className='ad-type__badge' color={ad_pause_color} line_height='xs' size='xxs'>
                {localize('Float')}
            </Text>
            <Text as='span' color={ad_pause_color} line_height='xxs' size='xxs'>
                {float_rate}%
            </Text>
        </div>
    );
};

AdType.propTypes = {
    ad_pause_color: PropTypes.string,
    float_rate: PropTypes.string,
};

export default AdType;
