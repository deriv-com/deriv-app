import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@deriv/components';

const AccountWrapper = ({ children, header, is_visible, toggleVisibility }) => (
    <React.Fragment>
        <div className={classNames('acc-switcher', { 'acc-info--show': !is_visible })} onClick={toggleVisibility}>
            <span className='acc-switcher__list-title'>{header}</span>
            <Icon icon='IcChevronDown' className='acc-info__select-arrow acc-info__select-arrow--invert' />
        </div>
        {is_visible && <React.Fragment>{children}</React.Fragment>}
    </React.Fragment>
);

AccountWrapper.propTypes = {
    children: PropTypes.node,
    header: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    is_visible: PropTypes.bool,
    toggleVisibility: PropTypes.func,
};

export default AccountWrapper;
