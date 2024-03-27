import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

const Step = ({ children = [], className }: PropsWithChildren<{ className?: string }>) => (
    <div className={clsx('p2p-v2-wizard__main-step', className)}>{children}</div>
);

export default Step;
