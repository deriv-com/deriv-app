import * as React from 'react';
import classNames from 'classnames';

type PopupFooterProps = {
    children: React.ReactNode;
    has_separator: boolean;
};

const PopupFooter = ({ children, has_separator }: PopupFooterProps) => (
    <div
        className={classNames('dc-popup-footer', {
            'dc-popup-footer__separator': has_separator,
        })}
    >
        {children}
    </div>
);

export default PopupFooter;
