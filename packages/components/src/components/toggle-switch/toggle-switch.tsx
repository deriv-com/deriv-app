import * as React from 'react';
import classNames from 'classnames';

type TToggleSwitch = {
    className?: string;
    classNameButton?: string;
    classNameLabel?: string;
    handleToggle: () => void;
    id: string;
    is_enabled: boolean;
};

const ToggleSwitch = ({ className, classNameButton, classNameLabel, handleToggle, id, is_enabled }: TToggleSwitch) => {
    return (
        <React.Fragment>
            <input
                className={classNames('dc-toggle-switch', className)}
                id={id}
                type='checkbox'
                checked={is_enabled}
                onChange={handleToggle}
            />
            <label className={classNames('dc-toggle-switch__label', classNameLabel)} htmlFor={id}>
                <span className={classNames('dc-toggle-switch__button', classNameButton)} />
            </label>
        </React.Fragment>
    );
};

export default ToggleSwitch;
