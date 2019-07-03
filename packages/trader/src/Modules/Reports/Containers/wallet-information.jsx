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
    loginid,
}) => {
    const is_currency_ready = Object.keys(getCurrencies()).length > 0;
    return (
        <div className='account-wallet'>
            {!is_virtual && <Icon icon='IconAccountsCurrency' type={currency.toLowerCase()} />}
            {is_virtual && <Icon icon='IconDemo' />}
            <span className='description'>
                <Localize str={`${is_virtual ? 'Practice' : currency.toUpperCase()} wallet`} />
            </span>
            <span className='current-loginid'>{loginid}</span>
            {is_currency_ready &&
            <Label mode={`${is_virtual ? 'warn-invert' : 'success-invert'}`} size='large'>
                <Money amount={balance} currency={currency} />
            </Label>
            }
            {!is_currency_ready && <div />}
        </div>
    );
};

export default connect(({ client }) => ({
    balance   : client.balance,
    currency  : client.currency,
    is_virtual: client.is_virtual,
    loginid   : client.loginid,
}))(WalletInformation);
