import classNames from 'classnames';
import React from 'react';

type TCounterProps = HTMLDivElement & {
    count: number;
};
const Counter = ({ className, count }: TCounterProps) => {
    return <div className={classNames('dc-counter', className)}>{count}</div>;
};

export default Counter;
