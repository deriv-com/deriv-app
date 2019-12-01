import PropTypes              from 'prop-types';
import React                  from 'react';
import Icon                   from 'Assets/icon.jsx';
import { localize, Localize } from 'deriv-translations';

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
                    icon='IconAccountsCurrency'
                    type={currency.toLowerCase()}
                />
                <p className='account__inset_header-subheading'>
                    <Localize
                        i18n_default_text='For your {{currency_name}} ({{currency}}) account'
                        values={{
                            currency_name: currency_name_map[currency.toUpperCase()],
                            currency     : currency.toUpperCase(),
                        }}
                    />
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
