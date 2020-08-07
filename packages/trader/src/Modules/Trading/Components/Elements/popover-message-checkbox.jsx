import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@deriv/components';
import { localize } from '@deriv/translations';

const PopoverMessageCheckbox = ({ defaultChecked, onChange, message, name }) => (
    <React.Fragment>
        {message}
        <Checkbox
            defaultChecked={defaultChecked}
            onChange={onChange}
            name={name}
            label={localize("Don't show this again")}
        />
    </React.Fragment>
);

PopoverMessageCheckbox.propTypes = {
    defaultChecked: PropTypes.bool,
    message: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
};

export default PopoverMessageCheckbox;
