import React from 'react';
import PropTypes from 'prop-types';
import './form.scss';

const FormSubmitErrorMessage = ({ message }) => <p className='dp2p-form-error'>{message}</p>;

FormSubmitErrorMessage.propTypes = {
    message: PropTypes.string,
};

export default FormSubmitErrorMessage;
