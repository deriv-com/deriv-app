import classNames from 'classnames';
import React from 'react';
import Text from '../text';

type RadioProps = {
    children: React.ReactNode;
    className: string;
    classNameLabel: string;
    defaultChecked: boolean;
    id: string;
    onChange: () => void;
};

const Radio = ({
    children,
    className,
    classNameLabel,
    defaultChecked,
    id,

    // This needs to be here so it's not included in `otherProps`
    onChange,

    ...otherProps
}: RadioProps) => {
    const [checked, setChecked] = React.useState(defaultChecked);

    /*
     * We use useEffect here to tell the Radio component to update itself
     * when it's no longer selected
     * This is because we're handling the state of what's selected in RadioGroup with the defaultChecked prop
     */
    React.useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    const onInputChange = e => {
        setChecked(e.target.checked);
        onChange(e);
    };

    return (
        <label
            htmlFor={id}
            className={classNames('dc-radio-group__item', className, {
                'dc-radio-group__item--active': checked,
            })}
        >
            <input className='dc-radio-group__input' type='radio' id={id} onChange={onInputChange} {...otherProps} />
            <span
                className={classNames('dc-radio-group__circle', {
                    'dc-radio-group__circle--selected': checked,
                })}
            />
            <Text size='xs' className={classNames('dc-radio-group__label', classNameLabel)}>
                {children}
            </Text>
        </label>
    );
};

export default Radio;
