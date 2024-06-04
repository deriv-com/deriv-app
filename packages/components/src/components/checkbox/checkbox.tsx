import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';
import Text from '../text';

type TCheckBoxProps = Omit<React.HTMLProps<HTMLInputElement>, 'value' | 'label'> & {
    className?: string;
    classNameLabel?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    greyDisabled?: boolean;
    id?: string;
    label: string | React.ReactElement;
    label_font_size?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => void;
    value?: boolean;
    withTabIndex?: number;
    has_error?: boolean;
    label_line_height?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, TCheckBoxProps>(
    (
        {
            className,
            classNameLabel,
            disabled = false,
            id,
            label,
            label_font_size = 'xs',
            label_line_height = 'unset',
            defaultChecked,
            onChange, // This needs to be here so it's not included in `otherProps`
            value = false,
            withTabIndex = 0,
            greyDisabled = false,
            has_error = false,
            ...otherProps
        },
        ref
    ) => {
        const [checked, setChecked] = React.useState(defaultChecked || value);
        React.useEffect(() => {
            setChecked(defaultChecked || value);
        }, [value, defaultChecked]);

        const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
            e.persist();
            setChecked(!checked);
            onChange?.(e);
        };

        const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = e => {
            // Enter or space
            if (!disabled && (e.key === 'Enter' || e.keyCode === 32)) {
                onChange?.(e);
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
                <span>
                    <input
                        className='dc-checkbox__input'
                        type='checkbox'
                        id={id}
                        ref={ref}
                        disabled={disabled}
                        onChange={onInputChange}
                        checked={checked}
                        {...otherProps}
                    />
                    <span
                        className={classNames('dc-checkbox__box', {
                            'dc-checkbox__box--active': checked,
                            'dc-checkbox__box--disabled': disabled,
                            'dc-checkbox--grey-disabled': disabled && greyDisabled,
                        })}
                        tabIndex={withTabIndex}
                        onKeyDown={handleKeyDown}
                    >
                        {!!checked && <Icon icon='IcCheckmark' color='active' />}
                    </span>
                </span>
                <Text
                    size={label_font_size}
                    line_height={label_line_height}
                    className={classNames('dc-checkbox__label', classNameLabel, {
                        'dc-checkbox__label--error': has_error,
                    })}
                >
                    {label}
                </Text>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
