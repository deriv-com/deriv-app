import React from 'react';
import Icon  from 'Assets/icon.jsx';

// TODO: wait for UI
const FormSubmitErrorMessage = ({ message }) => (
    <div className='form-submit-error-message'>
        <Icon icon='IconError' />
        <p>{message}</p>
    </div>
);

export default FormSubmitErrorMessage;
