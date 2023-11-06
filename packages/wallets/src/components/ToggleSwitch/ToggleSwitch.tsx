import React, { InputHTMLAttributes } from 'react';
import './ToggleSwitch.scss';

interface ToggleSwitchProps {
    onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
    value: boolean;
}

const ToggleSwitch = ({ onChange, value }: ToggleSwitchProps) => {
    return (
        <label className='wallets-toggle-switch'>
            <input checked={value} onChange={onChange} type='checkbox' />
            <span className='wallets-toggle-switch__slider' />
        </label>
    );
};

export default ToggleSwitch;
