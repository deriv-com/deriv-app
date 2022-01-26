import classNames from 'classnames';
import React from 'react';

type FooterProps = {
    children: React.ReactNode;
    className: string;
};

const Footer = ({ children, className }: FooterProps) => (
    <div className={classNames('dc-mobile-drawer__footer', className)}>{children}</div>
);

export default Footer;
