import PropTypes from 'prop-types';
import * as React from 'react';
import { Field } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

const ApiTokenCard = ({ name, value, display_name, description, setFieldValue }) => {
    return (
        <Field name={name}>
            {({ field }) => (
                <CompositeCheckbox
                    {...field}
                    onChange={() => setFieldValue(name, !value)}
                    value={value}
                    className='api-token__checkbox'
                    defaultChecked={value}
                    label={display_name}
                    description={description}
                />
            )}
        </Field>
    );
};

ApiTokenCard.propTypes = {
    description: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    setFieldValue: PropTypes.func.isRequired,
};

export default ApiTokenCard;
