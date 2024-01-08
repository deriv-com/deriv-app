import React, { useState } from 'react';
import clsx from 'clsx';
import './MyProfileStatsItem.scss';

type MyProfileStatsItemProps = {
    currency?: string;
    label: string;
    onClickLifetime?: (isLifetimeClicked: boolean) => void;
    shouldShowDuration?: boolean;
    shouldShowLifetime?: boolean;
    value: string;
};
const MyProfileStatsItem = ({
    currency,
    label,
    onClickLifetime,
    shouldShowDuration = true,
    shouldShowLifetime,
    value,
}: MyProfileStatsItemProps) => {
    const [hasClickedLifetime, setHasClickedLifetime] = useState(false);

    return (
        <div className='p2p-v2-my-profile-stats__item'>
            <span>
                {label}{' '}
                {shouldShowDuration && (
                    <button
                        className={clsx(
                            'p2p-v2-my-profile-stats__item--inactive',
                            !hasClickedLifetime && shouldShowLifetime && 'p2p-v2-my-profile-stats__item--active'
                        )}
                        onClick={() => {
                            setHasClickedLifetime(false);
                            onClickLifetime?.(false);
                        }}
                    >
                        30d
                    </button>
                )}{' '}
                {shouldShowLifetime && (
                    <>
                        |{' '}
                        <button
                            className={clsx(
                                'p2p-v2-my-profile-stats__item--inactive',
                                hasClickedLifetime && 'p2p-v2-my-profile-stats__item--active'
                            )}
                            onClick={() => {
                                setHasClickedLifetime(true);
                                onClickLifetime?.(true);
                            }}
                        >
                            lifetime
                        </button>
                    </>
                )}
            </span>
            <span>
                <strong>
                    {value} {currency}
                </strong>
            </span>
        </div>
    );
};

export default MyProfileStatsItem;
