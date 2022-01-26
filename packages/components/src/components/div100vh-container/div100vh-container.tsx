import React from 'react';
import Div100vh from 'react-div-100vh';

type Div100vhContainerProps = {
    id: string;
    children: React.ReactNode;
    height_offset: string;
    is_bypassed: boolean;
    is_disabled: boolean;
    max_height_offset: string;
};

/* Div100vh is workaround for getting accurate height of 100vh from browsers on mobile,
    because using normal css vh is not returning correct screen height */
/* To adjust max-height using calculation when using height: auto (or no rvh units), pass style props and use rvh unit instead vh,
        e.g - style={{ maxHeight: calc(100rvh - 100px )}}
    */
/* To adjust height using calculation, pass style props and use rvh unit instead vh,
    e.g - style={{ height: calc(100rvh - 100px )}}
*/
/* To manually remove rvh calculation and revert to default browser calculation use is_disabled */
/* To bypass usage of component altogether, use is_bypassed */
const Div100vhContainer = ({
    children,
    className,
    is_bypassed,
    is_disabled,
    id,
    height_offset,
    max_autoheight_offset,
}: Div100vhContainerProps) => {
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
