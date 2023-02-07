import classNames from 'classnames';
import React from 'react';

type TTickProgress = {
    className?: string;
    columns?: number;
    value?: number | null;
    rows?: number;
    size?: number;
};

const Tick = ({ is_on }: { is_on?: boolean }) => {
    return (
        <div
            className={classNames('dc-tick-progress__tick', {
                'dc-tick-progress__tick--on': is_on,
            })}
        />
    );
};

const TickProgress = ({ className, rows = 2, columns = 5, size = 10, value = 0 }: TTickProgress) => {
    return (
        <div
            className={classNames('dc-tick-progress', className)}
            style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
        >
            {new Array(size).fill(null).map((_, index) => {
                return <Tick is_on={index < Number(value)} key={index} />;
            })}
        </div>
    );
};

export default TickProgress;
