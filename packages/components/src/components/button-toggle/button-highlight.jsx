import PropTypes from 'prop-types';
import React     from 'react';

const Highlight = ({ left, width }) => {
    const border_radius_size = '4px';
    const highlight_style = {
        width,
        left                     : 0,
        transform                : `translate3d(${left}px, 0, 0)`,
        'borderTopLeftRadius'    : (left === 0) ? border_radius_size : 0,
        'borderTopRightRadius'   : (left === 0) ? 0 : border_radius_size ,
        'borderBottomLeftRadius' : (left === 0) ? border_radius_size  : 0,
        'borderBottomRightRadius': (left === 0) ? 0 : border_radius_size ,
    };

    return (
        <span style={highlight_style} className='dc-button-menu--highlight' />
    );
};

Highlight.propTypes = {
    left : PropTypes.number,
    width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
};

export { Highlight };
