import React from 'react';
import Icon  from 'Assets/icon.jsx';

// TODO: wait for UI
const FormSubmitErrorMessage = ({ message }) => (
    <div className='form-submit-error-message' style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>
        <Icon icon='IconError' />
        <p>{message}</p>
    </div>
);

export default FormSubmitErrorMessage;
