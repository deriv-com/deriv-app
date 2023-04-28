import React from 'react';
import classNames from 'classnames';

type TBadgeSize = 'medium' | 'large';
type TBadgeSpacing = 'tight' | 'loose';
type TWeight = 'bold' | 'regular';
type TBackgroundColor = 'blue' | 'orange' | 'red' | 'gray';
type TRoundedCorners = 4 | 2;

interface Badge extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    color?: string;
    label: string;
    rounded_corners?: TRoundedCorners;
    size?: TBadgeSize;
    spacing?: TBadgeSpacing;
    weight?: TWeight;
}

interface BadgeContained extends Badge {
    type: 'contained';
    background_color: TBackgroundColor;
}

interface BadgeBordered extends Badge {
    type: 'bordered';
}

type BadgeProps = BadgeContained | BadgeBordered;

const Badge = (props: BadgeProps) => {
    const {
        className,
        color,
        label,
        rounded_corners = 4,
        size = 'medium',
        spacing = 'tight',
        type,
        weight = 'bold',
        ...rest
    } = props;

    const is_contained = type === 'contained';
    const is_bordered = type === 'bordered';

    const getBadgeStyles = () => {
        return classNames(
            'dc-badge',
            {
                'dc-badge--bold': weight === 'bold',
                'dc-badge--regular': weight === 'regular',
                'dc-badge--tight': spacing === 'tight',
                'dc-badge--loose': spacing === 'loose',
                'dc-badge__medium': size === 'medium',
                'dc-badge__large': size === 'large',
                'dc-badge--contained': is_contained,
                'dc-badge--bordered': is_bordered,
                'dc-badge--blue': is_contained && props.background_color === 'blue',
                'dc-badge--orange': is_contained && props.background_color === 'orange',
                'dc-badge--red': is_contained && props.background_color === 'red',
                'dc-badge--gray': is_contained && props.background_color === 'gray',
                'dc-badge--full-rounded': rounded_corners === 4,
                'dc-badge--two-rounded': rounded_corners === 2,
            },
            className
        );
    };

    rest.style = { ...rest.style, color: color || rest.style?.color };

    if (!label) return null;

    return (
        <span className={getBadgeStyles()} {...rest}>
            {label}
        </span>
    );
};

export default Badge;
