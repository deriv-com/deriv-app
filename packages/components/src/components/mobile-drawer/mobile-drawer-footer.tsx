import classNames from 'classnames';
import React from 'react';

type TFooter = {
    className?: string;
};

const Footer = ({ children, className }: React.PropsWithChildren<TFooter>) => (
    <div className={classNames('dc-mobile-drawer__footer', className)}>{children}</div>
);

export default Footer;
