import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Icon, MobileWrapper } from '@deriv/components';

const FormError = ({ error_message }) => (
    <React.Fragment>
        <DesktopWrapper>
            <div className='cashier__form-error-wrapper account-transfer__form-error'>
                <Icon icon='IcAlertDanger' className='cashier__form-error-small-icon' />
                <p className='cashier__form-error'>{error_message}</p>
            </div>
        </DesktopWrapper>
        <MobileWrapper>
            <div className='cashier__form-error-container'>
                <Icon icon='IcAlertDanger' className='cashier__form-error-small-icon' />
                <p className='cashier__form-error'>{error_message}</p>
            </div>
        </MobileWrapper>
    </React.Fragment>
);

FormError.propTypes = {
    error_message: PropTypes.string,
};

export default FormError;
