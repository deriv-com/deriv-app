import React from 'react';
import PropTypes from 'prop-types';
import './form.scss';
import { Text } from '@deriv/components';

const FormSubmitErrorMessage = ({ message }) => (
    <Text as='p' color='loss-danger' size='xxs' className='dp2p-form-error'>
        {message}
    </Text>
);

FormSubmitErrorMessage.propTypes = {
    message: PropTypes.string,
};

export default FormSubmitErrorMessage;
