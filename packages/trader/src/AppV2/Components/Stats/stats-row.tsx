import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import clsx from 'clsx';

const StatsRow = ({
    rows,
    animationClass,
    isMovingTransition,
    className,
}: {
    rows: number[];
    animationClass?: string;
    isMovingTransition: boolean;
    className: string;
}) => {
    return (
        <>
            <div className={`${className}__stat`}>
                <Text size='sm' bold className={animationClass}>
                    {rows[0]}
                </Text>
            </div>
            <div
                className={clsx(`${className}__moving`, {
                    'slide-right': isMovingTransition,
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
