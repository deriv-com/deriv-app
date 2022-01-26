import classNames from 'classnames';
import React from 'react';

type FooterProps = {
    children: React.ReactNode;
    className: string;
    has_separator: boolean;
    is_bypassed: boolean;
};

const Footer = ({ children, className, has_separator, is_bypassed }: FooterProps) => {
    if (is_bypassed) return children;
    return (
        <div
            className={classNames(
                'dc-modal-footer',
                {
                    'dc-modal-footer--separator': has_separator,
                },
                className
            )}
        >
            {children}
        </div>
    );
};

export default Footer;
