import classNames from 'classnames';
import React from 'react';
import Checkbox from '../checkbox/checkbox.jsx';
import Text from '../text';

type CompositeCheckboxProps = {
    name: string;
    value: boolean;
    onChange: () => void;
    className: string;
    label: string;
    id: string;
    description: string;
};

const CompositeCheckbox = ({
    name,
    value,
    onChange,
    className,
    label,
    id,
    description,
    ...props
}: CompositeCheckboxProps) => {
    const onClickContainer = e => {
        e.stopPropagation();
        e.preventDefault();
        onChange({
            target: {
                value: !value,
            },
        });
    };

    return (
        <div
            className={classNames('composite-checkbox', className, {
                'composite-checkbox--active': !!value,
            })}
            onClick={onClickContainer}
        >
            <Checkbox id={id} label={label} name={name} value={value} onChange={onChange} {...props} />
            <Text
                as='p'
                size='xxxs'
                line_height='s'
                className={classNames('composite-checkbox__description', `${className}__description`)}
            >
                {description}
            </Text>
        </div>
    );
};

export default CompositeCheckbox;
