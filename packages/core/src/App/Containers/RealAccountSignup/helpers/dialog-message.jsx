import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

/**
 *
 * @param {String} landing_company_shortcode
 * @param {EXPERIAN} status
 */
export const DialogMessage = ({ status = EXPERIAN.SUCCESS, landing_company_shortcode }) => {
    let message = '';
    if (landing_company_shortcode === 'maltainvest') {
        message = (
            <Localize i18n_default_text='We need proofs of your identity and address before you can start trading.' />
        );
    } else {
        switch (status) {
            case EXPERIAN.WARN:
                message = (
                    <Localize i18n_default_text='We were unable to verify your proof of address document. You can upload a new document to try again.' />
                );
                break;
            case EXPERIAN.DANGER:
                message = (
                    <Localize i18n_default_text='We were unable to verify your proof of identity and address documents. You can upload new documents to try again.' />
                );
                break;
            default:
                message = <Localize i18n_default_text='Fund your account to start trading.' />;
        }
    }

    return <p className='status-dialog__text'>{message}</p>;
};

DialogMessage.propTypes = {
    currency: PropTypes.string,
    is_isle_of_man_residence: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    status: PropTypes.number,
};
