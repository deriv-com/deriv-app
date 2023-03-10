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
                'dc-badge--green': color === 'white',
                'dc-badge--purple': color === 'white',
            })}
            data-testid={data_testid}
            id={id}
        >
            <div>
                <Text size='xs' line_height='20px' weight='bold' color='white'>
                    {text}
                </Text>
            </div>
        </div>
    );
});

Badge.displayName = 'Badge';

export default React.memo(Badge);
