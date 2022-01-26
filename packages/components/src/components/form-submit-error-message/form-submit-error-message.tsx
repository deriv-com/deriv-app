import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon.jsx';
import Text from '../text';

type FormSubmitErrorMessageProps = {
    className: string;
    message: string;
};

const FormSubmitErrorMessage = ({ className, message }: FormSubmitErrorMessageProps) => (
    <div className={classNames('dc-form-submit-error-message', className)}>
        <Icon icon='IcAlertDanger' />
        <Text as='p' size='xxs' weight='bold' color='prominent'>
            {message}
        </Text>
    </div>
);

export default FormSubmitErrorMessage;
