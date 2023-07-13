import React from 'react';
import { Rating } from 'react-simple-star-rating';
import { Icon } from '@deriv/components';

type TStarRatingProps = {
    className?: string;
    empty_star_className: string;
    empty_star_color?: string;
    empty_star_icon: string;
    full_star_className: string;
    full_star_color?: string;
    full_star_icon: string;
    initial_value?: number;
    is_readonly?: boolean;
    number_of_stars: number;
    onClick?: () => void;
    rating_value: number;
    rtl?: boolean;
    should_allow_half_icon?: boolean;
    should_allow_hover_effect?: boolean;
    star_size: number;
};

const StarRating = ({
    className,
    empty_star_color,
    empty_star_className,
    empty_star_icon,
    full_star_color,
    full_star_className,
    full_star_icon,
    initial_value = 0,
    is_readonly = false,
    number_of_stars,
    onClick,
    rating_value,
    rtl = false,
    should_allow_half_icon = true,
    should_allow_hover_effect = true,
    star_size,
}: TStarRatingProps) => {
    // Converts initial value to be in the form of x.0 or x.5
    // to show full and half stars only
    const fractionalized_value = Math.round(initial_value * 2) / 2;

    return (
        <Rating
            allowHalfIcon={should_allow_half_icon}
            allowHover={should_allow_hover_effect}
            className={className}
            emptyColor={empty_star_color}
            emptyClassName={empty_star_className}
            emptyIcon={empty_star_icon ? <Icon icon={empty_star_icon} size={star_size} /> : <></>}
            fillColor={full_star_color}
            fullClassName={full_star_className}
            fullIcon={full_star_icon ? <Icon icon={full_star_icon} size={star_size} /> : <></>}
            iconsCount={number_of_stars}
            initialValue={fractionalized_value}
            onClick={onClick}
            ratingValue={rating_value}
            readonly={is_readonly}
            rtl={rtl}
            size={star_size}
        />
    );
};

export default React.memo(StarRating);
