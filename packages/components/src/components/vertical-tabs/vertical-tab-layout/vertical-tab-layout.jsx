import React      from 'react';
import classNames from 'classnames';

const VerticalTabLayout = ({ children, is_full_width }) => (
    <div
        className={classNames('vertical-tab', {
            'vertical-tab--full-screen': is_full_width,
        })}
    >
        {children}
    </div>
);

export { VerticalTabLayout };
