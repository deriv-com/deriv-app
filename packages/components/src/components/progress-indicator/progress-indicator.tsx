import classNames from 'classnames';
import React from 'react';

type TProgressIndicator = {
    className?: string;
    value: number;
    total: number;
    style?: React.CSSProperties;
};

const ProgressIndicator = ({ className, value, total, style }: TProgressIndicator) => {
    return (
        <div className={classNames('dc-progress-indicator__container', className)} style={style}>
            <div className={classNames('dc-progress-indicator__bar')} style={{ width: `${(value / total) * 100}%` }} />
            <div className={'dc-progress-indicator__empty'} />
        </div>
    );
};

export default ProgressIndicator;
