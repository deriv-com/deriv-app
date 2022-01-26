import React from 'react';
import classNames from 'classnames';

const VerticalTabLayout = ({ children, is_full_width }) => (
    <div
        className={classNames('dc-vertical-tab', {
            'dc-vertical-tab--full-screen': is_full_width,
        })}
    >
        {children}
    </div>
);

export default VerticalTabLayout;
