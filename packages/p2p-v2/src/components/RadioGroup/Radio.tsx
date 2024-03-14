import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import './RadioGroup.scss';

type TRadio = {
    className?: string;
    classNameLabel?: string;
    defaultChecked: boolean;
    id: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Radio = ({
    children,
    className,
    classNameLabel,
    defaultChecked,
    id,
    onChange, // This needs to be here so it's not included in `otherProps`
    ...otherProps
}: PropsWithChildren<TRadio>) => {
    const [checked, setChecked] = useState(defaultChecked);

    /*
     * We use useEffect here to tell the Radio component to update itself
     * when it's no longer selected
     * This is because we're handling the state of what's selected in RadioGroup with the defaultChecked prop
     */
    useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        onChange(e);
    };

    return (
        <label
            className={clsx('p2p-v2-radio-group__item', className, {
                'p2p-v2-radio-group__item--active': checked,
            })}
            htmlFor={id}
        >
            <input
                className='p2p-v2-radio-group__input'
                id={id}
                onChange={onInputChange}
                type='radio'
                {...otherProps}
            />
            <span
                className={clsx('p2p-v2-radio-group__circle', {
                    'p2p-v2-radio-group__circle--selected': checked,
                })}
            />
            <Text className={clsx('p2p-v2-radio-group__label', classNameLabel)} size='xs'>
                {children}
            </Text>
        </label>
    );
};

export default Radio;
