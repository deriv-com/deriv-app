import React from 'react';
import classNames from 'classnames';

type TBadgeSize = 'medium' | 'large';
type TBadgeSpacing = 'tight' | 'loose';
type TWeight = 'bold' | 'regular';
type TType = 'contained' | 'bordered';
type TBackgroundColor = 'blue' | 'orange' | 'red' | 'gray';
type TRoundedCorners = 4 | 2;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    background_color?: TBackgroundColor;
    className?: string;
    color?: string;
    rounded_corners?: TRoundedCorners;
    size?: TBadgeSize;
    spacing?: TBadgeSpacing;
    type: TType;
    weight?: TWeight;
}

const Badge = ({
    background_color,
    children,
    className,
    color,
    weight = 'bold',
    rounded_corners = 4,
    size = 'medium',
    spacing = 'tight',
    type,
    ...props
}: React.PropsWithChildren<BadgeProps>) => {
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
                'dc-badge--blue': is_contained && background_color === 'blue',
                'dc-badge--orange': is_contained && background_color === 'orange',
                'dc-badge--red': is_contained && background_color === 'red',
                'dc-badge--gray': is_contained && background_color === 'gray',
                'dc-badge--full-rounded': rounded_corners === 4,
                'dc-badge--two-rounded': rounded_corners === 2,
            },
            className
        );
    };

    props.style = { ...props.style, color: color || props.style?.color };

    return (
        <span className={getBadgeStyles()} {...props}>
            {children}
        </span>
    );
};

export default Badge;
