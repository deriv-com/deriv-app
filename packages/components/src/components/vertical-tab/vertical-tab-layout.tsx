import React from 'react';
import classNames from 'classnames';

type TVerticalTabLayout = {
    is_full_width?: boolean;
};

const VerticalTabLayout = ({ children, is_full_width }: React.PropsWithChildren<TVerticalTabLayout>) => (
    <div
        className={classNames('dc-vertical-tab', {
            'dc-vertical-tab--full-screen': is_full_width,
        })}
    >
        {children}
    </div>
);

export default VerticalTabLayout;
