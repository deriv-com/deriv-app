import classNames from 'classnames';
import React from 'react';

export const LinearProgress = ({ progress }) => (
    <div className={classNames('dc-linear-progress')}>
        <div className={classNames('dc-linear-progress__bar')} style={{ width: `${progress}%` }} />
    </div>
);
