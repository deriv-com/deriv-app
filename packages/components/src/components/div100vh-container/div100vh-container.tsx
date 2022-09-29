import React, { PropsWithChildren } from 'react';
import { use100vh } from 'react-div-100vh';

type TDiv100vhContainerProps = {
    id?: string;
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
    is_bypassed = false, // to bypass usage of component altogether, pass it
    is_disabled = false, // To manually remove use100vh() calculation and revert to default browser calculation pass it
    id,
    height_offset,
    max_autoheight_offset,
}: PropsWithChildren<TDiv100vhContainerProps>) => {
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
