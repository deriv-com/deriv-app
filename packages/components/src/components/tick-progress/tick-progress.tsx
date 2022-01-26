import classNames from 'classnames';
import React from 'react';

type TickProgressProps = {
    className: string;
    columns: number;
    value: number;
    rows: number;
    size: number;
};

const Tick = ({ is_on }) => {
    return (
        <div
            className={classNames('dc-tick-progress__tick', {
                'dc-tick-progress__tick--on': is_on,
            })}
        />
    );
};

const TickProgress = ({ className, rows, columns, size, value }: TickProgressProps) => {
    return (
        <div
            className={classNames('dc-tick-progress', className)}
            style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
        >
            {new Array(size).fill(null).map((item, index) => {
                return <Tick is_on={index < value} key={index} />;
            })}
        </div>
    );
};

TickProgress.defaultProps = {
    columns: 5,
    rows: 2,
    size: 10,
    value: 0,
};

export default TickProgress;
