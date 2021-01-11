import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ children }) => {
    return <div>{children}</div>;
};

Footer.propTypes = {
    children: PropTypes.node,
};

export default Footer;
