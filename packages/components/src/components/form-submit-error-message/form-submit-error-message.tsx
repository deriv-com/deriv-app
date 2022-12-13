import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';
import Text from '../text';

type TFormSubmitErrorMessage = {
    className?: string;
    message: string;
};

const FormSubmitErrorMessage = ({ className, message }: TFormSubmitErrorMessage) => (
    <div className={classNames('dc-form-submit-error-message', className)}>
        <Icon icon='IcAlertDanger' data_testid='form_submit_error' />
        <Text as='p' size='xxs' weight='bold' color='prominent'>
            {message}
        </Text>
    </div>
);

export default FormSubmitErrorMessage;
