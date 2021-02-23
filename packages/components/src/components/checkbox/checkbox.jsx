import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';
import Text from '../text';

const Checkbox = React.forwardRef(
    (
        {
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
        },
        ref
    ) => {
        const [checked, setChecked] = React.useState(defaultChecked || value);
        const input_ref = React.useRef();

        const setRef = el_input => {
            input_ref.current = el_input;
            if (ref) ref.current = el_input;
        };

        React.useEffect(() => {
            setChecked(defaultChecked || value);
        }, [value, defaultChecked]);

        const onInputChange = e => {
            e.persist();
            setChecked(!checked);
            onChange(e);
        };

        const handleKeyDown = e => {
            // Enter or space
            if (!disabled && (e.key === 'Enter' || e.keyCode === 32)) {
                onChange({ target: { name: input_ref.current.name, checked: !checked } });
                setChecked(!checked);
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
                    ref={setRef}
                    disabled={disabled}
                    onChange={onInputChange}
                    defaultChecked={checked}
                    value={value}
                    {...otherProps}
                />
                <span
                    className={classNames('dc-checkbox__box', {
                        'dc-checkbox__box--active': checked,
                        'dc-checkbox__box--disabled': disabled,
                    })}
                    {...(withTabIndex?.length > 0 ? { tabIndex: withTabIndex } : {})}
                    tabIndex='0'
                    onKeyDown={handleKeyDown}
                >
                    {!!checked && <Icon icon='IcCheckmark' color='active' />}
                </span>
                <Text size='xs' className={classNames('dc-checkbox__label', classNameLabel)}>
                    {label}
                </Text>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

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
