import { Label, Money }       from 'deriv-components';
import PropTypes              from 'prop-types';
import React                  from 'react';
import Icon                   from 'Assets/icon.jsx';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';

const Description = ({ currency, is_virtual }) => (
    is_virtual ?
        <Localize i18n_default_text='Demo account' />
        :
        <Localize i18n_default_text='{{currency}} wallet' values={{ currency: currency.toUpperCase() }} />

);

const WalletInformation = ({
    currency,
    balance,
    has_description,
    has_loginid,
    is_virtual,
    is_website_status_ready,
    loginid,
}) => {
    return (
        <div className='account-wallet'>
            <Icon icon='IconAccountsCurrency' type={is_virtual ? 'virtual' : currency.toLowerCase()} />
            <span className='description'>
                { has_description ?
                    <Description currency={currency} is_virtual={is_virtual} />
                    :
                    <span className='description__currency'>{is_virtual ? localize('Demo') : currency.toUpperCase()}</span>
                }
            </span>
            {has_loginid && <span className='current-loginid'>{loginid}</span>}
            {is_website_status_ready &&
            <Label className='account-wallet__label' mode='success-invert' size='large'>
                <Money amount={balance} currency={currency} />
            </Label>
            }
            {!is_website_status_ready && <div />}
        </div>
    );
};

WalletInformation.propTypes = {
    has_description: PropTypes.bool,
    has_loginid    : PropTypes.bool,
};

export default connect(({ client }) => ({
    balance                : client.balance,
    currency               : client.currency,
    is_virtual             : client.is_virtual,
    is_website_status_ready: client.is_website_status_ready,
    loginid                : client.loginid,
}))(WalletInformation);
