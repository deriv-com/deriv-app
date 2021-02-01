import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '../checkbox/checkbox.jsx';
import Text from '../text';

const CompositeCheckbox = ({ name, value, onChange, className, label, id, description, ...props }) => {
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
                className={classNames('composite-checkbox__description', `${className}__description`)}
            >
                {description}
            </Text>
        </div>
    );
};

CompositeCheckbox.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    description: PropTypes.string.isRequired,
};

export default CompositeCheckbox;
