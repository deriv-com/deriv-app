import React, { ChangeEvent, forwardRef } from 'react';
import './ToggleSwitch.scss';

interface ToggleSwitchProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: boolean;
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(({ onChange, value }, ref) => (
    <label className='p2p-v2-toggle-switch'>
        <input checked={value} onChange={onChange} ref={ref} type='checkbox' />
        <span className='p2p-v2-toggle-switch__slider' />
    </label>
));

ToggleSwitch.displayName = 'ToggleSwitch';
export default ToggleSwitch;
