import React, { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

type TButtonGroupProps = {
    isFlex?: boolean;
    isFullWidth?: boolean;
    isVertical?: boolean;
};

const ButtonGroup: FC<PropsWithChildren<TButtonGroupProps>> = ({ children, isFlex, isFullWidth, isVertical }) => {
    return (
        <div
            className={classNames('grid gap-3 grid-cols-[minmax(0,1fr)] grid-flow-col', {
                'flex flex-col': isVertical,
                'grid-cols-': isFlex,
                'w-full': isFullWidth,
            })}
        >
            {children}
        </div>
    );
};

export default ButtonGroup;
