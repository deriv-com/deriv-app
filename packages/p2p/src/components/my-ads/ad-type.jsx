import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import { Text } from '@deriv/components';
import './ad-type.scss';

const AdType = ({ float_rate }) => {
    return (
        <div className='ad-type'>
            <Text as='span' size='xxs' weight='normal' line_height='xs' className='ad-type__badge'>
                {localize('Float')}
            </Text>
            <Text as='span' size='xxs' weight='normal' line_height='xxs'>
                {float_rate}%
            </Text>
        </div>
    );
};

AdType.propTypes = {
    float_rate: PropTypes.string,
};

export default AdType;
