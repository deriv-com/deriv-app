import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/components';

export interface TBadgeProps extends HTMLAttributes<HTMLDivElement> {
    class_names?: string;
    text: string;
    data_testid: string;
}

const Badge = React.forwardRef(({ text, className, color, data_testid, id }: TBadgeProps) => {
    return (
        <div
            className={classNames('dc-badge', className, {
                'dc-badge--active': color === 'active',
                'dc-badge--disabled': color === 'disabled',
                'dc-badge--secondary': color === 'secondary',
                'dc-badge--brand': color === 'brand',
                'dc-badge--black': color === 'black',
                'dc-badge--orange': color === 'orange',
            })}
            data-testid={data_testid}
            id={id}
        >
            <Text size='14px' line_height='20px'>
                {text}
            </Text>
        </div>
    );
});

Badge.displayName = 'Badge';

export default React.memo(Badge);
