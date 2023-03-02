import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/components';
import classNames from 'classnames';

export interface TBadgeProps extends HTMLAttributes<HTMLDivElement> {
    onClickHandler: () => void;
    class_names?: string;
    title: string;
}

const Badge = ({ title, class_names }: TBadgeProps) => {
    return (
        <div className={classNames('badge', class_names)}>
            <h1>BADGE</h1>
            <Text size='xs'>{title}</Text>
        </div>
    );
};

export default Badge;
