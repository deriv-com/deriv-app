import React, { CSSProperties, forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from 'src/types';
import { LegacyCheckboxOnIcon } from '@deriv/quill-icons';
import { WalletText } from '../WalletText';
import './WalletCheckbox.scss';

type TCheckBoxProps = Omit<React.HTMLProps<HTMLInputElement>, 'label' | 'value'> & {
    className?: string;
    classNameLabel?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    id?: string;
    label: React.ReactElement | string;
    labelFontSize?: Exclude<TGenericSizes, '3xs' | '6xl' | '7xl'>;
    labelFontWeight?: CSSProperties['fontWeight'];
    labelLineHeight?: TGenericSizes;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => void;
    value?: boolean;
    withTabIndex?: number;
};

const WalletCheckbox = forwardRef<HTMLInputElement, TCheckBoxProps>(
    (
        {
            className,
            defaultChecked,
            disabled = false,
            id,
            label,
            labelFontSize = 'xs',
            labelFontWeight = 'normal',
            labelLineHeight = 'lg',
            name,
            onChange,
            value = false,
            withTabIndex = 0,
            ...otherProps
        },
        ref
    ) => {
        const [checked, setChecked] = useState(defaultChecked || value);
        useEffect(() => {
            setChecked(defaultChecked || value);
        }, [value, defaultChecked]);

        const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
            e.persist();
            setChecked(!checked);
            onChange?.(e);
        };

        const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = e => {
            if (!disabled && (e.key === 'Enter' || e.keyCode === 32)) {
                onChange?.(e);
                setChecked(!checked);
            }
        };

        return (
            <label
                className={classNames('wallets-checkbox', className, {
                    'wallets-checkbox--disabled': disabled,
                })}
                htmlFor={id}
            >
                <span>
                    <input
                        checked={checked}
                        className='wallets-checkbox__input'
                        disabled={disabled}
                        id={id}
                        name={name}
                        onChange={onInputChange}
                        ref={ref}
                        type='checkbox'
                        {...otherProps}
                    />
                    <span
                        className={classNames('wallets-checkbox__box', {
                            'wallets-checkbox__box--active': checked,
                            'wallets-checkbox__box--disabled': disabled,
                        })}
                        onKeyDown={handleKeyDown}
                        role='checkbox'
                        tabIndex={withTabIndex}
                    >
                        {!!checked && (
                            <LegacyCheckboxOnIcon
                                className='wallets-checkbox__box--fill'
                                fill='var(--brand-red-coral)'
                                iconSize='xs'
                            />
                        )}
                    </span>
                </span>
                <WalletText lineHeight={labelLineHeight} size={labelFontSize} weight={labelFontWeight}>
                    {label}
                </WalletText>
            </label>
        );
    }
);

WalletCheckbox.displayName = 'WalletCheckbox';

export default WalletCheckbox;
