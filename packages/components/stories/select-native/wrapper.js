import React from 'react';
import PropTypes from 'prop-types';
import Theme from '../shared/theme';

const styles = {
    display: 'flex',
    maxWidth: '300px',
    margin: '0 auto',
    padding: '30px 15px',
};

const Wrapper = ({ children, is_dark }) => (
    <Theme is_dark={is_dark}>
        <div style={styles}>{children}</div>
    </Theme>
);

Wrapper.propTypes = {
    is_dark: PropTypes.bool,
    children: PropTypes.oneOf([PropTypes.object, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};
export default Wrapper;
