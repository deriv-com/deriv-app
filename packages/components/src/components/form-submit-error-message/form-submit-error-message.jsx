import React from 'react';
import Icon from '../icon/icon.jsx';
import Text from '../text';

const FormSubmitErrorMessage = ({ message }) => (
    <div className='dc-form-submit-error-message'>
        <Icon icon='IcAlertDanger' />
        <Text as='p' size='xxs' weight='bold' color='prominent'>
            {message}
        </Text>
    </div>
);

export default FormSubmitErrorMessage;
