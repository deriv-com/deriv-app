import React from 'react';
import Icon  from 'Assets/icon.jsx';

const FormSubmitErrorMessage = ({ message }) => (
    <div className='form-submit-error-message'>
        <Icon icon='IconAPIError' />
        <p>{message}</p>
    </div>
);

export default FormSubmitErrorMessage;
