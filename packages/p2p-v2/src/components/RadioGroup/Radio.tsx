import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './RadioGroup.scss';

type TRadio = {
    className?: string;
    classNameLabel?: string;
    defaultChecked: boolean;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Radio = ({
    children,
    className,
    classNameLabel,
    defaultChecked,
    id,
    onChange, // This needs to be here so it's not included in `otherProps`
    ...otherProps
}: React.PropsWithChildren<TRadio>) => {
    const [checked, setChecked] = React.useState(defaultChecked);

    /*
     * We use useEffect here to tell the Radio component to update itself
     * when it's no longer selected
     * This is because we're handling the state of what's selected in RadioGroup with the defaultChecked prop
     */
    React.useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        onChange(e);
    };

    return (
        <label
            htmlFor={id}
            className={clsx('p2p-v2-radio-group__item', className, {
                'p2p-v2-radio-group__item--active': checked,
            })}
        >
            <input className='p2p-v2-radio-group__input' type='radio' id={id} onChange={onInputChange} {...otherProps} />
            <span
                className={clsx('p2p-v2-radio-group__circle', {
                    'p2p-v2-radio-group__circle--selected': checked,
                })}
            />
            <Text size='xs' className={clsx('p2p-v2-radio-group__label', classNameLabel)}>
                {children}
            </Text>
        </label>
    );
};

export default Radio;
