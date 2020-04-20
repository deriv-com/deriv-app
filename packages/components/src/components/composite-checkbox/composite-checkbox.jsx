import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from 'Components/checkbox/checkbox.jsx';

const container_ref = React.createRef();

const CompositeCheckbox = ({ name, value, onChange, className, label, id, description }) => {
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
        <div ref={container_ref} className={classNames('composite-checkbox', className)} onClick={onClickContainer}>
            <Checkbox id={id} label={label} name={name} value={value} onChange={onChange} />
            <p className={classNames('composite-checkbox__description', `${className}__description`)}>{description}</p>
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
