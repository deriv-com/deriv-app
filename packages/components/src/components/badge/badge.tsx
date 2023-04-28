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
                'dc-badge--contained': type === 'contained',
                'dc-badge--bordered': type === 'bordered',
                'dc-badge--blue': type === 'contained' && props.background_color === 'blue',
                'dc-badge--orange': type === 'contained' && props.background_color === 'orange',
                'dc-badge--red': type === 'contained' && props.background_color === 'red',
                'dc-badge--gray': type === 'contained' && props.background_color === 'gray',
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
