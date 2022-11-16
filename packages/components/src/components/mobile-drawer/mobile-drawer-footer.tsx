import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

type TFooter = {
    className?: string;
};

const Footer = ({ children, className }: React.PropsWithChildren<TFooter>) => (
    <div className={classNames('dc-mobile-drawer__footer', className)}>{children}</div>
);

Footer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Footer;
