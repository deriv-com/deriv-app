import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

/**
 * @component
 *
 * @param {EXPERIAN} status - Experian result
 */
const IOMHeading = ({ status }) => (
    <h2>
        {status === EXPERIAN.SUCCESS && <Localize i18n_default_text='Success!' />}
        {[EXPERIAN.WARN, EXPERIAN.DANGER].includes(status) && <Localize i18n_default_text='Verification failed!' />}
    </h2>
);

/**
 * @component
 * Get the title to use in the dialog
 *
 * @param {EXPERIAN} status
 * @param {string} landing_company_shortcode
 *
 * @return {null|*}
 */
export const DialogHeading = ({ status, landing_company_shortcode }) => {
    switch (landing_company_shortcode) {
        case 'svg':
            return (
                <h2>
                    <Localize i18n_default_text='Success!' />
                </h2>
            );
        case 'iom':
            return <IOMHeading status={status} />;

        default:
            return null;
    }
};

DialogHeading.propTypes = {
    status: PropTypes.number.isRequired,
    landing_company_shortcode: PropTypes.string.isRequired,
};
