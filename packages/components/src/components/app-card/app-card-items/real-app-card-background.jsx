import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';

const RealAppCardBackground = ({ is_swap_free, variant }) => {
    const getSVGForegroundPath = () => {
        if (variant === 'default') {
            return isMobile() ? 'M0 0h272v12L0 30V0z' : 'M0 0h280v16L0 40V0z';
        }
        return 'M0 0h216v9L0 21V0z';
    };

    const getSVGbackgroundPath = () => {
        if (variant === 'default') {
            return isMobile() ? 'M0 0h272v12L0 44V0z' : 'M0 0h280v16L0 60V0z';
        }
        return 'M0 0h216v9L0 32V0z';
    };

    return (
        <svg className='dc-app-card__wrapper--real-background'>
            <path d={getSVGbackgroundPath()} fill={is_swap_free ? '#D8E4E6' : '#F0F0F0'} />
            <path d={getSVGForegroundPath()} fill={is_swap_free ? '#BDD2D5' : '#F9F9F9'} />
        </svg>
    );
};

RealAppCardBackground.propTypes = {
    is_swap_free: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'mini', 'micro']),
};

export default RealAppCardBackground;
