import React, { ReactNode } from 'react';
import { use100vh } from 'react-div-100vh';

/* use100vh() hook is workaround for getting accurate height of 100vh from browsers on mobile (it returns height as a number in browser and undefined in Node),
    because using normal css vh is not returning correct screen height */
/* To manually remove use100vh() calculation and revert to default browser calculation use is_disabled */
/* To bypass usage of component altogether, use is_bypassed */

type TDiv100vhContainerProps = {
    id?: string;
    children: ReactNode;
    height_offset?: string;
    is_bypassed: boolean;
    is_disabled: boolean;
    max_height_offset?: string;
    className?: string;
    max_autoheight_offset?: string;
};

const Div100vhContainer = ({
    children,
    className,
    is_bypassed = false,
    is_disabled = false,
    id,
    height_offset,
    max_autoheight_offset,
}: TDiv100vhContainerProps) => {
    const screen_vertical_height = use100vh();
    const height = screen_vertical_height ? `${screen_vertical_height}px` : '100vh';
    const height_rule = height_offset ? `calc(${height} - ${height_offset})` : `calc(${height})`;

    const height_style = max_autoheight_offset
        ? { maxHeight: `calc(100vh - ${max_autoheight_offset})` }
        : { height: height_rule };

    if (is_bypassed) return children;
    return (
        <div id={id} className={className} style={is_disabled ? {} : height_style}>
            {children}
        </div>
    );
};

export default Div100vhContainer;
