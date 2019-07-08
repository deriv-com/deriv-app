import React             from 'react';
import Icon              from 'Assets/icon.jsx';
import { getCurrencies } from '_common/base/currency_base';
import Label             from 'App/Components/Elements/Label/label.jsx';
import Localize          from 'App/Components/Elements/localize.jsx';
import Money             from 'App/Components/Elements/money.jsx';
import { connect }       from 'Stores/connect';

const WalletInformation = ({
    currency,
    balance,
    is_virtual,
    is_website_status_ready,
    loginid,
}) => {
    return (
        <div className='account-wallet'>
            {!is_virtual && <Icon icon='IconAccountsCurrency' type={currency.toLowerCase()} />}
            {is_virtual && <Icon icon='IconDemo' />}
            <span className='description'>
                {is_virtual ?
                    <Localize i18n_default_text='Practice wallet' />
                    :
                    <Localize i18n_default_text='{{currency}} wallet' values={{ currency: currency.toUpperCase() }} />
                }
            </span>
            <span className='current-loginid'>{loginid}</span>
            {is_website_status_ready &&
            <Label mode={`${is_virtual ? 'warn-invert' : 'success-invert'}`} size='large'>
                <Money amount={balance} currency={currency} />
            </Label>
            }
            {!is_website_status_ready && <div />}
        </div>
    );
};

export default connect(({ client }) => ({
    balance                : client.balance,
    currency               : client.currency,
    is_virtual             : client.is_virtual,
    is_website_status_ready: client.is_website_status_ready,
    loginid                : client.loginid,
}))(WalletInformation);
