import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import { Text } from '@deriv/components';
import './ad-type.scss';

const AdType = ({ float_rate, className }) => {
    return (
        <div className='ad-type'>
            <Text as='span' size='xxxs' weight='normal' line_height='xxs' className={className}>
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
