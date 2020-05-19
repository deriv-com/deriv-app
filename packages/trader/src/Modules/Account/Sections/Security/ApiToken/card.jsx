import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { CompositeCheckbox } from '@deriv/components';

const Card = ({ name, value, display_name, description, setFieldValue }) => {
    return (
        <div>
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
        </div>
    );
};

Card.propTypes = {
    description: PropTypes.string,
    display_name: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    setFieldValue: PropTypes.func,
};

export default Card;
