import PropTypes        from 'prop-types';
import React            from 'react';
import { Button }       from 'deriv-components';
import Icon             from 'Assets/icon.jsx';
import Localize         from 'App/Components/Elements/localize.jsx';
import { localize }     from 'App/i18n';
import { connect }      from 'Stores/connect';

class TransferNoBalance extends React.Component {
    onClickDeposit = () => {
        // index of deposit tab in the cashier modal is 0
        this.props.setModalIndex(0);
    };

    render = () => {
        return (
            <div className='cashier__wrapper account-transfer__no-balance'>
                <Icon icon='IconNoBalance' className='account-transfer__no-balance-icon' />
                <h2 className='withdraw__header'><Localize i18n_default_text='You have no funds in your {{currency}} account' values={{ currency: this.props.currency.toUpperCase() }} /></h2>
                <p className='cashier__text'><Localize i18n_default_text='Please make a deposit to use this feature.' /></p>
                <Button
                    className='btn--primary--default account-transfer__no-balance-button'
                    has_effect
                    text={localize('Deposit now')}
                    onClick={this.onClickDeposit}
                />
            </div>
        );
    }
}

TransferNoBalance.propTypes = {
    currency     : PropTypes.string,
    setModalIndex: PropTypes.func,
};

export default connect(
    ({ client }) => ({
        currency: client.currency,
    })
)(TransferNoBalance);

