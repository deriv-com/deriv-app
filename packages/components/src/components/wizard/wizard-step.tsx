import React from 'react';
import classNames from 'classnames';

const Step = ({ children = [], className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={classNames('wizard__main-step', className)}>{children}</div>
);

export default Step;
