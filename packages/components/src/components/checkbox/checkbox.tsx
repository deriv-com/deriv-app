import classNames from 'classnames';
import React, { MouseEventHandler, HTMLProps } from 'react';
import Icon from '../icon';
import Text from '../text';

type TCheckBoxProps = Omit<HTMLProps<HTMLInputElement>, 'value'> & {
    className: string;
    classNameLabel: string;
    defaultChecked: boolean;
    disabled: boolean;
    greyDisabled: boolean;
    id: string;
    label: string; //or object : packages/p2p/src/components/order-details/order-details-confirm-modal.jsx
    onChange: MouseEventHandler;
    value: boolean;
    withTabIndex: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, TCheckBoxProps>(
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
            greyDisabled = false,
            ...otherProps
        },
        ref
    ) => {
        const [checked, setChecked] = React.useState<boolean>(defaultChecked || value);
        React.useEffect(() => {
            setChecked(defaultChecked || value);
        }, [value, defaultChecked]);

        const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
            e.persist();
            setChecked(!checked);
            onChange(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> & { keyCode: number }): void => {
            // Enter or space
            if (!disabled && (e.key === 'Enter' || e.keyCode === 32)) {
                onChange(e);
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
                    ref={ref}
                    disabled={disabled}
                    onChange={onInputChange}
                    defaultChecked={checked}
                    checked={value}
                    {...otherProps}
                />
                <span
                    className={classNames('dc-checkbox__box', {
                        'dc-checkbox__box--active': checked,
                        'dc-checkbox__box--disabled': disabled,
                        'dc-checkbox--grey-disabled': disabled && greyDisabled,
                    })}
                    {...(withTabIndex?.length > 0 ? { tabIndex: withTabIndex } : {})}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >
                    {!!checked && <Icon icon='IcCheckmark' color='active' />}
                </span>
                <Text size='xs' line_height='unset' className={classNames('dc-checkbox__label', classNameLabel)}>
                    {label}
                </Text>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
