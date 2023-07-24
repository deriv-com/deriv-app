import React from 'react';
import classNames from 'classnames';

type TVerticalTabWrapper = {
    wrapper_ref: React.RefObject<HTMLDivElement>;
    className?: string;
};

const VerticalTabWrapper = ({ wrapper_ref, children, className }: React.PropsWithChildren<TVerticalTabWrapper>) => (
    <div ref={wrapper_ref} className={classNames('dc-vertical-tab__tab', className)}>
        {children}
    </div>
);

export default VerticalTabWrapper;
