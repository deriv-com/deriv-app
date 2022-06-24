import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '../checkbox';

const PopoverMessageCheckbox = ({ checkboxLabel, defaultChecked, onChange, message, name }) => (
    <React.Fragment>
        {message}
        <Checkbox defaultChecked={defaultChecked} onChange={onChange} name={name} label={checkboxLabel} />
    </React.Fragment>
);

PopoverMessageCheckbox.propTypes = {
    defaultChecked: PropTypes.bool,
    message: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    checkboxLabel: PropTypes.string,
};

export default PopoverMessageCheckbox;
