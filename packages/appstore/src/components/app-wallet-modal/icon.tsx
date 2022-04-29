import React, { SVGAttributes } from 'react';
export interface IconProps extends SVGAttributes<HTMLOrSVGElement> {
    custom_color?: string;
    icon?: string;
}

const Icon = ({ custom_color, icon, height = 16, width = 16, ...props }: IconProps) => {
    return (
        <svg
            width={width}
            height={height}
            xmlnsXlink='http://www.w3.org/1999/xlink'
            xmlns='http://www.w3.org/2000/svg'
            style={{ fill: custom_color }}
            {...props}
        >
            <use xlinkHref={`./modal/${icon}.svg#${icon}`} />
        </svg>
    );
};

export default Icon;
