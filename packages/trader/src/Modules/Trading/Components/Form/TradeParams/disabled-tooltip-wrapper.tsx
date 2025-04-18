import React from 'react';
import { Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import './disabled-tooltip-wrapper.scss';

type TDisabledTooltipWrapperProps = {
    is_disabled: boolean;
    children: React.ReactNode;
};

const DisabledTooltipWrapper = ({ is_disabled, children }: TDisabledTooltipWrapperProps) => {
    if (!is_disabled) {
        return <>{children}</>;
    }

    return (
        <Popover alignment='left' message={localize('Parameters are disabled when you have an open position.')}>
            <div className='disabled-tooltip-wrapper'>{children}</div>
        </Popover>
    );
};

export default DisabledTooltipWrapper;
