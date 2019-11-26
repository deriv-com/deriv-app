import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import { Localize } from 'deriv-translations';

class AccountTransferNoAccount extends React.Component {
    render = () => {
        return (
            <div className='cashier__wrapper cashier__no-balance'>
                <Icon icon='IconNoBalance' className='cashier__no-balance-icon' />
                <h2 className='withdraw__header'><Localize i18n_default_text='You need at least two accounts' /></h2>
                <p className='cashier__text'><Localize i18n_default_text='Please create a second account (Deriv or DMT5) to enable fund transfers.' /></p>
                {/* TODO: add account opening CTA and MT5 account opening CTA once ready */}
            </div>
        );
    }
}

export default AccountTransferNoAccount;
