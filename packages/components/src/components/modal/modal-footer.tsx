import React from 'react';
import classNames from 'classnames';

type TFooter = {
    className: string;
    has_separator: boolean;
    is_bypassed: boolean;
};

const Footer = ({ children, className, has_separator, is_bypassed }: React.PropsWithChildren<Partial<TFooter>>) => {
    if (is_bypassed) return <React.Fragment>{children}</React.Fragment>;
    return (
        <div
            data-testid='dt_modal_footer'
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
