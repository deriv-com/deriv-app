import PropTypes        from 'prop-types';
import React            from 'react';
import { Button }       from 'deriv-components';
import Icon             from 'Assets/icon.jsx';
import Localize         from 'App/Components/Elements/localize.jsx';
import { website_name } from 'App/Constants/app-config';
import { localize }     from 'App/i18n';

class AccountTransferNoBalance extends React.Component {
    onClickDeposit = () => {
        this.props.setModalIndex(0);
    };

    render = () => {
        return (
            <div className='cashier__wrapper account-transfer__no-balance'>
                <Icon icon='IconNoBalance' className='account-transfer__no-balance-icon' />
                <h2 className='withdraw__header'><Localize i18n_default_text='You have no funds in any of your {{website_name}} accounts' values={{ website_name }} /></h2>
                <p className='cashier__text'><Localize i18n_default_text='Please make a deposit to enable fund transfer between accounts.' /></p>
                <Button
                    className='btn--primary btn--primary--orange account-transfer__no-balance-button'
                    has_effect
                    text={localize('Deposit now')}
                    onClick={this.onClickDeposit}
                />
            </div>
        );
    }
}

AccountTransferNoBalance.propTypes = {
    setModalIndex: PropTypes.func,
};

export default AccountTransferNoBalance;
