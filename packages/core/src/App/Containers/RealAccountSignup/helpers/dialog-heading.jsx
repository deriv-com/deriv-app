import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

/**
 * @component
 *
 * @param {EXPERIAN} status - Experian result
 */
const IOMHeading = ({ status }) => (
    <Text as='h2' align='center' className='status-dialog__message-header' weight='bold'>
        {status === EXPERIAN.SUCCESS && <Localize i18n_default_text='Your account is ready' />}
        {status === EXPERIAN.WARN && <Localize i18n_default_text='Please verify your address' />}
        {status === EXPERIAN.DANGER && <Localize i18n_default_text='Please verify your identity and address' />}
        {status === EXPERIAN.PENDING && <Localize i18n_default_text="We're processing your personal information" />}
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
                <Text as='h2' align='center' className='status-dialog__message-header' weight='bold'>
                    <Localize i18n_default_text='Your account is ready' />
                </Text>
            );
    }
};

DialogHeading.propTypes = {
    status: PropTypes.number.isRequired,
    landing_company_shortcode: PropTypes.string.isRequired,
};
