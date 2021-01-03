import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import { EXPERIAN } from './constants';

/**
 * @component
 *
 * @param {EXPERIAN} status - Experian result
 */
const IOMHeading = ({ status }) => (
    <Text as='h2' weight='bold' align='center'>
        {status === EXPERIAN.SUCCESS && <Localize i18n_default_text='Your account is ready' />}
        {status === EXPERIAN.WARN && <Localize i18n_default_text='Proof of address verification failed' />}
        {status === EXPERIAN.DANGER && (
            <Localize i18n_default_text='Proof of identity and address verification failed' />
        )}
        {status === EXPERIAN.PENDING && (
            <Localize i18n_default_text='Your proofs of identity and address were submitted successfully' />
        )}
    </Text>
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
        case 'iom':
            return <IOMHeading status={status} />;
        default:
            return (
                <Text as='h2' weight='bold' align='center'>
                    <Localize i18n_default_text='Your account is ready' />
                </Text>
            );
    }
};

DialogHeading.propTypes = {
    status: PropTypes.number.isRequired,
    landing_company_shortcode: PropTypes.string.isRequired,
};
