import classNames from 'classnames';
import React from 'react';

type TLinearProgress = {
    progress: number;
    className?: string;
};

export const LinearProgress = ({ progress, className }: TLinearProgress) => (
    <div className={classNames('dc-linear-progress', className)}>
        <div className='dc-linear-progress__bar' style={{ width: `${progress}%` }} />
    </div>
);
