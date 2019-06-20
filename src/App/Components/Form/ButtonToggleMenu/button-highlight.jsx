import PropTypes from 'prop-types';
import React     from 'react';

const Highlight = ({ left, width }) => {
    const border_radius_size = '4px';
    const left_offset        = (left < 110) ? 0 : left;
    const width_offset       = (width < 110) ? 111 : width;
    const highlight_style = {
        width                    : width_offset,
        left                     : 0,
        transform                : `translate3d(${left_offset}px, 0, 0)`,
        'borderTopLeftRadius'    : (left_offset === 0) ? border_radius_size : 0,
        'borderTopRightRadius'   : (left_offset === 0) ? 0 : border_radius_size ,
        'borderBottomLeftRadius' : (left_offset === 0) ? border_radius_size  : 0,
        'borderBottomRightRadius': (left_offset === 0) ? 0 : border_radius_size ,
    };

    return (
        <span style={highlight_style} className='button-menu--highlight' />
    );
};

Highlight.propTypes = {
    left : PropTypes.number,
    width: PropTypes.number,
};

export { Highlight };
