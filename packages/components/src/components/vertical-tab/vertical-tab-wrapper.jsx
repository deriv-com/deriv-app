import classNames from 'classnames';
import React from 'react';

const VerticalTabWrapper = ({ children, className }) => (
    <div className={classNames('dc-vertical-tab__tab', className)}>{children}</div>
);

export default VerticalTabWrapper;
