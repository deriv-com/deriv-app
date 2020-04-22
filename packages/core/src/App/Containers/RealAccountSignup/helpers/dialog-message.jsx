import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { EXPERIAN, getAccountTitle } from './constants';

/**
 *
 * @param {EXPERIAN} status
 * @param {string} landing_company_shortcode
 * @param {string} currency
 * @param {boolean} is_im_residence
 * @param {boolean} is_be_residence
 */
export const DialogMessage = ({ status, landing_company_shortcode, currency, is_be_residence, is_im_residence }) => {
    if (landing_company_shortcode === 'svg') {
        return (
            <Localize
                i18n_default_text='<0>You have added a {{account_type}} {{currency}} account.</0><0>Make a deposit now to start trading.</0>'
                values={{
                    currency: currency.toUpperCase(),
                    account_type: getAccountTitle(landing_company_shortcode, { is_be_residence }),
                }}
                components={[<p key={currency} />]}
            />
        );
    } else if (landing_company_shortcode === 'iom') {
        switch (status) {
            case EXPERIAN.WARN:
                return (
                    <Localize
                        i18n_default_text="<0>We couldn't verify part of your personal details, please upload your proof of identity and address for verification.</0>"
                        values={{
                            currency: currency.toUpperCase(),
                        }}
                        components={[<p key={currency} />]}
                    />
                );
            case EXPERIAN.DANGER:
                return (
                    <Localize
                        i18n_default_text="<0>We couldn't verify your personal details, please upload your proof of identity and address for verification.</0>"
                        values={{
                            currency: currency.toUpperCase(),
                            account_type: getAccountTitle(landing_company_shortcode),
                        }}
                        components={[<p key={currency} />]}
                    />
                );
            default:
                return (
                    <Localize
                        i18n_default_text='<0>You have added a {{account_type}} {{currency}} account. Make a deposit now and start trading after your account is verified.</0>'
                        values={{
                            currency: currency.toUpperCase(),
                            account_type: getAccountTitle(landing_company_shortcode, { is_im_residence }),
                        }}
                        components={[<p key={currency} />]}
                    />
                );
        }
    } else if (landing_company_shortcode === 'malta') {
        switch (status) {
            case EXPERIAN.SUCCESS:
                return (
                    <Localize
                        i18n_default_text='<0>You have added a {{account_type}} {{currency}} account. Make a deposit now and start trading after your account is verified.</0>'
                        values={{
                            currency: currency.toUpperCase(),
                            account_type: getAccountTitle(landing_company_shortcode, { is_im_residence }),
                        }}
                        components={[<p key={currency} />]}
                    />
                );
            default:
                return null;
        }
    }

    return null;
};

DialogMessage.propTypes = {
    currency: PropTypes.string,
    is_im_residence: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    status: PropTypes.number,
};
