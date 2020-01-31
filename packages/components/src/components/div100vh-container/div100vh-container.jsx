import PropTypes from 'prop-types';
import React     from 'react';
import Div100vh  from 'react-div-100vh';

/* Div100vh is workaround for getting accurate height of 100vh from browsers on mobile,
    because using normal css vh is not returning correct screen height */
/* To adjust height using calculation, pass style props and use rvh unit instead vh,
    e.g - style={{ height: calc(100rvh - 100px )}}
*/
/* To manually remove rvh calculation and revert to default browser calculation use is_disabled */
const Div100vhContainer = ({ children, className, is_disabled, height_offset }) => {
    const height_style =  { height: height_offset ? `calc(100rvh - ${height_offset})` : 'calc(100rvh)' };
    return (
        <Div100vh className={className} style={ is_disabled ? {} : height_style }>
            {children}
        </Div100vh>
    );
};

Div100vhContainer.propTypes = {
    children     : PropTypes.any,
    height_offset: PropTypes.string,
    is_disabled  : PropTypes.bool,
};

export default Div100vhContainer;
