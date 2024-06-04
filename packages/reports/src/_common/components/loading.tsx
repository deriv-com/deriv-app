import classNames from 'classnames';
import React from 'react';

type TLoading = {
    className?: string;
    is_invisible?: boolean;
    theme?: string;
    id?: string;
    data_testid?: string;
};

const Loading = ({ className, is_invisible, theme, id, data_testid }: TLoading) => (
    <div
        id={id}
        data-testid={data_testid}
        className={classNames('barspinner', `barspinner--${theme || 'dark'}`, { invisible: is_invisible }, className)}
    >
        {Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`} />
        ))}
    </div>
);

export default Loading;
