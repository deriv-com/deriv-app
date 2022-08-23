import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '../checkbox/checkbox.jsx';
import Text from '../text';

const CompositeCheckbox = ({ name, value, onChange, className, label, id, description, children, ...props }) => {
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
            {children}
        </div>
    );
};

CompositeCheckbox.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node), PropTypes.array]),
    className: PropTypes.string,
    description: PropTypes.string.isRequired,
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
};

export default CompositeCheckbox;
