import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { EXPERIAN } from './constants';

/**
 *
 * @param {String} landing_company_shortcode
 * @param {EXPERIAN} status
 */
export const DialogMessage = ({ is_fully_authenticated, landing_company_shortcode, status = EXPERIAN.SUCCESS }) => {
    let message = '';
    if (landing_company_shortcode === 'maltainvest') {
        if (is_fully_authenticated) {
            message = [
                <Localize key={0} i18n_default_text='You have added a Deriv Financial account.' />,
                <Localize key={1} i18n_default_text='Make a deposit now to start trading.' />,
            ];
        } else {
            message = (
                <Localize i18n_default_text='We need proof of your identity and address before you can start trading.' />
            );
        }
    } else {
        switch (status) {
            case EXPERIAN.WARN:
                message = <Localize i18n_default_text='To get trading, please confirm where you live.' />;
                break;
            case EXPERIAN.DANGER:
                message = (
                    <Localize i18n_default_text='To get trading, please confirm who you are, and where you live.' />
                );
                break;
            case EXPERIAN.PENDING:
                message = (
                    <Localize i18n_default_text="You'll be able to get trading as soon as verification is complete." />
                );
                break;
            default:
                message = <Localize i18n_default_text='Fund your account to start trading.' />;
        }
    }

    return Array.isArray(message) ? (
        <>
            {message.map((text, index) => (
                <Text
                    key={index}
                    as='p'
                    align='center'
                    className='status-dialog__message-text'
                    color='general'
                    size='xs'
                >
                    {text}
                </Text>
            ))}
        </>
    ) : (
        <Text as='p' align='center' className='status-dialog__message-text' color='general' size='xs'>
            {message}
        </Text>
    );
};

DialogMessage.propTypes = {
    is_fully_authenticated: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    status: PropTypes.number,
};
