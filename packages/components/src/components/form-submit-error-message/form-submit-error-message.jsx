import React from 'react';
import Icon from '../icon/icon.jsx';

const FormSubmitErrorMessage = ({ message }) => (
    <div className='dc-form-submit-error-message'>
        <Icon icon='IcAlertDanger' />
        <p>{message}</p>
    </div>
);

export default FormSubmitErrorMessage;
