import React from 'react';

type HighlightProps = {
    has_rounded_button: boolean;
    highlight_color: string;
    left: number;
    width: unknown | number | string;
};

const Highlight = ({
    has_rounded_button,
    highlight_color = 'var(--button-toggle-secondary)',
    left,
    width,
}: HighlightProps) => {
    const border_radius_size = '4px';
    const highlight_style = {
        backgroundColor: highlight_color,
        left: 0,
        transform: `translate3d(${left}px, 0, 0)`,
        width,
    };

    if (has_rounded_button) {
        highlight_style.borderRadius = '4px';
    } else {
        Object.assign(highlight_style, {
            borderTopLeftRadius: left === 0 ? border_radius_size : 0,
            borderTopRightRadius: left === 0 ? 0 : border_radius_size,
            borderBottomLeftRadius: left === 0 ? border_radius_size : 0,
            borderBottomRightRadius: left === 0 ? 0 : border_radius_size,
        });
    }

    return <span style={highlight_style} className='dc-button-menu--highlight' />;
};

export { Highlight };
