import classNames from 'classnames';
import React      from 'react';

const VerticalTabWrapper = ({ children, className }) => (
    <div className={classNames('vertical-tab__tab', className)}>
        {children}
    </div>
);

export { VerticalTabWrapper };
