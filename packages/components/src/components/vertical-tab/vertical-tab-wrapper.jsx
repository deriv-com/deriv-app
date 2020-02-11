import classNames from 'classnames';
import React from 'react';

const VerticalTabWrapper = ({ wrapper_ref, children, className }) => (
    <div ref={wrapper_ref} className={classNames('dc-vertical-tab__tab', className)}>
        {children}
    </div>
);

export default VerticalTabWrapper;
