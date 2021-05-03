import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PopupFooter = ({ children, has_separator }) => (
    <div
        className={classNames('dc-popup-footer', {
            'dc-popup-footer__separator': has_separator,
        })}
    >
        {children}
    </div>
);

PopupFooter.propTypes = {
    children: PropTypes.node,
    has_separator: PropTypes.bool,
};

export default PopupFooter;
