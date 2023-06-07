import classNames from 'classnames';
import * as React from 'react';

type TSeparatorContainerLineProps = {
    className?: string;
    is_invisible?: boolean;
};

const SeparatorContainerLine = ({ className, is_invisible = false }: TSeparatorContainerLineProps) => (
    <div
        className={classNames(className, 'separator-container-line', {
            'separator-container-line--invisible': is_invisible,
        })}
        data-testid='dt_separator_container_line'
    />
);

export default SeparatorContainerLine;
