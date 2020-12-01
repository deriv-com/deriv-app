import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const Checkbox = ({
    className,
    classNameLabel,
    disabled,
    id,
    label,
    defaultChecked,
    onChange, // This needs to be here so it's not included in `otherProps`
    value,
    withTabIndex,
    ...otherProps
}) => {
    const [checked, setChecked] = React.useState(defaultChecked || value);

    React.useEffect(() => {
        setChecked(value);
    }, [value]);

    const onInputChange = e => {
        e.persist();
        setChecked(!checked);
        onChange(e);
    };

    const handleKeyDown = e => {
        // Enter or space
        if (e.key === 'Enter' || e.keyCode === 32) {
            setChecked(!checked);
            onChange();
        }
    };

    return (
        <label
            htmlFor={id}
            onClick={e => e.stopPropagation()}
            className={classNames('dc-checkbox', className, {
                'dc-checkbox--disabled': disabled,
            })}
        >
            <input
                className='dc-checkbox__input'
                type='checkbox'
                id={id}
                onChange={onInputChange}
                defaultChecked={checked}
                {...otherProps}
            />
            <span
                className={classNames('dc-checkbox__box', {
                    'dc-checkbox__box--active': checked,
                    'dc-checkbox__box--disabled': disabled,
                })}
                {...(withTabIndex?.length > 0 ? { tabIndex: withTabIndex } : {})}
                onKeyDown={handleKeyDown}
            >
                {!!checked && <Icon icon='IcCheckmark' color='active' />}
            </span>
            <span className={classNames('dc-checkbox__label', classNameLabel)}>{label}</span>
        </label>
    );
};

Checkbox.propTypes = {
    className: PropTypes.string,
    classNameLabel: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    value: PropTypes.bool,
    withTabIndex: PropTypes.string,
};

export default Checkbox;
