import React from 'react';
import PropTypes from 'prop-types';
import { ContentExpander } from '@deriv/components';

const AccountWrapper = ({ children, header, is_visible, toggleVisibility }) => (
    <ContentExpander
        className='acc-switcher'
        title={header}
        is_expanded={is_visible}
        onToggle={toggleVisibility}
        is_title_spaced
    >
        {children}
    </ContentExpander>
);

AccountWrapper.propTypes = {
    children: PropTypes.node,
    header: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    is_visible: PropTypes.bool,
    toggleVisibility: PropTypes.func,
};

export default AccountWrapper;
