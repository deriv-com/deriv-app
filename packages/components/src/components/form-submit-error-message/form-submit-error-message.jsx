import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon/icon.jsx';
import Text from '../text';

const FormSubmitErrorMessage = ({ className, message }) => (
    <div className={classNames('dc-form-submit-error-message', className)}>
        <Icon icon='IcAlertDanger' />
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
