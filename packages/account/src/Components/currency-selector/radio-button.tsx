import React, { AllHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Icon } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import USTPopover from './ust-popover';

type TRadioButtonExtend = {
    field: React.InputHTMLAttributes<HTMLInputElement>;
    icon?: string;
    second_line_label?: string;
    id: string;
    label: string;
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
};

export type TRadioButton = AllHTMLAttributes<HTMLInputElement | HTMLLabelElement> & TRadioButtonExtend;

/**
 *  RadioButton component to select currency
 * @name RadioButton
 * @param {React.InputHTMLAttributes<HTMLInputElement>} field - field props given by Formik
 * @param {string} icon - icon name
 * @param {string} id - currency id
 * @param {string} label - currency name
 * @param {string} second_line_label - currency code
 * @param {Function} onClick - function to be called on click
 * @param {AllHTMLAttributes<HTMLInputElement | HTMLLabelElement>} props - other props to be passed
 * @returns {React.ReactNode} - returns a React node
 */

const RadioButton = ({
    field: { name, value, onChange, onBlur },
    icon,
    id,
    label,
    second_line_label,
    onClick,
    className,
    ...props
}: TRadioButton) => {
    return (
        <React.Fragment>
            <input
                name={name}
                id={id}
                type='radio'
                value={id} // could be something else for output?
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={props.selected}
                className={clsx(className, 'currency-list__radio-button')}
                {...props}
            />
            <label
                htmlFor={id}
                className={clsx('currency-list__item', {
                    'currency-list__item--selected': id === value,
                    'currency-list__item--current': props.selected,
                })}
                onClick={onClick}
            >
                {icon ? (
                    <React.Fragment>
                        <Icon className='currency-list__icon' icon={icon} />
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>{second_line_label}</div>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Icon className='currency-list__icon' icon={`IcCurrency-${id?.toLowerCase()}`} />
                        {id && /^(UST|eUSDT|tUSDT)$/i.test(id) && <USTPopover id={id} />}
                        <div className='label currency-list__item-text'>
                            <div className='currency-list__item-label'>{label}</div>
                            <div className='currency-list__item-code'>({getCurrencyDisplayCode(id)})</div>
                        </div>
                    </React.Fragment>
                )}
            </label>
        </React.Fragment>
    );
};

export default RadioButton;
