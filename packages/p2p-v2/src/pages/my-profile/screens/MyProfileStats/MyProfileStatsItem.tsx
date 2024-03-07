import React, { useState } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import './MyProfileStatsItem.scss';

type TMyProfileStatsItemProps = {
    currency?: string;
    label: string;
    onClickLifetime?: (isLifetimeClicked: boolean) => void;
    shouldShowDuration?: boolean;
    shouldShowLifetime?: boolean;
    testId?: string;
    value: string;
};
const MyProfileStatsItem = ({
    currency,
    label,
    onClickLifetime,
    shouldShowDuration = true,
    shouldShowLifetime,
    testId,
    value,
}: TMyProfileStatsItemProps) => {
    const [hasClickedLifetime, setHasClickedLifetime] = useState(false);

    const onClickLabel = (showLifetime: boolean) => {
        setHasClickedLifetime(showLifetime);
        onClickLifetime?.(showLifetime);
    };

    return (
        <div className='p2p-v2-my-profile-stats__item' data-testid={testId}>
            <div>
                <Text size='sm'>{label} </Text>
                {shouldShowDuration && (
                    <button
                        className={clsx('p2p-v2-my-profile-stats__item--inactive', {
                            'p2p-v2-my-profile-stats__item--active': !hasClickedLifetime && shouldShowLifetime,
                        })}
                        onClick={() => onClickLabel(false)}
                    >
                        30d
                    </button>
                )}{' '}
                {shouldShowLifetime && (
                    <>
                        |{' '}
                        <button
                            className={clsx('p2p-v2-my-profile-stats__item--inactive', {
                                'p2p-v2-my-profile-stats__item--active': hasClickedLifetime,
                            })}
                            onClick={() => onClickLabel(true)}
                        >
                            lifetime
                        </button>
                    </>
                )}
            </div>
            <Text size='sm' weight='bold'>
                {value} {currency}
            </Text>
        </div>
    );
};

export default MyProfileStatsItem;
