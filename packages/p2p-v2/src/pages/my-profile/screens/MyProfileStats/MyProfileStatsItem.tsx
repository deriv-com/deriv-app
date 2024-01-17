import React, { useState } from 'react';
import clsx from 'clsx';
import './MyProfileStatsItem.scss';

type TMyProfileStatsItemProps = {
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
}: TMyProfileStatsItemProps) => {
    const [hasClickedLifetime, setHasClickedLifetime] = useState(false);

    const onClickLabel = (showLifetime: boolean) => {
        setHasClickedLifetime(showLifetime);
        onClickLifetime?.(showLifetime);
    };

    return (
        <div className='p2p-v2-my-profile-stats__item'>
            <span>
                {label}{' '}
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
