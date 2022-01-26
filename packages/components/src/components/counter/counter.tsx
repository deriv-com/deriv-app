import classNames from 'classnames';
import React from 'react';

type CounterProps = {
    className: string;
    count: number;
};

const Counter = ({ className, count }: CounterProps) => {
    return <div className={classNames('dc-counter', className)}>{count}</div>;
};

export default Counter;
