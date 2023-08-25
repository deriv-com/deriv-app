import * as React from 'react';
import classNames from 'classnames';

type TPopupFooter = {
    has_separator: boolean;
};

const PopupFooter = ({ children, has_separator }: React.PropsWithChildren<TPopupFooter>) => (
    <div
        className={classNames('dc-popup-footer', {
            'dc-popup-footer__separator': has_separator,
        })}
    >
        {children}
    </div>
);

export default PopupFooter;
