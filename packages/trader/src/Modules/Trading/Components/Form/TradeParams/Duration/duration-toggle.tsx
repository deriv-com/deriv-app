import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

type TDurationToggle = {
    name: string;
    onChange: ({ target }: { target: { name: string; value: boolean } }) => void;
    value: boolean;
};

const DurationToggle = ({ name, onChange, value }: TDurationToggle) => {
    const toggle = () => {
        onChange({ target: { value: !value, name } });
    };
    const icon_className = classNames('advanced-simple-toggle__icon', 'select-arrow', {
        'advanced-simple-toggle__icon--active': value,
    });
    return (
        <button
            id={value ? 'dt_advanced_toggle' : 'dt_simple_toggle'}
            className='advanced-simple-toggle'
            onClick={toggle}
            aria-label={localize('Toggle between advanced and simple duration settings')}
        >
            <Icon icon='IcChevronDown' className={icon_className} />
        </button>
    );
};

export default DurationToggle;
