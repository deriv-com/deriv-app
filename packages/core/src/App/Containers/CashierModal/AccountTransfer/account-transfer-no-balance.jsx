import PropTypes              from 'prop-types';
import React                  from 'react';
import { Button }             from 'deriv-components';
import Icon                   from 'Assets/icon.jsx';
import { website_name }       from 'App/Constants/app-config';
import { localize, Localize } from 'deriv-translations';

class AccountTransferNoBalance extends React.Component {
    onClickDeposit = () => {
        // index of deposit tab in the cashier modal is 0
        this.props.setModalIndex(0);
    };

    render = () => {
        return (
            <div className='cashier__wrapper account-transfer__no-balance'>
                <Icon icon='IconNoBalance' className='account-transfer__no-balance-icon' />
                <h2 className='withdraw__header'><Localize i18n_default_text='You have no funds in your {{website_name}} account' values={{ website_name }} /></h2>
                <p className='cashier__text'><Localize i18n_default_text='Please make a deposit to enable fund transfers.' /></p>
                <Button
                    className='account-transfer__no-balance-button'
                    has_effect
                    text={localize('Deposit now')}
                    onClick={this.onClickDeposit}
                    primary
                />
            </div>
        );
    }
}

AccountTransferNoBalance.propTypes = {
    setModalIndex: PropTypes.func,
};

export default AccountTransferNoBalance;
