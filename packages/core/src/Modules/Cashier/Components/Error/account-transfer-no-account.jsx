import React from 'react';
import { Icon, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccountTransferNoAccount = ({ toggleAccountsDialog }) => (
    <div className='cashier__wrapper cashier__no-balance'>
        <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
        <h2 className='withdraw__header'>
            <Localize i18n_default_text='You need at least two accounts' />
        </h2>
        <p className='cashier__text'>
            <Localize i18n_default_text='Please create a second account (Deriv or DMT5) to enable fund transfers.' />
        </p>
        <Button className='cashier__button' primary large onClick={toggleAccountsDialog}>
            <Localize i18n_default_text='Create account' />
        </Button>
    </div>
);

export default connect(({ ui }) => ({
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountTransferNoAccount);
