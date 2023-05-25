import React from 'react';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { observer, useStore } from '@deriv/stores';
import classNames from 'classnames';

const EmptyOnboarding = observer(() => {
    const {
        ui: { is_mobile },
    } = useStore();

    return (
        <div className='empty-onboarding__wrapper'>
            <div
                className={classNames('empty-onboarding__header', {
                    'empty-onboarding__header--mobile': is_mobile,
                })}
            >
                <TradigPlatformIconProps icon='DerivLogo' />
            </div>
        </div>
    );
});

export default EmptyOnboarding;
