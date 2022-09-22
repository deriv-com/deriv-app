import classNames from 'classnames';
import React from 'react';

type TTick = {
    is_on?: boolean;
};

type TTickProgress = {
    className: string;
    columns: number;
    value: number;
    rows: number;
    size: number;
};

const Tick = ({ is_on }: TTick) => {
    return (
        <div
            className={classNames('dc-tick-progress__tick', {
                'dc-tick-progress__tick--on': is_on,
            })}
        />
    );
};

const TickProgress = ({ className, rows = 2, columns = 5, size = 10, value = 0 }: Partial<TTickProgress>) => {
    return (
        <div
            className={classNames('dc-tick-progress', className)}
            style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
        >
            {new Array(size).fill(null).map((_, index) => {
                return <Tick is_on={index < value} key={index} />;
            })}
        </div>
    );
};

export default TickProgress;
