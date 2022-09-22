import classNames from 'classnames';
import React from 'react';

type TLinearProgress = {
    progress: number;
    className: string;
    height: number;
};

export const LinearProgress = ({ progress }: Partial<TLinearProgress>) => (
    <div className={classNames('dc-linear-progress')}>
        <div className={classNames('dc-linear-progress__bar')} style={{ width: `${progress}%` }} />
    </div>
);
