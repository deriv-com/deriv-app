import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';

const MT5PendingVerificationModal = ({ toggleModal }) => (
    <div className='mt5-pending-verification'>
        <h2 className='mt5-pending-verification__heading'>
            <Localize i18n_default_text='Thanks for submitting your documents!' />
        </h2>
        <p className='mt5-pending-verification__description'>
            <Localize i18n_default_text='We’ll process your documents within 1-3 days. Once they are verified, we’ll notify you via email.' />
        </p>
        <div className='mt5-pending-verification__btn-area'>
            <Button onClick={toggleModal} primary>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    </div>
);

MT5PendingVerificationModal.propTypes = {
    toggleModal: PropTypes.func,
};

export default MT5PendingVerificationModal;
