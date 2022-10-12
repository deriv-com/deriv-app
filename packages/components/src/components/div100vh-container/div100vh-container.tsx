import React, { PropsWithChildren } from 'react';
import Div100vh from 'react-div-100vh';

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
    const height_rule = height_offset ? `calc(100rvh - ${height_offset})` : 'calc(100rvh)';
    const height_style = {
        height: max_autoheight_offset ? null : height_rule,
        maxHeight: max_autoheight_offset ? `calc(100rvh - ${max_autoheight_offset})` : null,
    };
    if (is_bypassed) return children;
    return (
        <Div100vh id={id} className={className} style={is_disabled ? {} : height_style}>
            {children}
        </Div100vh>
    );
};

export default Div100vhContainer;
