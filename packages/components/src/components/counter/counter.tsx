import classNames from 'classnames';
import React, { HTMLProps } from 'react';

type TCounterProps = HTMLProps<HTMLDivElement> & {
    count: number;
};
const Counter = ({ className, count }: TCounterProps) => {
    return <div className={classNames('dc-counter', className)}>{count}</div>;
};

export default Counter;
