import React from 'react';
import classNames from 'classnames';

type TSeparatorContainerLineProps = {
    className?: string;
};

const SeparatorContainerLine = ({ className }: TSeparatorContainerLineProps) => (
    <div className={classNames(className, 'separator-container-line')} data-testid='dt_separator_container_line' />
);

export default SeparatorContainerLine;
