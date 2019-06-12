import React                    from 'react';
import Label                    from 'App/Components/Elements/Label/label.jsx';
import Localize                 from 'App/Components/Elements/localize.jsx';
import Money                    from 'App/Components/Elements/money.jsx';
import { IconAccountsCurrency } from 'Assets/Header/AccountsCurrency';
import { IconDemo }             from 'Assets/Reports/icon-demo.jsx';
import { connect }              from 'Stores/connect';

const WalletInformation = ({
    currency,
    balance,
    is_virtual,
    loginid,
}) => (
    <div className='account-wallet'>
        {!is_virtual && <IconAccountsCurrency type={currency.toLowerCase()} />}
        {is_virtual && <IconDemo />}
        <span className='description'>
            <Localize str={`${is_virtual ? 'Practice' : currency.toUpperCase()} wallet`} />
        </span>
        <span className='current-loginid'>{loginid}</span>
        <Label mode={`${is_virtual ? 'warn-invert' : 'success-invert'}`} size='large'>
            <Money amount={balance} currency={currency} />
        </Label>
    </div>
);

export default connect(({ client }) => ({
    balance   : client.balance,
    currency  : client.currency,
    is_virtual: client.is_virtual,
    loginid   : client.loginid,
}))(WalletInformation);
