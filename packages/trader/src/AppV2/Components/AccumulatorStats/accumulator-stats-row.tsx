import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import clsx from 'clsx';

const StatsRow = ({
    rows,
    animation_class,
    is_moving_transaction,
    className,
}: {
    rows: number[];
    animation_class?: string;
    is_moving_transaction: boolean;
    className: string;
}) => {
    return (
        <>
            <div className={`${className}__stat`}>
                <Text size='sm' bold className={animation_class} data-testid='accumulator-first-stat'>
                    {rows[0]}
                </Text>
            </div>
            <div
                className={clsx(`${className}__moving`, {
                    'slide-right': is_moving_transaction,
                })}
            >
                {rows.slice(1)?.map((el: number, i: number) => (
                    <div key={i + 1} className={`${className}__stat`}>
                        <Text size='sm'>{el}</Text>
                    </div>
                ))}
            </div>
        </>
    );
};

export default StatsRow;
