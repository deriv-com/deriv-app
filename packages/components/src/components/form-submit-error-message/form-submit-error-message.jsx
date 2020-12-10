import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon.jsx';

const FormSubmitErrorMessage = ({ className, message }) => (
    <div className={classNames('dc-form-submit-error-message', className)}>
        <Icon icon='IcAlertDanger' />
        <p>{message}</p>
    </div>
);

export default FormSubmitErrorMessage;
