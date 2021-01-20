import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccountTransferNoAccount = ({ toggleAccountsDialog }) => (
    <div className='cashier__wrapper cashier__no-balance'>
        <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
        <h2 className='withdraw__header'>
            <Localize i18n_default_text='You need at least two accounts' />
        </h2>
        <Text as='p' size='xs' line_height='s' className='cashier__text'>
            <Localize i18n_default_text='Please create a second account (Deriv or DMT5) to enable fund transfers.' />
        </Text>
        <Button className='cashier__button' primary large onClick={toggleAccountsDialog}>
            <Localize i18n_default_text='Create account' />
        </Button>
    </div>
);

export default connect(({ ui }) => ({
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountTransferNoAccount);
