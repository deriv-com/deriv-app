import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

/**
 *
 * @param {EXPERIAN} status
 */
export const DialogMessage = ({ status = EXPERIAN.SUCCESS }) => {
    switch (status) {
        case EXPERIAN.WARN:
            return (
                <Localize i18n_default_text="We couldn't verify your proof of address document. You can upload a new document to try again" />
            );
        case EXPERIAN.DANGER:
            return (
                <Localize i18n_default_text='We were unable to verify your proof of identity and address documents. You can upload new documents to try again.' />
            );
        default:
            return <Localize i18n_default_text='Fund your account to start trading.' />;
    }
};

DialogMessage.propTypes = {
    currency: PropTypes.string,
    is_isle_of_man_residence: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    status: PropTypes.number,
};
