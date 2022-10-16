import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';
import Text from '../text';

const FormSubmitErrorMessage = ({ className, message }) => (
    <div className={classNames('dc-form-submit-error-message', className)}>
        <Icon icon='IcAlertDanger' data_testid='form_submit_error' />
        <Text as='p' size='xxs' weight='bold' color='prominent'>
            {message}
        </Text>
    </div>
);

FormSubmitErrorMessage.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
};

export default FormSubmitErrorMessage;
