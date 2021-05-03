import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Text from '../text';

const Radio = ({
    children,
    className,
    classNameLabel,
    defaultChecked,
    id,
    onChange, // This needs to be here so it's not included in `otherProps`
    ...otherProps
}) => {
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

Radio.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNameLabel: PropTypes.string,
    defaultChecked: PropTypes.bool,
    id: PropTypes.string,
    onChange: PropTypes.func,
};

export default Radio;
