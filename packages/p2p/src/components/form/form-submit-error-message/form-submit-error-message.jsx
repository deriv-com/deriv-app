import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const FormSubmitErrorMessage = ({ message }) => (
    <Text as='p' color='loss-danger' size='xxs' className='form-submit-error-message'>
        {message}
    </Text>
);

FormSubmitErrorMessage.propTypes = {
    message: PropTypes.string,
};

export default FormSubmitErrorMessage;
