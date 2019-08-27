import PropTypes        from 'prop-types';
import React            from 'react';
import Localize         from 'App/Components/Elements/localize.jsx';
import { connect }      from 'Stores/connect';
import Loading          from '../../../../templates/_common/components/loading.jsx';

class PaymentAgentList extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading />
                    :
                    <div className='payment-agent__wrapper'>
                        <p><Localize i18n_default_text='Payment agent is an authorized party that can process deposits and withdrawals for you if your local payment methods or currencies are not supported on Deriv.' /></p>
                    </div>
                }
            </React.Fragment>
        );
    }
}

PaymentAgentList.propTypes = {
    is_loading: PropTypes.bool,
    onMount   : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        onMount   : modules.cashier.onMountPaymentAgent,
        is_loading: modules.cashier.is_loading,
    })
)(PaymentAgentList);
