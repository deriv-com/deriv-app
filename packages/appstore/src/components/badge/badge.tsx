import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/components';
import classNames from 'classnames';
import './badge.scss';

export interface TBadgeProps extends HTMLAttributes<HTMLDivElement> {
    class_names?: string;
    title: string;
}

const Badge = ({ title, class_names }: TBadgeProps) => {
    return (
        <div className={classNames('dc-badge', class_names)}>
            <Text weight='bold' color={'white'} size='14px'>
                {title}
            </Text>
        </div>
    );
};

export default Badge;
