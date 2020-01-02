import PropTypes              from 'prop-types';
import React                  from 'react';
import { Icon }               from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const currency_name_map = {
    BTC: localize('Bitcoin'),
    BCH: localize('Bitcoin Cash'),
    ETH: localize('Ether'),
    ETC: localize('Ether Classic'),
    LTC: localize('Litecoin'),
    UST: localize('Tether'),
    USB: localize('Binary Coin'),
    USD: localize('US Dollar'),
    AUD: localize('Australian Dollar'),
    EUR: localize('Euro'),
    GBP: localize('Pound Sterling'),
};

const AccountLimitsInfo = ({
    currency,
    is_virtual,
}) => (
    <>
        {!is_virtual &&
            <>
                <Icon
                    className='account__inset_header-icon'
                    icon={currency ? `IcCurrency-${currency}` : 'IcCurrencyUnknown'}
                />
                <p className='account__inset_header-subheading'>
                    {currency ?
                        <Localize
                            i18n_default_text='For your {{currency_name}} ({{currency}}) account'
                            values={{
                                currency_name: currency_name_map[currency.toUpperCase()],
                                currency     : currency.toUpperCase(),
                            }}
                        />
                        :
                        <Localize
                            i18n_default_text='No currency has been set for this account'
                        />
                    }
                </p>

            </>
        }
    </>
);

AccountLimitsInfo.propTypes = {
    currency  : PropTypes.string,
    is_virtual: PropTypes.bool,
};

export default AccountLimitsInfo;
