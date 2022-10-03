import classNames from 'classnames';
import React from 'react';
import Text from '../text';

// Todo: Create a utility type for getting a range of float number. ex: FloatRange<0, 1>
type TRangeFloatZeroToOne = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;

type TProgressBarProps = {
    className?: string;
    danger_limit?: TRangeFloatZeroToOne;
    label: string;
    value: TRangeFloatZeroToOne;
    warning_limit?: TRangeFloatZeroToOne;
};

const ProgressBar = ({ label, value, danger_limit = 0.2, warning_limit = 0.5, className }: TProgressBarProps) => {
    let status: 'danger' | 'warning' | 'normal' = 'normal';

    if (value <= danger_limit) {
        status = 'danger';
    } else if (value <= warning_limit) {
        status = 'warning';
    }

    return (
        <div className={classNames('dc-progress-bar__container', className)}>
            <Text as='p' color='prominent' align='center' size='xs' weight='bold' className='dc-progress-bar__label'>
                {label}
            </Text>
            <div
                className={classNames({ [`dc-progress-bar--${status}`]: status }, 'dc-progress-bar__bar')}
                style={{ width: `${value * 100}%` }}
            />
            <div className={classNames(`dc-progress-bar--${status}`, 'dc-progress-bar__empty')} />
        </div>
    );
};

export default ProgressBar;
