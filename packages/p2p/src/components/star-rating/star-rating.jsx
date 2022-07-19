// TODO: Move to components package once we can install libraries there
import React from 'react';
import PropTypes from 'prop-types';
import { Rating } from 'react-simple-star-rating';
import { Icon } from '@deriv/components';

const StarRating = ({
    className,
    empty_star_color,
    empty_star_className,
    empty_star_icon,
    full_star_color,
    full_star_className,
    full_star_icon,
    initial_value,
    is_readonly = false,
    number_of_stars,
    onClick,
    rtl = false,
    should_allow_half_icon = true,
    should_allow_hover_effect = true,
    star_size,
}) => {
    const EmptyIcon = () => {
        if (!!empty_star_icon && typeof empty_star_icon === 'string') {
            return <Icon icon={empty_star_icon} size={star_size} />;
        }

        return <></>;
    };

    const FullIcon = () => {
        if (!!full_star_icon && typeof full_star_icon === 'string') {
            return <Icon icon={full_star_icon} size={star_size} />;
        }

        return <></>;
    };

    return (
        <Rating
            allowHalfIcon={should_allow_half_icon}
            allowHover={should_allow_hover_effect}
            className={className}
            emptyColor={empty_star_color}
            emptyClassName={empty_star_className}
            emptyIcon={<EmptyIcon />}
            fillColor={full_star_color}
            fullClassName={full_star_className}
            fullIcon={<FullIcon />}
            iconsCount={number_of_stars}
            initialValue={initial_value}
            onClick={onClick}
            readonly={is_readonly}
            rtl={rtl}
            size={star_size}
        />
    );
};

StarRating.propTypes = {
    className: PropTypes.string,
    empty_star_color: PropTypes.string,
    empty_star_className: PropTypes.string,
    empty_star_icon: PropTypes.string,
    full_star_color: PropTypes.string,
    full_star_className: PropTypes.string,
    full_star_icon: PropTypes.string,
    initial_value: PropTypes.number,
    is_readonly: PropTypes.bool,
    number_of_stars: PropTypes.number,
    onClick: PropTypes.func,
    rtl: PropTypes.bool,
    should_allow_half_icon: PropTypes.bool,
    should_allow_hover_effect: PropTypes.bool,
    star_size: PropTypes.number,
};

export default StarRating;
