import React from 'react';
import PropTypes from 'prop-types';
import Theme from './theme.jsx';

const Wrapper = ({ children, is_dark, is_block, is_full_width, inner_styles }) => {
    const styles = {
        display: is_block ? 'block' : 'flex',
        justifyContent: 'center',
        maxWidth: is_full_width ? 'none' : '300px',
        margin: '0 auto',
        padding: '30px 15px',
    };

    return (
        <Theme is_dark={is_dark}>
            <div style={inner_styles || styles}>{children}</div>
        </Theme>
    );
};
Wrapper.propTypes = {
    is_dark: PropTypes.bool,
    inner_styles: PropTypes.object,
};

export default Wrapper;
