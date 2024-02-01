import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import './ProgressIndicator.scss';

type TProgressIndicator = {
    className?: string;
    value: number;
    total: number;
    style?: CSSProperties;
};

const ProgressIndicator = ({ className, value, total, style }: TProgressIndicator) => {
    return (
        <div className={clsx('p2p-v2-progress-indicator__container', className)} style={style}>
            <div className={clsx('p2p-v2-progress-indicator__bar')} style={{ width: `${(value / total) * 100}%` }} />
            <div className={'p2p-v2-progress-indicator__empty'} />
        </div>
    );
};

export default ProgressIndicator;
