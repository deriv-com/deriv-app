import React from 'react';
import PropTypes from 'prop-types';
import Theme from './theme.jsx';

const styles = {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '300px',
    margin: '0 auto',
    padding: '30px 15px',
};

const Wrapper = ({ children, is_dark, inner_styles = styles }) => (
    <Theme is_dark={is_dark}>
        <div style={inner_styles}>{children}</div>
    </Theme>
);

Wrapper.propTypes = {
    is_dark: PropTypes.bool,
    inner_styles: PropTypes.object,
};

export default Wrapper;
